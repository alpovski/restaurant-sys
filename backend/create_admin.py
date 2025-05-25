from database import get_db
from models import User
from schemas import UserCreate
from auth import get_password_hash

def create_admin_user():
    db = next(get_db())
    
    # Admin kullanıcı bilgileri
    admin_data = UserCreate(
        email="admin@restaurant.com",
        password="admin123",
        full_name="Admin User",
        role="admin"
    )
    
    # Kullanıcı zaten var mı kontrol et
    existing_user = db.query(User).filter(User.email == admin_data.email).first()
    if existing_user:
        print("Admin kullanıcısı zaten mevcut!")
        return
    
    # Yeni admin kullanıcısı oluştur
    hashed_password = get_password_hash(admin_data.password)
    new_admin = User(
        email=admin_data.email,
        hashed_password=hashed_password,
        full_name=admin_data.full_name,
        role=admin_data.role
    )
    
    db.add(new_admin)
    db.commit()
    print("Admin kullanıcısı başarıyla oluşturuldu!")

if __name__ == "__main__":
    create_admin_user() 