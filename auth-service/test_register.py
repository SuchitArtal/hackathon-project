import pytest
from httpx import AsyncClient

BASE_URL = "http://localhost:8000"

@pytest.mark.asyncio
async def test_register_happy_path():
    async with AsyncClient(base_url=BASE_URL) as ac:
        resp = await ac.post("/register", json={
            "full_name": "Test User",
            "email": "testuser@example.com",
            "password": "Password1!",
            "password_confirm": "Password1!",
            "terms_accepted": True
        })
        assert resp.status_code == 200
        assert "token" in resp.json()

@pytest.mark.asyncio
async def test_register_existing_email():
    async with AsyncClient(base_url=BASE_URL) as ac:
        await ac.post("/register", json={
            "full_name": "Test User",
            "email": "testuser2@example.com",
            "password": "Password1!",
            "password_confirm": "Password1!",
            "terms_accepted": True
        })
        resp = await ac.post("/register", json={
            "full_name": "Test User",
            "email": "testuser2@example.com",
            "password": "Password1!",
            "password_confirm": "Password1!",
            "terms_accepted": True
        })
        assert resp.status_code == 409

@pytest.mark.asyncio
async def test_register_weak_password():
    async with AsyncClient(base_url=BASE_URL) as ac:
        resp = await ac.post("/register", json={
            "full_name": "Test User",
            "email": "testuser3@example.com",
            "password": "weakpass",
            "password_confirm": "weakpass",
            "terms_accepted": True
        })
        assert resp.status_code == 422 