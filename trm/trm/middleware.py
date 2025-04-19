import logging
import time

logger = logging.getLogger('trm')

class RequestLogMiddleware:
    """Log all requests to help debug routing issues"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code executed before the view is called
        start_time = time.time()

        logger.debug(f"[REQUEST START] {request.method} {request.path}")
        logger.debug(f"Headers: {dict(request.headers)}")
        logger.debug(f"GET params: {request.GET}")

        # Call the view
        response = self.get_response(request)

        # Code executed after the view is called
        duration = time.time() - start_time
        logger.debug(f"[REQUEST END] {request.path} - Status: {response.status_code} - Duration: {duration:.2f}s")

        return response