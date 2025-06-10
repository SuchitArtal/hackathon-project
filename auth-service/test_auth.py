import requests
import json

BASE_URL = "http://localhost:8000/api/auth"

def test_registration():
    print("\n=== Testing Registration ===")
    # Test data
    test_user = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    # Make request
    response = requests.post(f"{BASE_URL}/register", json=test_user)
    
    # Print results
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 200 else None

def test_login():
    print("\n=== Testing Login ===")
    # Test data
    test_user = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    # Make request
    response = requests.post(f"{BASE_URL}/login", json=test_user)
    
    # Print results
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.status_code == 200 else None

def test_wrong_password():
    print("\n=== Testing Wrong Password ===")
    # Test data with wrong password
    test_user = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    # Make request
    response = requests.post(f"{BASE_URL}/login", json=test_user)
    
    # Print results
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

def test_duplicate_registration():
    print("\n=== Testing Duplicate Registration ===")
    # Test data (same as first registration)
    test_user = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    # Make request
    response = requests.post(f"{BASE_URL}/register", json=test_user)
    
    # Print results
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    print("Starting Authentication Tests...")
    
    # Run tests
    test_registration()
    test_login()
    test_wrong_password()
    test_duplicate_registration()
    
    print("\nTests completed!") 