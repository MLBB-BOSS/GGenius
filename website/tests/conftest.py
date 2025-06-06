"""
Pytest configuration and fixtures for GGenius Website testing.

This module provides shared fixtures and configuration for all test modules,
ensuring consistent and efficient testing across the entire platform.
"""

import pytest
import asyncio
from typing import AsyncGenerator, Generator
from httpx import AsyncClient
from fastapi.testclient import TestClient

# Import your main FastAPI app
# from main import app


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """
    Create an instance of the default event loop for the test session.
    
    This fixture ensures that async tests run properly across the entire test suite.
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """
    Create a test client for the FastAPI application.
    
    Returns:
        TestClient: Configured test client for making HTTP requests
    """
    # Uncomment when main app is ready
    # with TestClient(app) as test_client:
    #     yield test_client
    
    # Temporary mock for initial testing
    from fastapi import FastAPI
    temp_app = FastAPI()
    
    @temp_app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "ggenius-website"}
    
    with TestClient(temp_app) as test_client:
        yield test_client


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async HTTP client for testing async endpoints.
    
    Yields:
        AsyncClient: Configured async client for making HTTP requests
    """
    # Uncomment when main app is ready
    # async with AsyncClient(app=app, base_url="http://testserver") as ac:
    #     yield ac
    
    # Temporary mock for initial testing
    from fastapi import FastAPI
    temp_app = FastAPI()
    
    @temp_app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "ggenius-website"}
    
    async with AsyncClient(app=temp_app, base_url="http://testserver") as ac:
        yield ac


@pytest.fixture
def mock_database():
    """
    Mock database fixture for testing database operations.
    
    Returns:
        Mock database session for testing
    """
    # Implement mock database logic here
    # This could be an in-memory SQLite database or a mock object
    pass


@pytest.fixture
def mock_redis():
    """
    Mock Redis fixture for testing cache operations.
    
    Returns:
        Mock Redis client for testing
    """
    # Implement mock Redis logic here
    pass


@pytest.fixture
def sample_user_data():
    """
    Provide sample user data for testing.
    
    Returns:
        dict: Sample user data for testing purposes
    """
    return {
        "id": 1,
        "username": "test_player",
        "email": "test@ggenius.com",
        "is_active": True,
        "created_at": "2025-06-06T20:00:00Z"
    }


@pytest.fixture
def sample_tournament_data():
    """
    Provide sample tournament data for testing.
    
    Returns:
        dict: Sample tournament data for testing purposes
    """
    return {
        "id": 1,
        "name": "GGenius Championship 2025",
        "game": "Mobile Legends: Bang Bang",
        "max_participants": 32,
        "prize_pool": 10000,
        "status": "upcoming",
        "created_at": "2025-06-06T20:00:00Z"
    }
