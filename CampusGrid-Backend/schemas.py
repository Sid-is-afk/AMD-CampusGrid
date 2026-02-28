from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# This defines what the frontend must send us to create a user
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "Student"
    student_id: Optional[str] = None

# This defines what we safely send back to the frontend (NO PASSWORDS!)
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    student_id: Optional[str]

    class Config:
        from_attributes = True

# Add this at the bottom of schemas.py
class UserLogin(BaseModel):
    email: EmailStr
    password: str        

    # --- NEW: GPU Lab Resource Schemas ---
class ResourceBase(BaseModel):
    name: str
    resource_type: str
    total_capacity: int
    available_capacity: int

class ResourceCreate(ResourceBase):
    pass

class ResourceResponse(ResourceBase):
    id: int

    class Config:
        from_attributes = True # Tells Pydantic to read the SQLite database safely


# --- NEW: Bidding Engine Schemas ---
class BidBase(BaseModel):
    bid_amount: float
    resource_id: int # Which GPU they are bidding on

class BidCreate(BidBase):
    pass

class BidResponse(BidBase):
    id: int
    bid_amount: float
    resource_id: int
    user_id: int # Who placed the bid
    status: str
    created_at: datetime

    class Config:
        from_attributes = True