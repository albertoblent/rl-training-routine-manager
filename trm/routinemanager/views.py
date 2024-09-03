# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import TrainingRoutine
from .serializers import TrainingRoutineSerializer


class TrainingRoutineListView(generics.ListAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer


class TrainingRoutineCreateView(generics.CreateAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer


class TrainingRoutineDetailView(generics.RetrieveAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer


class TrainingRoutineExportView(generics.RetrieveAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
