"""
Basic API tests for GGenius Website.

Tests fundamental API functionality and ensures proper
REST API conventions are followed throughout the platform.
"""

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient


@pytest.mark.skip(reason="API endpoints not yet implemented")
class TestAPIBasics:
    """
    Test suite for basic API functionality.
    
    These tests will be enabled once the main API endpoints
    are implemented. They ensure proper REST conventions
    and response formatting.
    """
    
    def test_api_version_endpoint(self, client: TestClient) -> None:
        """
        Test API version endpoint.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - Version endpoint returns correct format
            - Version information is accurate
            - Endpoint follows REST conventions
        """
        response = client.get("/api/v1/version")
        
        assert response.status_code == 200
        data = response.json()
        assert "version" in data
        assert "api_version" in data
        assert "build_date" in data
    
    def test_api_documentation_accessible(self, client: TestClient) -> None:
        """
        Test that API documentation is accessible.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - OpenAPI documentation is available
            - Swagger UI is accessible
            - Documentation is complete
        """
        # Test OpenAPI schema
        response = client.get("/openapi.json")
        assert response.status_code == 200
        
        # Test Swagger UI
        response = client.get("/docs")
        assert response.status_code == 200
        
        # Test ReDoc
        response = client.get("/redoc")
        assert response.status_code == 200
    
    @pytest.mark.asyncio
    async def test_cors_configuration(self, async_client: AsyncClient) -> None:
        """
        Test CORS configuration for API endpoints.
        
        Args:
            async_client: AsyncClient for testing
            
        Verifies:
            - CORS headers are properly set
            - Cross-origin requests are handled correctly
            - Security headers are present
        """
        response = await async_client.options("/api/v1/health")
        
        # Check CORS headers
        headers = response.headers
        assert "access-control-allow-origin" in headers
        assert "access-control-allow-methods" in headers
        assert "access-control-allow-headers" in headers


@pytest.mark.skip(reason="User endpoints not yet implemented")
class TestUserEndpoints:
    """
    Test suite for user-related API endpoints.
    
    Will test user registration, authentication, profile management,
    and other user-related functionality once implemented.
    """
    
    def test_user_registration(self, client: TestClient, sample_user_data: dict) -> None:
        """
        Test user registration endpoint.
        
        Args:
            client: FastAPI test client
            sample_user_data: Sample user data for testing
            
        Verifies:
            - User can register successfully
            - Validation works correctly
            - Proper response format
        """
        registration_data = {
            "username": sample_user_data["username"],
            "email": sample_user_data["email"],
            "password": "SecurePassword123!"
        }
        
        response = client.post("/api/v1/users/register", json=registration_data)
        assert response.status_code == 201
        
        data = response.json()
        assert "id" in data
        assert data["username"] == registration_data["username"]
        assert data["email"] == registration_data["email"]
        assert "password" not in data  # Password should not be returned
    
    def test_user_login(self, client: TestClient) -> None:
        """
        Test user login endpoint.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - User can login with correct credentials
            - JWT token is returned
            - Invalid credentials are rejected
        """
        login_data = {
            "username": "test_player",
            "password": "SecurePassword123!"
        }
        
        response = client.post("/api/v1/auth/login", json=login_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"


@pytest.mark.skip(reason="Tournament endpoints not yet implemented")
class TestTournamentEndpoints:
    """
    Test suite for tournament-related API endpoints.
    
    Will test tournament creation, registration, management,
    and bracket functionality once implemented.
    """
    
    def test_tournament_creation(
        self, 
        client: TestClient, 
        sample_tournament_data: dict
    ) -> None:
        """
        Test tournament creation endpoint.
        
        Args:
            client: FastAPI test client
            sample_tournament_data: Sample tournament data
            
        Verifies:
            - Tournament can be created
            - Data validation works
            - Proper response format
        """
        response = client.post("/api/v1/tournaments", json=sample_tournament_data)
        assert response.status_code == 201
        
        data = response.json()
        assert "id" in data
        assert data["name"] == sample_tournament_data["name"]
        assert data["max_participants"] == sample_tournament_data["max_participants"]
    
    def test_tournament_list(self, client: TestClient) -> None:
        """
        Test tournament listing endpoint.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - Tournaments can be listed
            - Pagination works correctly
            - Filtering options work
        """
        response = client.get("/api/v1/tournaments")
        assert response.status_code == 200
        
        data = response.json()
        assert "tournaments" in data
        assert "total" in data
        assert isinstance(data["tournaments"], list)
