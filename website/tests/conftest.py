"""
Pytest configuration and fixtures for GGenius Website testing.

This module provides shared fixtures and configuration for all test modules,
ensuring consistent and efficient testing across the entire platform.

Optimized for Python 3.11+ with proper async/await patterns and type hints.
"""

import pytest
import asyncio
import os
import tempfile
from typing import AsyncGenerator, Generator, Any, Dict
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import httpx
from fastapi.testclient import TestClient
from httpx import AsyncClient

# Import the main FastAPI application
from main import app, STATIC_DIR, TEMPLATES_DIR


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """
    Create an instance of the default event loop for the test session.
    
    This fixture ensures that async tests run properly across the entire test suite.
    Uses asyncio.new_event_loop() for better isolation between test sessions.
    
    Yields:
        asyncio.AbstractEventLoop: Event loop for the entire test session
    """
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        yield loop
    finally:
        try:
            # Cancel all running tasks
            pending = asyncio.all_tasks(loop)
            if pending:
                loop.run_until_complete(asyncio.gather(*pending, return_exceptions=True))
        except Exception:
            pass
        finally:
            loop.close()


@pytest.fixture(scope="function")
def client() -> Generator[TestClient, None, None]:
    """
    Create a test client for the FastAPI application.
    
    This fixture provides a synchronous test client for testing HTTP endpoints.
    Uses the actual FastAPI app for realistic testing.
    
    Returns:
        TestClient: Configured test client for making HTTP requests
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="function")
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async HTTP client for testing async endpoints.
    
    This fixture provides an asynchronous HTTP client for testing async operations.
    Properly configured for FastAPI app testing with realistic base URL.
    
    Yields:
        AsyncClient: Configured async client for making HTTP requests
    """
    async with AsyncClient(
        app=app, 
        base_url="http://testserver",
        headers={"User-Agent": "GGenius-Test-Client/1.0"}
    ) as ac:
        yield ac


