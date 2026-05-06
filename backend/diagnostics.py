import os
import sys
from datetime import datetime

print("=" * 60)
print(f"Inventra Diagnostics - {datetime.now()}")
print("=" * 60)

# Check Python version
print(f"\n✓ Python Version: {sys.version}")

# Check environment variables
print("\n📋 Environment Variables:")
env_vars = [
    "DATABASE_URL",
    "SECRET_KEY",
    "CORS_ORIGINS",
    "ACCESS_TOKEN_EXPIRE_MINUTES"
]

for var in env_vars:
    value = os.environ.get(var, "NOT SET")
    masked_value = value if var in ["CORS_ORIGINS"] else (value[:10] + "..." if len(value) > 10 else value)
    print(f"  {var}: {masked_value}")

# Check database connection
print("\n🔗 Database Connection:")
try:
    from database import engine
    print(f"  Database URL: {os.environ.get('DATABASE_URL', 'Using SQLite')[:50]}...")
    with engine.connect() as conn:
        print("  ✓ Database connection successful")
except Exception as e:
    print(f"  ✗ Database connection failed: {str(e)}")

# Check models
print("\n📦 Database Models:")
try:
    import database_models
    print("  ✓ database_models imported successfully")
    print(f"  Tables: {[mapper.class_.__name__ for mapper in database_models.Base.registry.mappers]}")
except Exception as e:
    print(f"  ✗ Failed to import models: {str(e)}")

# Check dependencies
print("\n📚 Key Dependencies:")
deps = ["fastapi", "sqlalchemy", "pydantic", "passlib", "jose", "bcrypt"]
for dep in deps:
    try:
        mod = __import__(dep)
        version = getattr(mod, "__version__", "unknown")
        print(f"  ✓ {dep}: {version}")
    except ImportError:
        print(f"  ✗ {dep}: NOT INSTALLED")

# Check CORS configuration
print("\n🔐 CORS Configuration:")
try:
    from main import cors_origins
    print(f"  Allowed origins: {len(cors_origins)} domain(s)")
    for origin in cors_origins:
        print(f"    - {origin}")
except Exception as e:
    print(f"  ✗ Failed to check CORS: {str(e)}")

print("\n" + "=" * 60)
print("Diagnostics complete. Check values above for issues.")
print("=" * 60)
