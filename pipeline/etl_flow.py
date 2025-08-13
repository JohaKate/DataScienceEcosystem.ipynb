"""
Pipeline ETL para Hotel Costa Bella
Desarrollado con Prefect 2.x

Este pipeline:
1. Extrae datos RAW de la base de datos
2. Limpia y valida los datos
3. Carga datos limpios en tabla separada
4. Genera logs de calidad de datos
5. Crea backups automáticos
"""

import os
import csv
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any

import pandas as pd
from prefect import flow, task, get_run_logger
from prefect.task_runners import SequentialTaskRunner
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Configuración de base de datos
DB_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://root:Leen1970*@localhost:3306/hotel_reservas")
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine)

@task
def extract_raw_reservations() -> pd.DataFrame:
    """Extrae reservas RAW de la base de datos"""
    logger = get_run_logger()
    logger.info("Iniciando extracción de datos RAW...")
    
    query = """
    SELECT 
        id, first_name, last_name, email, phone, country, city,
        checkin_date, checkout_date, guests, room_type, comments, created_at
    FROM reservations 
    WHERE created_at >= %s
    """
    
    # Extraer datos de los últimos 30 días
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    with engine.connect() as conn:
        df = pd.read_sql(query, conn, params=[thirty_days_ago])
    
    logger.info(f"Extraídos {len(df)} registros RAW")
    return df

@task
def clean_and_validate_data(df: pd.DataFrame) -> tuple[pd.DataFrame, Dict[str, Any]]:
    """Limpia y valida los datos extraídos"""
    logger = get_run_logger()
    logger.info("Iniciando limpieza de datos...")
    
    initial_count = len(df)
    quality_metrics = {
        "records_initial": initial_count,
        "records_with_null_names": 0,
        "records_with_invalid_emails": 0,
        "records_with_invalid_dates": 0,
        "records_removed": 0,
        "records_cleaned": 0,
        "data_quality_score": 0.0
    }
    
    # Limpiar datos
    df_clean = df.copy()
    
    # 1. Remover registros con nombres nulos o vacíos
    null_names = df_clean[
        (df_clean['first_name'].isna()) | 
        (df_clean['last_name'].isna()) | 
        (df_clean['first_name'].str.strip() == '') | 
        (df_clean['last_name'].str.strip() == '')
    ]
    quality_metrics["records_with_null_names"] = len(null_names)
    df_clean = df_clean.dropna(subset=['first_name', 'last_name'])
    
    # 2. Validar emails
    invalid_emails = df_clean[~df_clean['email'].str.contains('@', na=False)]
    quality_metrics["records_with_invalid_emails"] = len(invalid_emails)
    df_clean = df_clean[df_clean['email'].str.contains('@', na=False)]
    
    # 3. Validar fechas
    df_clean['checkin_date'] = pd.to_datetime(df_clean['checkin_date'], errors='coerce')
    df_clean['checkout_date'] = pd.to_datetime(df_clean['checkout_date'], errors='coerce')
    
    invalid_dates = df_clean[
        (df_clean['checkin_date'].isna()) | 
        (df_clean['checkout_date'].isna()) |
        (df_clean['checkout_date'] <= df_clean['checkin_date'])
    ]
    quality_metrics["records_with_invalid_dates"] = len(invalid_dates)
    df_clean = df_clean.dropna(subset=['checkin_date', 'checkout_date'])
    df_clean = df_clean[df_clean['checkout_date'] > df_clean['checkin_date']]
    
    # 4. Normalizar datos de texto
    df_clean['first_name'] = df_clean['first_name'].str.strip().str.title()
    df_clean['last_name'] = df_clean['last_name'].str.strip().str.title()
    df_clean['email'] = df_clean['email'].str.strip().str.lower()
    df_clean['country'] = df_clean['country'].str.strip().str.title()
    df_clean['city'] = df_clean['city'].str.strip().str.title()
    
    # 5. Validar número de huéspedes
    df_clean = df_clean[(df_clean['guests'] >= 1) & (df_clean['guests'] <= 10)]
    
    # Calcular métricas finales
    final_count = len(df_clean)
    quality_metrics["records_removed"] = initial_count - final_count
    quality_metrics["records_cleaned"] = final_count
    quality_metrics["data_quality_score"] = round((final_count / initial_count) * 100, 2) if initial_count > 0 else 0
    
    # Agregar score de calidad a cada registro
    df_clean['data_quality_score'] = quality_metrics["data_quality_score"] / 100
    df_clean['processed_at'] = datetime.now()
    
    logger.info(f"Limpieza completada. {final_count}/{initial_count} registros válidos ({quality_metrics['data_quality_score']}%)")
    
    return df_clean, quality_metrics