@pytest.fixture(scope="function")
def temp_static_dir() -> Generator[Path, None, None]:
    """
    Create a temporary static directory for testing file operations.
    
    This fixture creates a temporary directory structure that mimics
    the real static directory for isolated testing.
    
    Yields:
        Path: Path to temporary static directory
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = Path(temp_dir)
        
        # Create necessary subdirectories
        (temp_path / "css").mkdir()
        (temp_path / "js").mkdir()
        (temp_path / "images").mkdir()
        
        # Create mock files
        (temp_path / "index.html").write_text(
            "<!DOCTYPE html><html><head><title>Test</title></head>"
            "<body><h1>Test Page</h1></body></html>"
        )
        (temp_path / "css" / "style.css").write_text("body { margin: 0; }")
        (temp_path / "js" / "enhancements.js").write_text("console.log('test');")
        
        yield temp_path


@pytest.fixture(scope="function")
def mock_database() -> Generator[AsyncMock, None, None]:
    """
    Mock database fixture for testing database operations.
    
    Provides a comprehensive mock for database operations including
    async session management and query simulation.
    
    Returns:
        AsyncMock: Mock database session for testing
    """
    mock_db = AsyncMock()
    
    # Mock common database operations
    mock_db.execute = AsyncMock()
    mock_db.commit = AsyncMock()
    mock_db.rollback = AsyncMock()
    mock_db.close = AsyncMock()
    
    # Mock query results
    mock_db.execute.return_value.fetchone = AsyncMock(return_value=None)
    mock_db.execute.return_value.fetchall = AsyncMock(return_value=[])
    mock_db.execute.return_value.rowcount = 0
    
    yield mock_db


@pytest.fixture(scope="function")
def mock_redis() -> Generator[AsyncMock, None, None]:
    """
    Mock Redis fixture for testing cache operations.
    
    Provides a realistic Redis mock with common operations
    for testing caching functionality.
    
    Returns:
        AsyncMock: Mock Redis client for testing
    """
    mock_redis = AsyncMock()
    
    # Mock Redis operations
    mock_redis.get = AsyncMock(return_value=None)
    mock_redis.set = AsyncMock(return_value=True)
    mock_redis.delete = AsyncMock(return_value=1)
    mock_redis.exists = AsyncMock(return_value=False)
    mock_redis.expire = AsyncMock(return_value=True)
    mock_redis.ping = AsyncMock(return_value=True)
    
    # Mock hash operations
    mock_redis.hget = AsyncMock(return_value=None)
    mock_redis.hset = AsyncMock(return_value=1)
    mock_redis.hdel = AsyncMock(return_value=1)
    
    # Mock list operations
    mock_redis.lpush = AsyncMock(return_value=1)
    mock_redis.rpop = AsyncMock(return_value=None)
    mock_redis.llen = AsyncMock(return_value=0)
    
    yield mock_redis


@pytest.fixture(scope="function")
def sample_user_data() -> Dict[str, Any]:
    """
    Provide comprehensive sample user data for testing.
    
    Returns detailed user data that can be used across
    different test scenarios and user-related operations.
    
    Returns:
        Dict[str, Any]: Sample user data for testing purposes
    """
    return {
        "id": 1,
        "username": "test_legend_player",
        "email": "test.player@ggenius.com",
        "display_name": "Legend Player",
        "game_id": "LEGEND123",
        "rank": "Mythic",
        "main_heroes": ["Kagura", "Fanny", "Gusion"],
        "is_active": True,
        "is_verified": True,
        "created_at": "2025-06-06T20:00:00Z",
        "last_login": "2025-06-06T20:25:00Z",
        "preferences": {
            "notifications": True,
            "newsletter": True,
            "role": "mid_laner",
            "language": "uk"
        },
        "stats": {
            "total_matches": 1247,
            "win_rate": 73.5,
            "favorite_mode": "Ranked",
            "total_tournaments": 8
        }
    }


@pytest.fixture(scope="function")
def sample_tournament_data() -> Dict[str, Any]:
    """
    Provide comprehensive sample tournament data for testing.
    
    Returns detailed tournament data for testing tournament
    creation, management, and participation scenarios.
    
    Returns:
        Dict[str, Any]: Sample tournament data for testing purposes
    """
    return {
        "id": 1,
        "name": "GGenius Championship 2025 - Spring Season",
        "description": "Revolutionary AI-powered MLBB tournament",
        "game": "Mobile Legends: Bang Bang",
        "format": "5v5_elimination",
        "max_participants": 32,
        "current_participants": 16,
        "prize_pool": 15000,
        "currency": "USD",
        "status": "registration_open",
        "region": "Southeast Asia",
        "skill_level": "mythic_plus",
        "registration_fee": 25,
        "created_at": "2025-06-06T20:00:00Z",
        "registration_deadline": "2025-06-20T23:59:59Z",
        "start_date": "2025-06-25T18:00:00Z",
        "end_date": "2025-06-27T22:00:00Z",
        "rules": {
            "draft_mode": "cm",
            "map": "5v5_ranked",
            "match_format": "bo3",
            "timeout_duration": 10
        },
        "rewards": {
            "first_place": 7500,
            "second_place": 4500,
            "third_place": 2250,
            "participation": 100
        },
        "organizer": {
            "id": 1,
            "name": "GGenius Tournament Team",
            "verified": True
        }
    }


@pytest.fixture(scope="function")
def sample_contact_form_data() -> Dict[str, Any]:
    """
    Provide sample contact form data for testing form submissions.
    
    Returns:
        Dict[str, Any]: Valid contact form data
    """
    return {
        "email": "interested.player@example.com",
        "game_id": "PLAYER2025",
        "interest": "tournaments",
        "message": "I'm very interested in joining GGenius tournaments and would like to know more about the AI coaching features. Can you provide more details about the upcoming tournaments?",
        "newsletter": True
    }


@pytest.fixture(scope="function")
def mock_email_service() -> Generator[AsyncMock, None, None]:
    """
    Mock email service for testing email sending functionality.
    
    Yields:
        AsyncMock: Mock email service
    """
    mock_service = AsyncMock()
    mock_service.send_email = AsyncMock(return_value={"success": True, "message_id": "test123"})
    mock_service.send_bulk_email = AsyncMock(return_value={"success": True, "sent_count": 1})
    mock_service.validate_email = AsyncMock(return_value=True)
    
    yield mock_service


@pytest.fixture(scope="function")
def mock_ai_service() -> Generator[AsyncMock, None, None]:
    """
    Mock AI service for testing AI-related functionality.
    
    Yields:
        AsyncMock: Mock AI service for match analysis and coaching
    """
    mock_service = AsyncMock()
    
    # Mock AI analysis methods
    mock_service.analyze_match = AsyncMock(return_value={
        "performance_score": 8.5,
        "recommendations": ["Focus on map awareness", "Improve last-hitting"],
        "hero_suggestions": ["Kagura", "Harith"],
        "analysis_id": "ai_analysis_123"
    })
    
    mock_service.generate_coaching_tips = AsyncMock(return_value={
        "tips": [
            "Practice combo execution in training mode",
            "Watch minimap every 3-5 seconds",
            "Time your ultimate usage better"
        ],
        "difficulty": "intermediate",
        "estimated_improvement_time": "2-3 weeks"
    })
    
    mock_service.predict_match_outcome = AsyncMock(return_value={
        "win_probability": 0.67,
        "key_factors": ["team_composition", "recent_performance"],
        "confidence": 0.82
    })
    
    yield mock_service


@pytest.fixture(scope="function")
def authentication_headers() -> Dict[str, str]:
    """
    Provide authentication headers for testing protected endpoints.
    
    Returns:
        Dict[str, str]: Authentication headers with mock JWT token
    """
    return {
        "Authorization": "Bearer mock_jwt_token_for_testing",
        "Content-Type": "application/json"
    }


@pytest.fixture(scope="function")
def mock_file_storage() -> Generator[MagicMock, None, None]:
    """
    Mock file storage service for testing file upload/download operations.
    
    Yields:
        MagicMock: Mock file storage service
    """
    mock_storage = MagicMock()
    
    mock_storage.upload_file = AsyncMock(return_value={
        "file_id": "mock_file_123",
        "url": "https://mock-storage.com/files/mock_file_123",
        "size": 1024
    })
    
    mock_storage.delete_file = AsyncMock(return_value={"success": True})
    mock_storage.get_file_url = AsyncMock(return_value="https://mock-storage.com/files/mock_file_123")
    
    yield mock_storage


# Performance testing fixtures
@pytest.fixture(scope="function")
def performance_monitor():
    """
    Fixture for monitoring test performance and resource usage.
    
    Can be used to ensure tests complete within acceptable time limits
    and don't consume excessive resources.
    """
    import time
    import psutil
    import threading
    
    class PerformanceMonitor:
        def __init__(self):
            self.start_time = None
            self.end_time = None
            self.memory_usage = []
            self.monitoring = False
            self.monitor_thread = None
        
        def start_monitoring(self):
            self.start_time = time.time()
            self.monitoring = True
            self.monitor_thread = threading.Thread(target=self._monitor_resources)
            self.monitor_thread.start()
        
        def stop_monitoring(self):
            self.end_time = time.time()
            self.monitoring = False
            if self.monitor_thread:
                self.monitor_thread.join()
        
        def _monitor_resources(self):
            process = psutil.Process()
            while self.monitoring:
                try:
                    memory_info = process.memory_info()
                    self.memory_usage.append(memory_info.rss / 1024 / 1024)  # MB
                    time.sleep(0.1)
                except:
                    break
        
        @property
        def execution_time(self) -> float:
            if self.start_time and self.end_time:
                return self.end_time - self.start_time
            return 0.0
        
        @property
        def peak_memory_mb(self) -> float:
            return max(self.memory_usage) if self.memory_usage else 0.0
        
        @property
        def average_memory_mb(self) -> float:
            return sum(self.memory_usage) / len(self.memory_usage) if self.memory_usage else 0.0
    
    return PerformanceMonitor()


# Configuration for different test environments
@pytest.fixture(scope="session")
def test_config() -> Dict[str, Any]:
    """
    Provide test configuration based on environment.
    
    Returns:
        Dict[str, Any]: Test configuration settings
    """
    return {
        "test_environment": os.getenv("TEST_ENV", "local"),
        "debug_mode": os.getenv("DEBUG", "false").lower() == "true",
        "database_url": os.getenv("TEST_DATABASE_URL", "sqlite:///test.db"),
        "redis_url": os.getenv("TEST_REDIS_URL", "redis://localhost:6379/1"),
        "api_timeout": 30,
        "max_test_duration": 300,  # 5 minutes
        "log_level": os.getenv("TEST_LOG_LEVEL", "INFO")
    }
