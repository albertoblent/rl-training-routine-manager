import logging
import os
from django.conf import settings
from django.http import HttpResponse
from django.views.generic import View

logger = logging.getLogger('trm')

class FrontendView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `npm run build`).
    """

    def get(self, request, *args, **kwargs):
        try:
            # Log the incoming request
            logger.debug(f"FrontendView handling request: {request.path}")
            logger.debug(f"Request method: {request.method}")
            logger.debug(f"Request GET params: {request.GET}")
            logger.debug(f"Request META: {request.META.get('HTTP_USER_AGENT', 'Unknown')}")

            # Check if we have an index.html file
            index_path = os.path.join(settings.BASE_DIR, 'frontend', 'build', 'index.html')
            logger.debug(f"Looking for index.html at: {index_path}")

            if os.path.exists(index_path):
                with open(index_path) as f:
                    logger.debug("Index.html found, serving content")
                    return HttpResponse(f.read())
            else:
                logger.error(f"Index.html not found at {index_path}")
                return HttpResponse(
                    """
                    This URL is served by the frontend catch-all view in Django,
                    but the compiled index.html was not found.
                    """,
                    status=501,
                )
        except Exception as e:
            logger.exception(f"Error in FrontendView: {str(e)}")
            return HttpResponse(f"An error occurred: {str(e)}", status=500)