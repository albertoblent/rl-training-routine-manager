# serializers.py
from rest_framework import serializers

from .models import TrainingEntry, TrainingRoutine


class TrainingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingEntry
        fields = [
            "name",
            "duration",
            "entry_type",
            "training_pack_code",
            "workshop_map_id",
            "workshop_map_file",
            "notes",
            "order",
        ]


class TrainingRoutineSerializer(serializers.ModelSerializer):
    entries = TrainingEntrySerializer(many=True)

    class Meta:
        model = TrainingRoutine
        fields = ["id", "name", "duration", "entries"]

    def create(self, validated_data):
        entries_data = validated_data.pop("entries")
        routine = TrainingRoutine.objects.create(**validated_data)
        for entry_data in entries_data:
            TrainingEntry.objects.create(routine=routine, **entry_data)
        return routine
