# serializers.py
from rest_framework import serializers
from .models import TrainingRoutine, TrainingEntry


class TrainingEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingEntry
        fields = [
            "id",
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

    def update(self, instance, validated_data):
        entries_data = validated_data.pop("entries", [])
        instance.name = validated_data.get("name", instance.name)
        instance.duration = validated_data.get("duration", instance.duration)
        instance.save()

        # Delete existing entries not in the update data
        existing_entries = {entry.id: entry for entry in instance.entries.all()}
        updated_entries = []

        for entry_data in entries_data:
            entry_id = entry_data.get("id")
            if entry_id and entry_id in existing_entries:
                # Update existing entry
                entry = existing_entries.pop(entry_id)
                for attr, value in entry_data.items():
                    setattr(entry, attr, value)
                entry.save()
                updated_entries.append(entry)
            else:
                # Create new entry
                entry = TrainingEntry.objects.create(routine=instance, **entry_data)
                updated_entries.append(entry)

        # Delete entries not in the update data
        for entry in existing_entries.values():
            entry.delete()

        instance.entries.set(updated_entries)
        return instance
