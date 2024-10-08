# Generated by Django 5.1.1 on 2024-09-03 14:56

import uuid

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="TrainingRoutine",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("duration", models.IntegerField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="TrainingEntry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("duration", models.IntegerField()),
                (
                    "entry_type",
                    models.IntegerField(
                        choices=[
                            (1, "Freeplay"),
                            (2, "Custom Training Pack"),
                            (3, "Workshop Map"),
                        ]
                    ),
                ),
                (
                    "training_pack_code",
                    models.CharField(blank=True, max_length=19, null=True),
                ),
                (
                    "workshop_map_id",
                    models.CharField(blank=True, max_length=20, null=True),
                ),
                (
                    "workshop_map_file",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("notes", models.TextField(blank=True, null=True)),
                ("order", models.IntegerField()),
                (
                    "routine",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="entries",
                        to="routinemanager.trainingroutine",
                    ),
                ),
            ],
            options={
                "ordering": ["order"],
            },
        ),
    ]
