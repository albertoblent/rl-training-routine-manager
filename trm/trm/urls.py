from django.contrib import admin
from django.urls import path
from routinemanager.views import (
    TrainingRoutineCreateView,
    TrainingRoutineExportView,
    TrainingRoutineListView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("routines/", TrainingRoutineListView.as_view(), name="routine-list"),
    path(
        "routines/create/", TrainingRoutineCreateView.as_view(), name="routine-create"
    ),
    path(
        "routines/<uuid:pk>/export/",
        TrainingRoutineExportView.as_view(),
        name="routine-export",
    ),
]
