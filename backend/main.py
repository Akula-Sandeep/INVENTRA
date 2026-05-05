import os
from datetime import datetime, timedelta
import hashlib
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import session, engine
import database_models
from models import Product, UserRegister

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

allowed_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

# Example for production: set CORS_ORIGINS to
# http://localhost:3000,https://your-vercel-app.vercel.app
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "https://inventra-puce-three.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


database_models.Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(hashed)


def verify_password(plain_password: str, hashed_password: str):
    hashed = hashlib.sha256(plain_password.encode()).hexdigest()
    return pwd_context.verify(hashed, hashed_password)


SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-locally")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):

    # check if user already exists by email
    existing_user_email = db.query(database_models.User).filter(
        database_models.User.email == user.email
    ).first()

    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # check if user already exists by username
    existing_user_username = db.query(database_models.User).filter(
        database_models.User.username == user.username
    ).first()

    if existing_user_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    # create new user
    new_user = database_models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = db.query(database_models.User).filter(
        database_models.User.email == form_data.username
    ).first()
    if not db_user:
        db_user = db.query(database_models.User).filter(
            database_models.User.username == form_data.username
        ).first()

    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    access_token = create_access_token(
        data={"sub": db_user.email, "user_id": db_user.id}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/")
def greet():
    return {"message": "Welcome to this page!!"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db_user = db.query(database_models.User).filter(database_models.User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return db_user

@app.get("/products")
def get_all_products(
    current_user: database_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(database_models.Product)
        .filter(database_models.Product.user_id == current_user.id)
        .all()
    )


@app.get("/products/{id}")
def get_product_by_id(
    id: int,
    current_user: database_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id,
        database_models.Product.user_id == current_user.id,
    ).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@app.post("/products")
def add_product(
    product: Product,
    current_user: database_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_product = database_models.Product(
        name=product.name,
        description=product.description,
        price=product.price,
        quantity=product.quantity,
        user_id=current_user.id,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return {"message": "Product added", "product_id": new_product.id}

@app.put("/products/{id}")
def update_product(
    id: int,
    product: Product,
    current_user: database_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id,
        database_models.Product.user_id == current_user.id,
    ).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_product.name = product.name
    db_product.description = product.description
    db_product.price = product.price
    db_product.quantity = product.quantity

    db.commit()

    return {"message": "Updated successfully"}
    

@app.delete("/products/{id}")
def delete_product(
    id: int,
    current_user: database_models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_product = db.query(database_models.Product).filter(
        database_models.Product.id == id,
        database_models.Product.user_id == current_user.id,
    ).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(db_product)
    db.commit()
    return {"message": "Deleted successfully"}
    
