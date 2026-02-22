import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User, StudentProfile
from app.models.company import Company
from app.models.drive import Drive
from app.auth import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        # 1. Admin User
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            admin = User(
                email="admin@example.com",
                name="Super Admin",
                role="admin",
                hashed_password=get_password_hash("admin123")
            )
            db.add(admin)
            
        # 2. Student User
        student = db.query(User).filter(User.email == "student@example.com").first()
        if not student:
            student = User(
                email="student@example.com",
                name="John Doe",
                role="student",
                hashed_password=get_password_hash("student123")
            )
            db.add(student)
            
        db.commit()

        # Refresh objects to get IDs
        db.refresh(admin)
        db.refresh(student)

        # 3. Student Profile
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == student.id).first()
        if not profile:
            profile = StudentProfile(
                user_id=student.id,
                reg_number="REG2024-001",
                department="Computer Science",
                year="Final Year",
                cgpa=8.5
            )
            db.add(profile)
            db.commit()

        # 4. Companies
        company1 = db.query(Company).filter(Company.name == "Tech Innovators Inc.").first()
        if not company1:
            company1 = Company(
                name="Tech Innovators Inc.",
                description="Leading cloud and AI solutions provider."
            )
            db.add(company1)
            
        company2 = db.query(Company).filter(Company.name == "Global Finance Corp.").first()
        if not company2:
            company2 = Company(
                name="Global Finance Corp.",
                description="Multinational investment banking and financial services."
            )
            db.add(company2)
            
        db.commit()
        db.refresh(company1)
        db.refresh(company2)

        # 5. Drives
        drive1 = db.query(Drive).filter(Drive.company_id == company1.id).first()
        if not drive1:
            drive1 = Drive(
                company_id=company1.id,
                role="Software Engineer - Cloud",
                ctc="15 LPA",
                location="Bangalore, India",
                eligibility_cgpa=8.0,
                status="Active"
            )
            db.add(drive1)
            
        drive2 = db.query(Drive).filter(Drive.company_id == company2.id).first()
        if not drive2:
            drive2 = Drive(
                company_id=company2.id,
                role="Quantitative Analyst",
                ctc="22 LPA",
                location="Mumbai, India",
                eligibility_cgpa=8.5,
                status="Active"
            )
            db.add(drive2)

        db.commit()
        
        print("\n" + "="*50)
        print("✅ Demo data successfully initialized!")
        print("="*50)
        print("🧑‍💻 Admin Credentials:")
        print("   Email: admin@example.com")
        print("   Password: admin123")
        print("-" * 50)
        print("🎓 Student Credentials:")
        print("   Email: student@example.com")
        print("   Password: student123")
        print("=" * 50 + "\n")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
