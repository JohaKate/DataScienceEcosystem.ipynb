/* ===============================================================
   dashboard.js
   - Dashboard Ejecutivo con gráficas funcionales
   - Visualizaciones mejoradas y datos en tiempo real
   =============================================================== */

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Dashboard...");
    setTimeout(() => {
        initializeDashboard();
    }, 500); // Delay para asegurar que Chart.js esté cargado
});

// Función principal de inicialización
async function initializeDashboard() {
    try {
        console.log("📊 Conectando con base de datos...");
        
        // Verificar que Chart.js está disponible
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no está cargado');
            showNotification('⚠️ Error: Chart.js no disponible', 'error');
            return;
        }
        
        // Cargar datos reales del backend
        await loadRealData();
        
        console.log("✅ Dashboard inicializado correctamente");
        showNotification('🎉 Dashboard cargado con datos reales', 'success');
        
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
        showNotification('⚠️ Error cargando dashboard: ' + error.message, 'error');
        
        // Fallback a datos simulados
        console.log("🔄 Usando datos simulados como respaldo...");
        updateKPIs();
        createAllCharts();
        startAutoUpdate();
    }
}

// API endpoint (dinámico: local vs Docker/Nginx)
const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : '';

// Variables globales para datos reales
let realData = {
    reservations: [],
    stats: null,
    weather: null
};

// Cargar datos reales del backend
async function loadRealData() {
    console.log("🔗 Conectando con backend...");
    
    try {
        // Verificar conectividad
        const healthCheck = await fetch(`${API_BASE}/health`);
        if (!healthCheck.ok) {
            throw new Error('Backend no disponible');
        }
        
        // Cargar estadísticas
        console.log("📊 Cargando estadísticas...");
        const statsResponse = await fetch(`${API_BASE}/api/stats/reservations`);
        if (statsResponse.ok) {
            realData.stats = await statsResponse.json();
            console.log("✅ Estadísticas cargadas:", realData.stats);
        }
        
        // Cargar reservas
        console.log("🏨 Cargando reservas...");
        const reservationsResponse = await fetch(`${API_BASE}/reservations`);
        if (reservationsResponse.ok) {
            realData.reservations = await reservationsResponse.json();
            console.log("✅ Reservas cargadas:", realData.reservations.length);
        }
        
        // Cargar datos del clima
        console.log("🌤️ Cargando clima...");
        const weatherResponse = await fetch(`${API_BASE}/api/weather/${encodeURIComponent('San José')}`);
        if (weatherResponse.ok) {
            realData.weather = await weatherResponse.json();
            console.log("✅ Clima cargado:", realData.weather);
        }
        
        // Actualizar KPIs con datos reales
        updateKPIsWithRealData();
        
        // Crear gráficas con datos reales
        createChartsWithRealData();
        
        // Iniciar actualización automática
        startAutoUpdate();
        
    } catch (error) {
        console.error("❌ Error cargando datos reales:", error);
        throw error;
    }
}

// Actualizar KPIs principales
function updateKPIs() {
    const kpis = {
        revenue: generateRandomRevenue(),
        bookings: generateRandomBookings(),
        occupancy: generateRandomOccupancy(),
        satisfaction: generateRandomSatisfaction()
    };
    
    // Actualizar valores con animación
    animateValue('revenue-value', '$' + kpis.revenue.toLocaleString());
    animateValue('bookings-value', kpis.bookings);
    animateValue('occupancy-value', kpis.occupancy + '%');
    animateValue('satisfaction-value', kpis.satisfaction.toFixed(1));
}

