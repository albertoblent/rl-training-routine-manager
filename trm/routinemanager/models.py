# models.py
import uuid

from django.db import models


class TrainingRoutine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    duration = models.IntegerField()  # in milliseconds
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TrainingEntry(models.Model):
    ENTRY_TYPES = (
        (1, "Freeplay"),
        (2, "Custom Training Pack"),
        (3, "Workshop Map"),
    )

    routine = models.ForeignKey(
        TrainingRoutine, related_name="entries", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    duration = models.IntegerField()  # in milliseconds
    entry_type = models.IntegerField(choices=ENTRY_TYPES)
    training_pack_code = models.CharField(max_length=19, blank=True, null=True)
    workshop_map_id = models.CharField(max_length=20, blank=True, null=True)
    workshop_map_file = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    order = models.IntegerField()

    class Meta:
        ordering = ["order"]
