import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app, get_db, Base

# Base de datos de prueba en memoria
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hotel Costa Bella API"}

def test_create_reservation(client):
    reservation_data = {
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan@test.com",
        "phone": "1234567890",
        "country": "Costa Rica",
        "city": "San José",
        "checkin_date": "2025-08-15",
        "checkout_date": "2025-08-17",
        "guests": 2,
        "room_type": "Suite Vista al Mar",
        "comments": "Sin comentarios"
    }
    
    response = client.post("/reservations", json=reservation_data)
    assert response.status_code == 200
    assert "reservation_id" in response.json()

def test_create_contact(client):
    contact_data = {
        "full_name": "María García",
        "email": "maria@test.com",
        "message": "Consulta sobre disponibilidad"
    }
    
    response = client.post("/contact", json=contact_data)
    assert response.status_code == 200
    assert "message_id" in response.json()

def test_get_reservations(client):
    response = client.get("/reservations")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_invalid_reservation_data(client):
    invalid_data = {
        "first_name": "",  # Nombre vacío
        "last_name": "Pérez",
        "email": "invalid-email",  # Email inválido
        "guests": 15,  # Demasiados huéspedes
        "checkin_date": "2025-08-17",
        "checkout_date": "2025-08-15"  # Checkout antes que checkin
    }
    
    response = client.post("/reservations", json=invalid_data)
    assert response.status_code == 422  # Validation error
