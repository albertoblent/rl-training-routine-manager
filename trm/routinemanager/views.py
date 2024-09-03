# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .models import TrainingRoutine
from .serializers import TrainingRoutineSerializer


class TrainingRoutineCreateView(generics.CreateAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrainingRoutineListView(generics.ListAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer


class TrainingRoutineExportView(generics.RetrieveAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
