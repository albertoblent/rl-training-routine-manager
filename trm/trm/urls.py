from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path

from .views import FrontendView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("routinemanager.urls")),
    # Catch-all route for frontend routes with custom view that includes logging
    re_path(r'^(?!api/|admin/|static/).*$', FrontendView.as_view(), name='frontend'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
