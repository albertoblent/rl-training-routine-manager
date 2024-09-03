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


class TrainingRoutineDeleteView(generics.DestroyAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class TrainingRoutineUpdateView(generics.UpdateAPIView):
    queryset = TrainingRoutine.objects.all()
    serializer_class = TrainingRoutineSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
