from pydantic import BaseModel, EmailStr, Field

class Product(BaseModel):
    name: str
    description: str
    price: float
    quantity: int


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    username: str
    password: str