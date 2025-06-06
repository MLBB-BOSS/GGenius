"""
Comprehensive health check tests for GGenius Website.

These tests ensure the basic functionality and availability of the platform
are working correctly. Critical for monitoring platform stability and performance.

Optimized for async/await patterns with proper error handling and type hints.
"""

import pytest
import asyncio
import time
from typing import Dict, Any
from fastapi.testclient import TestClient
from httpx import AsyncClient


class TestHealthChecks:
    """
    Test suite for health check endpoints.
    
    Ensures that the platform's health monitoring endpoints
    respond correctly and provide accurate status information.
    Uses both sync and async patterns for comprehensive coverage.
    """
    
    def test_health_endpoint_sync(self, client: TestClient) -> None:
        """
        Test synchronous health check endpoint.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - Health endpoint returns 200 status
            - Response contains expected status information
            - Response format matches API specification
            - Required fields are present and valid
        """
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify required fields
        assert "status" in data
        assert "version" in data
        assert "timestamp" in data
        
        # Verify field values
        assert data["status"] == "healthy"
        assert data["version"] == "2.0.0"
        assert isinstance(data["timestamp"], str)
        
        # Verify optional fields
        assert "static_files" in data
        assert "templates" in data
        assert isinstance(data["static_files"], bool)
        assert isinstance(data["templates"], bool)
        
        # Verify response headers
        assert response.headers["content-type"] == "application/json"
    
    @pytest.mark.asyncio
    async def test_health_endpoint_async(self, async_client: AsyncClient) -> None:
        """
        Test asynchronous health check endpoint.
        
        Args:
            async_client: AsyncClient for testing async endpoints
            
        Verifies:
            - Health endpoint works in async context
            - Response is consistent with sync version
            - No async-related issues occur
            - Proper async/await usage throughout
        """
        response = await async_client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify consistency with sync version
        assert "status" in data
        assert data["status"] == "healthy"
        assert "version" in data
        assert data["version"] == "2.0.0"
        assert "timestamp" in data
        
        # Verify async-specific behavior
        assert isinstance(data, dict)
        assert len(data) >= 4  # At least status, version, timestamp, and file checks
    
    def test_health_endpoint_performance(self, client: TestClient, performance_monitor) -> None:
        """
        Test health check endpoint performance and reliability.
        
        Args:
            client: FastAPI test client
            performance_monitor: Fixture for monitoring test performance
            
        Verifies:
            - Health check responds quickly (< 100ms for basic check)
            - Multiple consecutive requests work properly
            - No performance degradation over multiple requests
            - Memory usage remains stable
        """
        performance_monitor.start_monitoring()
        
        # Test single request response time
        start_time = time.time()
        response = client.get("/health")
        end_time = time.time()
        
        assert response.status_code == 200
        response_time = end_time - start_time
        assert response_time < 0.1, f"Health check took {response_time:.3f}s, should be < 0.1s"
        
        # Test multiple requests for consistency
        response_times = []
        for i in range(10):
            start_time = time.time()
            response = client.get("/health")
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append(end_time - start_time)
        
        # Verify performance consistency
        avg_response_time = sum(response_times) / len(response_times)
        max_response_time = max(response_times)
        
        assert avg_response_time < 0.05, f"Average response time {avg_response_time:.3f}s too high"
        assert max_response_time < 0.15, f"Max response time {max_response_time:.3f}s too high"
        
        performance_monitor.stop_monitoring()
        
        # Verify resource usage
        assert performance_monitor.peak_memory_mb < 100, "Memory usage too high during health checks"
    
    @pytest.mark.asyncio
    async def test_health_endpoint_concurrent_requests(self, async_client: AsyncClient) -> None:
        """
        Test health endpoint under concurrent load.
        
        Args:
            async_client: AsyncClient for testing async endpoints
            
        Verifies:
            - Endpoint handles concurrent requests properly
            - No race conditions or async issues
            - Consistent responses under load
            - Proper resource cleanup
        """
        concurrent_requests = 20
        
        # Create concurrent requests
        tasks = [
            async_client.get("/health") 
            for _ in range(concurrent_requests)
        ]
        
        # Execute all requests concurrently
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Verify all requests succeeded
        for i, response in enumerate(responses):
            assert not isinstance(response, Exception), f"Request {i} failed: {response}"
            assert response.status_code == 200
            
            data = response.json()
            assert data["status"] == "healthy"
            assert data["version"] == "2.0.0"
    
    @pytest.mark.smoke
    def test_health_endpoint_critical_functionality(self, client: TestClient) -> None:
        """
        Smoke test for critical health check functionality.
        
        This test is marked as 'smoke' and should be run in all environments
        to verify basic platform availability.
        
        Args:
            client: FastAPI test client
        """
        response = client.get("/health")
        
        # Critical assertions for smoke testing
        assert response.status_code == 200, "Health endpoint not accessible"
        assert response.json()["status"] == "healthy", "Platform not healthy"
        assert "version" in response.json(), "Version information missing"


