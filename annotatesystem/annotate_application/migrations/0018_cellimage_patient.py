# Generated by Django 4.2.5 on 2023-11-19 17:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('annotate_application', '0017_celltype_alter_cellmarking_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='cellimage',
            name='patient',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cellimage', to='annotate_application.patient'),
        ),
    ]
