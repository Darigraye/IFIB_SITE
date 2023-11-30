# Generated by Django 4.2.5 on 2023-11-18 18:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('annotate_application', '0010_cell_alter_systemsettings_glass_type_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cellcharacteristic',
            options={'verbose_name': 'характеристика', 'verbose_name_plural': 'характиристики'},
        ),
        migrations.AlterModelTableComment(
            name='cellcharacteristic',
            table_comment='справочник характеристик клеток',
        ),
        migrations.AlterModelTable(
            name='cellcharacteristic',
            table='al_cell_characteristic',
        ),
        migrations.CreateModel(
            name='MorphologicalResearch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number_cells', models.IntegerField(db_comment='Количество клеток', verbose_name='Количество клеток')),
                ('leukocyte', models.BooleanField(db_comment='Лейкоцит', verbose_name='Лейкоцит')),
                ('research_type', models.CharField(choices=[('1', 'Тип 1'), ('2', 'Тип 2'), ('3', 'Тип 3')], db_comment='Тип клетки', verbose_name='Тип исследования')),
                ('value', models.CharField(db_comment='Значение', verbose_name='Значение')),
                ('description', models.TextField(blank=True, db_comment='Описание', verbose_name='Описание')),
                ('medication', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='morfresearch', to='annotate_application.medication')),
                ('research_obj', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='morfresearch', to='annotate_application.researchedobject')),
            ],
            options={
                'verbose_name': 'морфологическое исследование',
                'verbose_name_plural': 'морфологические исследования',
                'db_table': 'al_morfological',
                'db_table_comment': 'справочник морфологического исследования',
            },
        ),
    ]