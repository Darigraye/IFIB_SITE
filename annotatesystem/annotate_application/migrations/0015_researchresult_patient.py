# Generated by Django 4.2.5 on 2023-11-19 11:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('annotate_application', '0014_researchresult_research_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='researchresult',
            name='patient',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='researchresult', to='annotate_application.patient'),
        ),
    ]
