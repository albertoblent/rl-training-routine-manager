# urls.py
from django.urls import path
from .views import (
    TrainingRoutineListView,
    TrainingRoutineCreateView,
    TrainingRoutineDetailView,
    TrainingRoutineExportView,
)

urlpatterns = [
    path("routines/", TrainingRoutineListView.as_view(), name="routine-list"),
    path("routines/create/", TrainingRoutineCreateView.as_view(), name="routine-create"),
    path("routines/<uuid:pk>/", TrainingRoutineDetailView.as_view(), name="routine-detail"),
    path("routines/<uuid:pk>/export/", TrainingRoutineExportView.as_view(), name="routine-export"),
]
