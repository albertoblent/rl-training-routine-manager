"""
WSGI config for trm project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import logging
import sys
from pathlib import Path

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trm.settings")

# Set up logging
logger = logging.getLogger('trm')

# Application setup
application = get_wsgi_application()

# Log application startup info
logger.info("="*80)
logger.info("WSGI Application Started")
logger.info(f"Python version: {sys.version}")
logger.info(f"Django settings module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

# Check frontend build files
base_dir = Path(__file__).resolve().parent.parent
build_dir = os.path.join(base_dir, 'frontend', 'build')
index_file = os.path.join(build_dir, 'index.html')

logger.info(f"Base directory: {base_dir}")
logger.info(f"Build directory: {build_dir}")
logger.info(f"Index file path: {index_file}")

if os.path.exists(build_dir):
    logger.info(f"Build directory exists")
    # List files in build directory
    files = os.listdir(build_dir)
    logger.info(f"Files in build directory: {', '.join(files)}")
else:
    logger.warning(f"Build directory does not exist: {build_dir}")

if os.path.exists(index_file):
    logger.info(f"Index file exists ({os.path.getsize(index_file)} bytes)")
else:
    logger.warning(f"Index file does not exist: {index_file}")

# Log environment variables relevant to the app
env_vars = ['DEBUG', 'DJANGO_DEBUG', 'RENDER_EXTERNAL_HOSTNAME', 'PORT']
logger.info("Environment variables:")
for var in env_vars:
    logger.info(f"  - {var}: {os.environ.get(var, 'Not set')}")

logger.info("="*80)
