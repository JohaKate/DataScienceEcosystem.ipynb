"""
Weather Service para Hotel Costa Bella
- Obtiene datos del clima cada hora
- Guarda logs en backups/
- Integración con API externa OpenWeatherMap
"""

import asyncio
import json
import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import httpx
from pathlib import Path

class WeatherService:
    def __init__(self, api_key: str = "demo_key", base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url
        self.backup_dir = Path("../pipeline/backups")
        self.backup_dir.mkdir(exist_ok=True)
        
        # Configurar logging
        self.setup_logging()
        
    def setup_logging(self):
        """Configurar sistema de logs para weather"""
        log_file = self.backup_dir / f"weather_logs_{datetime.now().strftime('%Y%m%d')}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()  # También mostrar en consola
            ]
        )
        self.logger = logging.getLogger('WeatherService')
        
    async def get_weather_data(self, city: str = "San José, CR") -> Optional[Dict[str, Any]]:
        """Obtener datos del clima desde OpenWeatherMap"""
        try:
            # URL de la API de OpenWeatherMap (demo)
            # En producción, usar una clave real de https://openweathermap.org/api
            url = "http://api.openweathermap.org/data/2.5/weather"
            
            params = {
                "q": city,
                "appid": self.api_key,
                "units": "metric",
                "lang": "es"
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                if self.api_key == "demo_key":
                    # Simular datos para demo
                    self.logger.info("🌡️ Usando datos de clima simulados (demo)")
                    return {
                        "name": "San José",
                        "main": {
                            "temp": 24.5,
                            "humidity": 78,
                            "feels_like": 26.2
                        },
                        "weather": [
                            {
                                "description": "parcialmente nublado",
                                "main": "Clouds"
                            }
                        ],
                        "wind": {
                            "speed": 3.2
                        }
                    }
                else:
                    # Llamada real a la API
                    response = await client.get(url, params=params)
                    if response.status_code == 200:
                        return response.json()
                    else:
                        self.logger.error(f"❌ Error API OpenWeatherMap: {response.status_code}")
                        return None
                        
        except Exception as e:
            self.logger.error(f"❌ Error obteniendo datos del clima: {e}")
            return None
    
    async def save_to_backend(self, weather_data: Dict[str, Any]) -> bool:
        """Guardar datos del clima en el backend"""
        try:
            url = f"{self.base_url}/api/weather/{weather_data['name']}"
            
            payload = {
                "city": weather_data["name"],
                "temperature": weather_data["main"]["temp"],
                "description": weather_data["weather"][0]["description"],
                "humidity": weather_data["main"]["humidity"]
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)  # Endpoint ya maneja el guardado
                
                if response.status_code == 200:
                    self.logger.info(f"✅ Datos del clima guardados: {payload}")
                    return True
                else:
                    self.logger.error(f"❌ Error guardando en backend: {response.status_code}")
                    return False
                    
        except Exception as e:
            self.logger.error(f"❌ Error conectando con backend: {e}")
            return False
    
    def save_backup(self, weather_data: Dict[str, Any]):
        """Guardar backup local de los datos del clima"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = self.backup_dir / f"weather_backup_{timestamp}.json"
            
            backup_data = {
                "timestamp": datetime.now().isoformat(),
                "weather_data": weather_data,
                "source": "OpenWeatherMap API",
                "city": weather_data.get("name", "Unknown")
            }
            
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
            
            self.logger.info(f"💾 Backup guardado: {backup_file}")
            
            # Limpiar backups antiguos (mantener solo últimos 48)
            self.cleanup_old_backups()
            
        except Exception as e:
            self.logger.error(f"❌ Error guardando backup: {e}")
    
    def cleanup_old_backups(self):
        """Limpiar backups antiguos (mantener solo últimos 48 = 2 días)"""
        try:
            weather_files = list(self.backup_dir.glob("weather_backup_*.json"))
            weather_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
            
            # Mantener solo los últimos 48 archivos
            for old_file in weather_files[48:]:
                old_file.unlink()
                self.logger.info(f"🗑️ Backup antiguo eliminado: {old_file.name}")
                
        except Exception as e:
            self.logger.error(f"❌ Error limpiando backups: {e}")
    
    async def update_weather(self):
        """Actualización completa del clima"""
        self.logger.info("🔄 Iniciando actualización del clima...")
        
        # Obtener datos del clima
        weather_data = await self.get_weather_data()
        
        if weather_data:
            # Guardar backup local
            self.save_backup(weather_data)
            
            # Intentar guardar en backend
            success = await self.save_to_backend(weather_data)
            
            if success:
                self.logger.info("✅ Actualización del clima completada exitosamente")
            else:
                self.logger.warning("⚠️ Clima obtenido pero no se pudo guardar en backend")
        else:
            self.logger.error("❌ No se pudieron obtener datos del clima")
    
    async def start_hourly_updates(self):
        """Iniciar actualizaciones automáticas cada hora"""
        self.logger.info("🚀 Iniciando servicio de clima automático (cada hora)")
        
        while True:
            try:
                # Actualizar clima
                await self.update_weather()
                
                # Esperar 1 hora (3600 segundos)
                self.logger.info("⏰ Próxima actualización en 1 hora...")
                await asyncio.sleep(3600)
                
            except Exception as e:
                self.logger.error(f"❌ Error en ciclo automático: {e}")
                # Esperar 5 minutos antes de reintentar
                await asyncio.sleep(300)

# Función principal para ejecutar el servicio
async def main():
    # Usar clave de API real si está disponible
    api_key = os.getenv("OPENWEATHER_API_KEY", "demo_key")
    
    weather_service = WeatherService(api_key=api_key)
    
    # Hacer una actualización inmediata
    await weather_service.update_weather()
    
    # Iniciar actualizaciones automáticas
    await weather_service.start_hourly_updates()

if __name__ == "__main__":
    print("🌤️ Servicio de Clima - Hotel Costa Bella")
    print("=" * 50)
    asyncio.run(main())
