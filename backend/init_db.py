from database import engine, SessionLocal
import models
from schemas import UserRole
from auth import get_password_hash
import logging

# Loglama ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    try:
        # Veritabanı tablolarını oluştur
        models.Base.metadata.create_all(bind=engine)
        logger.info("Veritabanı tabloları oluşturuldu!")
        
        # İlk admin kullanıcısını oluştur
        db = SessionLocal()
        try:
            # Admin kullanıcısı var mı kontrol et
            admin = db.query(models.User).filter(models.User.email == "admin@restaurant.com").first()
            if not admin:
                admin_user = models.User(
                    email="admin@restaurant.com",
                    hashed_password=get_password_hash("admin123"),
                    full_name="Admin User",
                    role=UserRole.ADMIN,
                    is_active=True
                )
                db.add(admin_user)
                db.commit()
                logger.info("Admin kullanıcısı oluşturuldu!")
            else:
                logger.info("Admin kullanıcısı zaten mevcut.")
        except Exception as e:
            logger.error(f"Admin kullanıcısı oluşturulurken hata: {str(e)}")
            db.rollback()
            raise
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Veritabanı başlatılırken hata: {str(e)}")
        raise

if __name__ == "__main__":
    init_db() 