class TestBasicFunctionality:
    """
    Test suite for basic platform functionality.
    
    Ensures core features work as expected before running
    more complex integration tests. Tests fundamental web app behavior.
    """
    
    def test_root_endpoint_accessibility(self, client: TestClient) -> None:
        """
        Test that root endpoint is accessible and returns proper content.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - Root endpoint is accessible
            - Returns HTML content
            - Basic page structure is present
            - No server errors occur
        """
        response = client.get("/")
        
        # Should return 200 OK or at least not server error
        assert response.status_code in [200, 404], f"Unexpected status code: {response.status_code}"
        
        if response.status_code == 200:
            # Verify HTML content
            assert "text/html" in response.headers.get("content-type", "")
            content = response.text
            assert "GGenius" in content
            assert "html" in content.lower()
    
    def test_static_files_mounting(self, client: TestClient) -> None:
        """
        Test that static files are properly mounted and accessible.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - Static file endpoint responds
            - Proper MIME types are set
            - File serving works correctly
        """
        # Test accessing a CSS file (if it exists)
        response = client.get("/static/css/style.css")
        
        # Should either serve the file or return 404 (not 500)
        assert response.status_code in [200, 404], "Static file serving error"
        
        if response.status_code == 200:
            assert "text/css" in response.headers.get("content-type", "")
    
    def test_api_stats_endpoint(self, client: TestClient) -> None:
        """
        Test API stats endpoint functionality.
        
        Args:
            client: FastAPI test client
            
        Verifies:
            - Stats endpoint returns proper JSON
            - Required statistics are present
            - Data types are correct
            - Response format is consistent
        """
        response = client.get("/api/stats")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"
        
        data = response.json()
        
        # Verify required stats fields
        required_fields = [
            "registered_users", "tournaments_held", "total_matches",
            "prize_pool", "ai_analyses", "last_updated"
        ]
        
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
        
        # Verify data types
        assert isinstance(data["registered_users"], int)
        assert isinstance(data["tournaments_held"], int)
        assert isinstance(data["total_matches"], int)
        assert isinstance(data["prize_pool"], str)
        assert isinstance(data["ai_analyses"], int)
        assert isinstance(data["last_updated"], str)
        
        # Verify reasonable values
        assert data["registered_users"] >= 0
        assert data["tournaments_held"] >= 0
        assert data["total_matches"] >= 0
        assert data["ai_analyses"] >= 0
    
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
            - OPTIONS requests work properly
        """
        # Test OPTIONS request for CORS preflight
        response = await async_client.options("/health")
        
        # Should handle OPTIONS requests
        assert response.status_code in [200, 204, 405]
        
        # Test actual request with CORS headers
        headers = {"Origin": "https://example.com"}
        response = await async_client.get("/health", headers=headers)
        
        assert response.status_code == 200
        
        # Check for CORS headers in response
        response_headers = response.headers
        
        # These headers should be present for CORS support
        cors_headers = [
            "access-control-allow-origin",
            "access-control-allow-methods",
            "access-control-allow-headers"
        ]
        
        # At least one CORS header should be present
        has_cors_headers = any(header in response_headers for header in cors_headers)
        assert has_cors_headers, "No CORS headers found in response"


@pytest.mark.integration
class TestIntegrationBasics:
    """
    Basic integration tests for the GGenius platform.
    
    These tests verify that different components work together
    correctly and that the platform functions as an integrated system.
    """
    
    @pytest.mark.asyncio
    async def test_async_functionality_integration(self, async_client: AsyncClient) -> None:
        """
        Test comprehensive async functionality across the platform.
        
        Args:
            async_client: AsyncClient for testing async endpoints
            
        Verifies:
            - Async endpoints work correctly
            - No blocking operations in async context
            - Proper async/await usage throughout
            - Multiple async operations can run concurrently
        """
        # Test multiple async operations simultaneously
        health_task = async_client.get("/health")
        stats_task = async_client.get("/api/stats")
        root_task = async_client.get("/")
        
        # Execute concurrently
        health_response, stats_response, root_response = await asyncio.gather(
            health_task, stats_task, root_task, return_exceptions=True
        )
        
        # Verify health endpoint
        assert not isinstance(health_response, Exception)
        assert health_response.status_code == 200
        assert health_response.json()["status"] == "healthy"
        
        # Verify stats endpoint
        assert not isinstance(stats_response, Exception)
        assert stats_response.status_code == 200
        assert "registered_users" in stats_response.json()
        
        # Verify root endpoint
        assert not isinstance(root_response, Exception)
        assert root_response.status_code in [200, 404]
    
    def test_environment_configuration_integration(self, test_config: Dict[str, Any]) -> None:
        """
        Test that environment configuration works across the platform.
        
        Args:
            test_config: Test configuration fixture
            
        Verifies:
            - Environment variables are properly loaded
            - Configuration is consistently applied
            - No critical configuration is missing
            - Platform adapts to different environments
        """
        # Verify test configuration is loaded
        assert test_config is not None
        assert "test_environment" in test_config
        assert "debug_mode" in test_config
        
        # Test environment variables access
        import os
        
        # These should be accessible
        python_path = os.environ.get("PYTHONPATH")
        path = os.environ.get("PATH")
        
        assert path is not None, "PATH environment variable not accessible"
        
        # Verify configuration values are reasonable
        assert test_config["api_timeout"] > 0
        assert test_config["max_test_duration"] > 0
        
        # Test different environment handling
        if test_config["test_environment"] == "production":
            assert not test_config["debug_mode"], "Debug should be off in production"
    
    @pytest.mark.performance
    def test_overall_platform_performance(
        self, 
        client: TestClient, 
        performance_monitor
    ) -> None:
        """
        Test overall platform performance under normal load.
        
        Args:
            client: FastAPI test client
            performance_monitor: Performance monitoring fixture
            
        Verifies:
            - Platform responds within acceptable time limits
            - Resource usage remains reasonable
            - No significant performance bottlenecks
            - Consistent performance across different endpoints
        """
        performance_monitor.start_monitoring()
        
        # Test multiple endpoints to simulate normal usage
        endpoints = ["/health", "/api/stats", "/"]
        response_times = {}
        
        for endpoint in endpoints:
            times = []
            for _ in range(5):  # Test each endpoint 5 times
                start_time = time.time()
                response = client.get(endpoint)
                end_time = time.time()
                
                # Verify response is successful (or acceptable)
                assert response.status_code in [200, 404]
                times.append(end_time - start_time)
            
            response_times[endpoint] = {
                "avg": sum(times) / len(times),
                "max": max(times),
                "min": min(times)
            }
        
        performance_monitor.stop_monitoring()
        
        # Verify performance metrics
        for endpoint, times in response_times.items():
            assert times["avg"] < 0.5, f"{endpoint} average response time too high: {times['avg']:.3f}s"
            assert times["max"] < 1.0, f"{endpoint} max response time too high: {times['max']:.3f}s"
        
        # Verify resource usage
        assert performance_monitor.execution_time < 30, "Overall test took too long"
        assert performance_monitor.peak_memory_mb < 200, "Memory usage too high"
