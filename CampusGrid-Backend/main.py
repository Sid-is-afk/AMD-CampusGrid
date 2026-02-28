from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import models, schemas, security
import jwt
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusGrid Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# --------------------------------------------------
# ROOT
# --------------------------------------------------


@app.get("/")
def read_root():
    return {"status": "online", "message": "CampusGrid Matching Engine is live!"}


# --------------------------------------------------
# AUTH ROUTES
# --------------------------------------------------


@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = security.get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw,
        role=user.role,
        student_id=user.student_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not db_user or not security.verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = security.create_access_token(data={"sub": db_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role,
            "student_id": db_user.student_id,
        },
    }


@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# --------------------------------------------------
# RESOURCE ROUTES
# --------------------------------------------------


@app.post("/resources", response_model=schemas.ResourceResponse)
def create_resource(
    resource: schemas.ResourceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_resource = models.Resource(**resource.dict())
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource


@app.get("/resources", response_model=list[schemas.ResourceResponse])
def get_resources(db: Session = Depends(get_db)):
    return db.query(models.Resource).all()


# --------------------------------------------------
# BID ROUTES
# --------------------------------------------------


@app.post("/bids", response_model=schemas.BidResponse)
def place_bid(
    bid: schemas.BidCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    resource = db.query(models.Resource).filter(models.Resource.id == bid.resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    new_bid = models.Bid(
        bid_amount=bid.bid_amount,
        resource_id=bid.resource_id,
        user_id=current_user.id,
    )
    db.add(new_bid)
    db.commit()
    db.refresh(new_bid)
    return new_bid


@app.get("/bids", response_model=list[schemas.BidResponse])
def get_all_bids(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Bid).order_by(models.Bid.id.desc()).all()


# --------------------------------------------------
# LEGACY STATS
# --------------------------------------------------


@app.get("/stats/summary")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    total_requests = db.query(models.Bid).count()
    available_labs = (
        db.query(models.Resource).filter(models.Resource.available_capacity > 0).count()
    )
    my_active_bids = (
        db.query(models.Bid).filter(models.Bid.user_id == current_user.id).count()
    )
    return {
        "total_requests": total_requests,
        "available_labs": available_labs,
        "my_bids": my_active_bids,
        "system_load": "Low" if total_requests < 10 else "High",
    }


# --------------------------------------------------
# DASHBOARD SYNC  (polled every 5 s by the frontend)
# --------------------------------------------------


@app.get("/dashboard/sync")
def dashboard_sync(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Returns a complete dashboard snapshot for the logged-in user:
      - total_bids        : campus-wide bid count
      - available_labs    : resources with remaining capacity
      - my_bids           : the current user's bids (newest first)
      - usage_by_resource : bid count per resource name (for bar chart)
    """
    # 1. Campus-wide totals
    total_bids = db.query(models.Bid).count()
    available_labs = (
        db.query(models.Resource)
        .filter(models.Resource.available_capacity > 0)
        .count()
    )

    # 2. Current user's bids
    raw_my_bids = (
        db.query(models.Bid)
        .filter(models.Bid.user_id == current_user.id)
        .order_by(models.Bid.id.desc())
        .all()
    )
    my_bids = [
        {
            "id": b.id,
            "resource_id": b.resource_id,
            "bid_amount": b.bid_amount,
            "status": b.status,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        }
        for b in raw_my_bids
    ]

    # 3. Bid count grouped by resource (outer join keeps zero-bid resources)
    usage_rows = (
        db.query(
            models.Resource.name,
            func.count(models.Bid.id).label("bids"),
        )
        .outerjoin(models.Bid, models.Bid.resource_id == models.Resource.id)
        .group_by(models.Resource.name)
        .all()
    )
    usage_by_resource = [{"name": row.name, "bids": row.bids} for row in usage_rows]

    return {
        "total_bids": total_bids,
        "available_labs": available_labs,
        "my_bids": my_bids,
        "usage_by_resource": usage_by_resource,
    }