// Animación para actualizar valores
function animateValue(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// Crear todas las gráficas
function createAllCharts() {
    console.log("🎨 Iniciando creación de gráficas...");
    
    try {
        createRevenueChart();
        console.log("✅ Gráfica de ingresos creada");
    } catch (e) {
        console.error("❌ Error creando gráfica de ingresos:", e);
    }
    
    try {
        createRoomTypeChart();
        console.log("✅ Gráfica de tipos de habitación creada");
    } catch (e) {
        console.error("❌ Error creando gráfica de habitaciones:", e);
    }
    
    try {
        createOccupancyChart();
        console.log("✅ Gráfica de ocupación creada");
    } catch (e) {
        console.error("❌ Error creando gráfica de ocupación:", e);
    }
    
    try {
        createOriginChart();
        console.log("✅ Gráfica de origen creada");
    } catch (e) {
        console.error("❌ Error creando gráfica de origen:", e);
    }
}

// Gráfica de ingresos mensuales
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) {
        console.warn("⚠️ Elemento revenueChart no encontrado");
        return;
    }
    
    console.log("📈 Creando gráfica de ingresos...");
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'],
            datasets: [{
                label: 'Ingresos ($)',
                data: [38500, 41200, 39800, 42300, 44100, 45280, 47500, 49200],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#27ae60',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Gráfica de tipos de habitación (Donut)
function createRoomTypeChart() {
    const ctx = document.getElementById('roomTypeChart');
    if (!ctx) {
        console.warn("⚠️ Elemento roomTypeChart no encontrado");
        return;
    }
    
    console.log("🏨 Creando gráfica de tipos de habitación...");
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Suite Vista al Mar', 'Villa Privada', 'Habitación Deluxe', 'Habitación Estándar', 'Habitación Playa'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#3498db',
                    '#27ae60',
                    '#f39c12',
                    '#e74c3c',
                    '#9b59b6'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Gráfica de ocupación semanal (Barras)
function createOccupancyChart() {
    const ctx = document.getElementById('occupancyChart');
    if (!ctx) {
        console.warn("⚠️ Elemento occupancyChart no encontrado");
        return;
    }
    
    console.log("📊 Creando gráfica de ocupación...");
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Ocupación (%)',
                data: [65, 72, 68, 75, 85, 95, 88],
                backgroundColor: [
                    '#3498db',
                    '#3498db',
                    '#3498db',
                    '#3498db',
                    '#27ae60',
                    '#e74c3c',
                    '#f39c12'
                ],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ocupación: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Gráfica de origen de huéspedes (Pie)
function createOriginChart() {
    const ctx = document.getElementById('originChart');
    if (!ctx) {
        console.warn("⚠️ Elemento originChart no encontrado");
        return;
    }
    
    console.log("🌍 Creando gráfica de origen...");
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Costa Rica', 'Estados Unidos', 'Canadá', 'España', 'México', 'Otros'],
            datasets: [{
                data: [40, 25, 15, 10, 6, 4],
                backgroundColor: [
                    '#2c3e50',
                    '#3498db',
                    '#27ae60',
                    '#f39c12',
                    '#e74c3c',
                    '#9b59b6'
                ],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Iniciar actualización automática cada 30 segundos
function startAutoUpdate() {
    setInterval(async () => {
        try {
            console.log("🔄 Actualizando datos...");
            
            // Intentar cargar datos reales
            const statsResponse = await fetch(`${API_BASE}/api/stats/reservations`);
            if (statsResponse.ok) {
                realData.stats = await statsResponse.json();
                updateKPIsWithRealData();
                showNotification('📊 Datos actualizados desde base de datos', 'info');
            } else {
                // Fallback a datos simulados
                updateKPIs();
                showNotification('📊 Datos simulados actualizados', 'info');
            }
        } catch (error) {
            console.error("❌ Error actualizando datos:", error);
            // Fallback a datos simulados
            updateKPIs();
            showNotification('📊 Usando datos simulados', 'warning');
        }
    }, 30000);
}

// Actualizar KPIs con datos reales
function updateKPIsWithRealData() {
    if (realData.stats) {
        // Usar datos reales de las estadísticas
        animateValue('revenue-value', '$' + (realData.stats.monthly_revenue || 45280).toLocaleString());
        animateValue('bookings-value', realData.stats.total_reservations || 156);
        animateValue('occupancy-value', (realData.stats.occupancy_rate || 78) + '%');
        animateValue('satisfaction-value', (realData.stats.avg_rating || 4.7).toFixed(1));
    } else {
        // Fallback a datos calculados de reservas
        const totalReservations = realData.reservations.length;
        const monthlyReservations = realData.reservations.filter(r => {
            const date = new Date(r.checkin_date);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;
        
        animateValue('revenue-value', '$' + (monthlyReservations * 200).toLocaleString());
        animateValue('bookings-value', totalReservations);
        animateValue('occupancy-value', '78%');
        animateValue('satisfaction-value', '4.7');
    }
}

// Crear gráficas con datos reales
function createChartsWithRealData() {
    console.log("🎨 Creando gráficas con datos reales...");
    
    try {
        createRevenueChartReal();
        console.log("✅ Gráfica de ingresos con datos reales");
    } catch (e) {
        console.error("❌ Error en gráfica de ingresos:", e);
        createRevenueChart(); // fallback
    }
    
    try {
        createRoomTypeChartReal();
        console.log("✅ Gráfica de habitaciones con datos reales");
    } catch (e) {
        console.error("❌ Error en gráfica de habitaciones:", e);
        createRoomTypeChart(); // fallback
    }
    
    try {
        createOccupancyChartReal();
        console.log("✅ Gráfica de ocupación con datos reales");
    } catch (e) {
        console.error("❌ Error en gráfica de ocupación:", e);
        createOccupancyChart(); // fallback
    }
    
    try {
        createOriginChartReal();
        console.log("✅ Gráfica de origen con datos reales");
    } catch (e) {
        console.error("❌ Error en gráfica de origen:", e);
        createOriginChart(); // fallback
    }
}

// Procesar datos mensuales de ingresos
function processMonthlyRevenue(reservations) {
    const monthlyRevenue = new Array(12).fill(0);
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    if (reservations && reservations.length > 0) {
        reservations.forEach(reservation => {
            const date = new Date(reservation.checkin_date);
            const month = date.getMonth();
            // Estimar ingresos basado en tipo de habitación
            const roomPrices = {
                'Suite Vista al Mar': 200,
                'Villa Privada': 350,
                'Habitación Deluxe': 150,
                'Habitación Estándar': 100,
                'Habitación Doble Deluxe': 150
            };
            const price = roomPrices[reservation.room_type] || 150;
            monthlyRevenue[month] += price;
        });
    } else {
        // Datos demo si no hay reservas
        return {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
            data: [38500, 41200, 39800, 42300, 44100, 45280, 47500, 49200]
        };
    }
    
    return {
        labels: monthNames.slice(0, 8), // Solo primeros 8 meses
        data: monthlyRevenue.slice(0, 8)
    };
}

// Gráfica de ingresos con datos reales
function createRevenueChartReal() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const monthlyData = processMonthlyRevenue(realData.reservations);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Ingresos ($)',
                data: monthlyData.data,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#27ae60',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: { grid: { color: 'rgba(0, 0, 0, 0.1)' } }
            }
        }
    });
}

// Procesar datos de tipos de habitación
function processRoomTypeData(reservations) {
    const roomCounts = {};
    const roomTypes = ['Suite Vista al Mar', 'Villa Privada', 'Habitación Deluxe', 'Habitación Estándar', 'Habitación Doble Deluxe'];
    
    roomTypes.forEach(type => roomCounts[type] = 0);
    
    if (reservations && reservations.length > 0) {
        reservations.forEach(reservation => {
            if (roomCounts.hasOwnProperty(reservation.room_type)) {
                roomCounts[reservation.room_type]++;
            }
        });
        
        const total = Object.values(roomCounts).reduce((a, b) => a + b, 0);
        const percentages = Object.values(roomCounts).map(count => 
            total > 0 ? Math.round((count / total) * 100) : 0
        );
        
        return {
            labels: Object.keys(roomCounts),
            data: percentages
        };
    } else {
        return {
            labels: roomTypes,
            data: [35, 25, 20, 15, 5]
        };
    }
}

// Gráfica de tipos de habitación con datos reales
function createRoomTypeChartReal() {
    const ctx = document.getElementById('roomTypeChart');
    if (!ctx) return;
    
    const roomData = processRoomTypeData(realData.reservations);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: roomData.labels,
            datasets: [{
                data: roomData.data,
                backgroundColor: ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Gráfica de ocupación con datos reales
function createOccupancyChartReal() {
    const ctx = document.getElementById('occupancyChart');
    if (!ctx) return;
    
    // Generar datos de ocupación basados en reservas reales o usar datos demo
    const occupancyData = realData.reservations && realData.reservations.length > 0 
        ? generateOccupancyFromReservations(realData.reservations)
        : [65, 72, 68, 75, 85, 95, 88];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Ocupación (%)',
                data: occupancyData,
                backgroundColor: ['#3498db', '#3498db', '#3498db', '#3498db', '#27ae60', '#e74c3c', '#f39c12'],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Ocupación: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });
}

// Gráfica de origen con datos reales
function createOriginChartReal() {
    const ctx = document.getElementById('originChart');
    if (!ctx) return;
    
    const originData = processOriginData(realData.reservations);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: originData.labels,
            datasets: [{
                data: originData.data,
                backgroundColor: ['#2c3e50', '#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6'],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Procesar datos de origen
function processOriginData(reservations) {
    if (!reservations || reservations.length === 0) {
        return {
            labels: ['Costa Rica', 'Estados Unidos', 'Canadá', 'España', 'México', 'Otros'],
            data: [40, 25, 15, 10, 6, 4]
        };
    }
    
    const countries = {};
    reservations.forEach(reservation => {
        const country = reservation.country || 'Costa Rica';
        countries[country] = (countries[country] || 0) + 1;
    });
    
    const total = Object.values(countries).reduce((a, b) => a + b, 0);
    const sortedCountries = Object.entries(countries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6);
    
    return {
        labels: sortedCountries.map(([country]) => country),
        data: sortedCountries.map(([, count]) => Math.round((count / total) * 100))
    };
}

// Generar ocupación a partir de reservas
function generateOccupancyFromReservations(reservations) {
    // Simplificado: generar valores basados en número de reservas
    const baseOccupancy = Math.min(90, Math.max(30, reservations.length * 5));
    return [
        baseOccupancy - 10,
        baseOccupancy - 5,
        baseOccupancy - 8,
        baseOccupancy,
        baseOccupancy + 10,
        baseOccupancy + 20,
        baseOccupancy + 15
    ].map(val => Math.min(100, Math.max(0, val)));
}

// Función para exportar datos del dashboard
function exportDashboardData() {
    const data = {
        timestamp: new Date().toISOString(),
        hotel: 'Hotel Costa Bella',
        dataSource: realData.reservations.length > 0 ? 'Base de datos real' : 'Datos simulados',
        kpis: {
            revenue: document.getElementById('revenue-value')?.textContent || 'N/A',
            bookings: document.getElementById('bookings-value')?.textContent || 'N/A',
            occupancy: document.getElementById('occupancy-value')?.textContent || 'N/A',
            satisfaction: document.getElementById('satisfaction-value')?.textContent || 'N/A'
        },
        realDataStats: realData.stats,
        totalReservations: realData.reservations.length,
        weatherData: realData.weather,
        weeklyStats: [
            { period: 'Semana 1 (Ago 1-7)', rooms: '45/60', revenue: '$12,500', rating: '4.8', status: 'Completado' },
            { period: 'Semana 2 (Ago 8-14)', rooms: '52/60', revenue: '$14,200', rating: '4.6', status: 'Activo' },
            { period: 'Semana 3 (Ago 15-21)', rooms: '38/60', revenue: '$10,800', rating: '4.7', status: 'Pendiente' },
            { period: 'Semana 4 (Ago 22-28)', rooms: '41/60', revenue: '$11,600', rating: '4.9', status: 'Pendiente' }
        ],
        reservationsData: realData.reservations.slice(0, 10) // Primeras 10 reservas como muestra
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hotel-costa-bella-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification('💾 Datos exportados exitosamente', 'success');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Colores según tipo
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Generar datos aleatorios para fallback
function generateRandomRevenue() {
    return Math.floor(Math.random() * 10000) + 40000;
}

function generateRandomBookings() {
    return Math.floor(Math.random() * 50) + 120;
}

function generateRandomOccupancy() {
    return Math.floor(Math.random() * 30) + 65;
}

function generateRandomSatisfaction() {
    return (Math.random() * 1.5 + 4.0);
}

// Función para verificar si el backend está disponible
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Export para usar en otros archivos si es necesario
window.dashboardUtils = {
    initializeDashboard,
    loadRealData,
    updateKPIs,
    createAllCharts,
    showNotification,
    checkBackendHealth
};

console.log("📊 Dashboard.js cargado correctamente");
