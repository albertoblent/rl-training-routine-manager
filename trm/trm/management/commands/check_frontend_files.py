import os
import logging
from django.conf import settings
from django.core.management.base import BaseCommand


logger = logging.getLogger('trm')


class Command(BaseCommand):
    help = 'Check frontend file paths and structure'

    def handle(self, *args, **options):
        # Check base directory structure
        self.stdout.write("Checking frontend file paths...")

        # Check build directory
        build_path = os.path.join(settings.BASE_DIR, 'frontend', 'build')
        self.stdout.write(f"Build path: {build_path}")
        if os.path.exists(build_path):
            self.stdout.write(self.style.SUCCESS(f"✅ Build directory exists at {build_path}"))
            # List files in build directory
            self.stdout.write("Files in build directory:")
            for file in os.listdir(build_path):
                self.stdout.write(f"  - {file}")
        else:
            self.stdout.write(self.style.ERROR(f"❌ Build directory NOT found at {build_path}"))

        # Check index.html
        index_path = os.path.join(build_path, 'index.html')
        self.stdout.write(f"Index path: {index_path}")
        if os.path.exists(index_path):
            self.stdout.write(self.style.SUCCESS(f"✅ index.html exists at {index_path}"))
            # Get file size
            size = os.path.getsize(index_path)
            self.stdout.write(f"  - File size: {size} bytes")
        else:
            self.stdout.write(self.style.ERROR(f"❌ index.html NOT found at {index_path}"))

        # Check static directory
        static_path = os.path.join(build_path, 'static')
        self.stdout.write(f"Static path: {static_path}")
        if os.path.exists(static_path):
            self.stdout.write(self.style.SUCCESS(f"✅ Static directory exists at {static_path}"))
            # List subdirectories of static
            self.stdout.write("Subdirectories in static:")
            for subdir in os.listdir(static_path):
                full_path = os.path.join(static_path, subdir)
                if os.path.isdir(full_path):
                    self.stdout.write(f"  - {subdir}/")
        else:
            self.stdout.write(self.style.ERROR(f"❌ Static directory NOT found at {static_path}"))

        # Check STATICFILES_DIRS setting
        self.stdout.write("\nChecking STATICFILES_DIRS setting:")
        for static_dir in settings.STATICFILES_DIRS:
            self.stdout.write(f"  - {static_dir}")
            if os.path.exists(static_dir):
                self.stdout.write(self.style.SUCCESS(f"    ✅ Directory exists"))
            else:
                self.stdout.write(self.style.ERROR(f"    ❌ Directory NOT found"))