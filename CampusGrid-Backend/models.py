from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) 
    student_id = Column(String, unique=True, index=True, nullable=True)

    # A user can place many bids
    bids = relationship("Bid", back_populates="owner")

# NEW: The GPU Lab Resources Table
class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True) # e.g., "NVIDIA RTX 4090", "A100 Cluster"
    resource_type = Column(String) # e.g., "GPU", "CPU", "Server"
    total_capacity = Column(Integer) # How many are in the lab total
    available_capacity = Column(Integer) # How many are currently free

    bids = relationship("Bid", back_populates="resource")

# NEW: The Bidding System Table
class Bid(Base):
    __tablename__ = "bids"

    id = Column(Integer, primary_key=True, index=True)
    bid_amount = Column(Float) # How many credits the student is offering
    status = Column(String, default="pending") # pending, approved, or rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Link the bid to the User who made it
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="bids")

    # Link the bid to the Resource they want
    resource_id = Column(Integer, ForeignKey("resources.id"))
    resource = relationship("Resource", back_populates="bids")