@task
def load_cleaned_data(df_clean: pd.DataFrame) -> int:
    """Carga datos limpios en la tabla cleaned_reservations"""
    logger = get_run_logger()
    logger.info("Cargando datos limpios...")
    
    # Preparar datos para inserción
    df_clean['original_id'] = df_clean['id']
    df_clean = df_clean.drop('id', axis=1)
    
    # Insertar en tabla cleaned_reservations
    with engine.connect() as conn:
        df_clean.to_sql('cleaned_reservations', conn, if_exists='append', index=False)
    
    loaded_count = len(df_clean)
    logger.info(f"Cargados {loaded_count} registros limpios")
    return loaded_count

@task
def generate_quality_log(quality_metrics: Dict[str, Any], loaded_count: int) -> str:
    """Genera log de calidad de datos"""
    logger = get_run_logger()
    
    log_data = {
        "timestamp": datetime.now().isoformat(),
        "pipeline_run": "etl_reservations",
        "metrics": quality_metrics,
        "loaded_records": loaded_count,
        "success": True
    }
    
    # Guardar log en archivo JSON
    log_filename = f"pipeline/logs/etl_run_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    os.makedirs(os.path.dirname(log_filename), exist_ok=True)
    
    with open(log_filename, 'w', encoding='utf-8') as f:
        json.dump(log_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"Log de calidad generado: {log_filename}")
    return log_filename

@task
def create_backup(df_clean: pd.DataFrame) -> str:
    """Crea backup en CSV"""
    logger = get_run_logger()
    
    backup_filename = f"pipeline/backups/reservations_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    os.makedirs(os.path.dirname(backup_filename), exist_ok=True)
    
    df_clean.to_csv(backup_filename, index=False, encoding='utf-8')
    
    logger.info(f"Backup creado: {backup_filename}")
    return backup_filename

@flow(name="Hotel Costa Bella ETL", task_runner=SequentialTaskRunner())
def etl_reservations_flow():
    """Flow principal del pipeline ETL"""
    logger = get_run_logger()
    logger.info("🚀 Iniciando pipeline ETL de Hotel Costa Bella")
    
    try:
        # 1. Extraer datos RAW
        raw_data = extract_raw_reservations()
        
        # 2. Limpiar y validar
        clean_data, quality_metrics = clean_and_validate_data(raw_data)
        
        # 3. Cargar datos limpios
        loaded_count = load_cleaned_data(clean_data)
        
        # 4. Generar log de calidad
        log_file = generate_quality_log(quality_metrics, loaded_count)
        
        # 5. Crear backup
        backup_file = create_backup(clean_data)
        
        logger.info("✅ Pipeline ETL completado exitosamente")
        logger.info(f"📊 Registros procesados: {quality_metrics['records_cleaned']}")
        logger.info(f"📈 Calidad de datos: {quality_metrics['data_quality_score']}%")
        logger.info(f"📁 Log: {log_file}")
        logger.info(f"💾 Backup: {backup_file}")
        
        return {
            "success": True,
            "processed_records": quality_metrics['records_cleaned'],
            "quality_score": quality_metrics['data_quality_score'],
            "log_file": log_file,
            "backup_file": backup_file
        }
        
    except Exception as e:
        logger.error(f"❌ Error en pipeline ETL: {str(e)}")
        raise e

if __name__ == "__main__":
    # Ejecutar el flow
    result = etl_reservations_flow()
    print("Pipeline ejecutado:", result)
