"""
Deployment del pipeline ETL con Prefect
Programa el pipeline para ejecutarse automáticamente
"""

from prefect.deployments import Deployment
from prefect.server.schemas.schedules import CronSchedule
from etl_flow import etl_reservations_flow

# Crear deployment con schedule
deployment = Deployment.build_from_flow(
    flow=etl_reservations_flow,
    name="hotel-costa-bella-etl",
    version="1.0.0",
    schedule=CronSchedule(cron="0 2 * * *"),  # Ejecutar diario a las 2:00 AM
    work_queue_name="default",
    tags=["hotel", "etl", "reservations"],
    description="Pipeline ETL diario para procesar reservas del Hotel Costa Bella",
    parameters={}
)

if __name__ == "__main__":
    deployment.apply()
    print("✅ Deployment creado exitosamente")
    print("🔄 El pipeline se ejecutará diariamente a las 2:00 AM")
    print("🚀 Para iniciar el agente: prefect agent start -q default")
