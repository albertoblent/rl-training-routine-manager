# urls.py
from django.urls import path

from .views import (TrainingRoutineCreateView, TrainingRoutineDeleteView,
                    TrainingRoutineDetailView, TrainingRoutineExportView,
                    TrainingRoutineListView)

urlpatterns = [
    path("routines/", TrainingRoutineListView.as_view(), name="routine-list"),
    path(
        "routines/create/", TrainingRoutineCreateView.as_view(), name="routine-create"
    ),
    path(
        "routines/<uuid:pk>/",
        TrainingRoutineDetailView.as_view(),
        name="routine-detail",
    ),
    path(
        "routines/<uuid:pk>/export/",
        TrainingRoutineExportView.as_view(),
        name="routine-export",
    ),
    path(
        "routines/<uuid:pk>/delete/",
        TrainingRoutineDeleteView.as_view(),
        name="routine-delete",
    ),
]
