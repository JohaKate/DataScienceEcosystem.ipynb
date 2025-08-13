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
function initializeDashboard() {
    try {
        console.log("📊 Creando gráficas...");
        
        // Verificar que Chart.js está disponible
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js no está cargado');
            showNotification('⚠️ Error: Chart.js no disponible', 'error');
            return;
        }
        
        // Actualizar KPIs
        updateKPIs();
        
        // Crear todas las gráficas
        createAllCharts();
        
        // Iniciar actualización automática
        startAutoUpdate();
        
        console.log("✅ Dashboard inicializado correctamente");
        showNotification('🎉 Dashboard cargado correctamente', 'success');
        
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
        showNotification('⚠️ Error cargando dashboard: ' + error.message, 'error');
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
    setInterval(() => {
        updateKPIs();
        showNotification('📊 Datos actualizados', 'info');
    }, 30000);
}

// Funciones auxiliares para generar datos realistas
function generateRandomRevenue() {
    return Math.floor(Math.random() * 8000) + 42000;
}

function generateRandomBookings() {
    return Math.floor(Math.random() * 40) + 140;
}

function generateRandomOccupancy() {
    return Math.floor(Math.random() * 25) + 70;
}

function generateRandomSatisfaction() {
    return Math.random() * 0.6 + 4.4;
}

// Función para exportar datos del dashboard
function exportDashboardData() {
    const data = {
        timestamp: new Date().toISOString(),
        hotel: 'Hotel Costa Bella',
        kpis: {
            revenue: document.getElementById('revenue-value')?.textContent || 'N/A',
            bookings: document.getElementById('bookings-value')?.textContent || 'N/A',
            occupancy: document.getElementById('occupancy-value')?.textContent || 'N/A',
            satisfaction: document.getElementById('satisfaction-value')?.textContent || 'N/A'
        },
        weeklyStats: [
            { period: 'Semana 1 (Ago 1-7)', rooms: '45/60', revenue: '$12,500', rating: '4.8', status: 'Completado' },
            { period: 'Semana 2 (Ago 8-14)', rooms: '52/60', revenue: '$14,200', rating: '4.6', status: 'Activo' },
            { period: 'Semana 3 (Ago 15-21)', rooms: '38/60', revenue: '$10,800', rating: '4.7', status: 'Pendiente' },
            { period: 'Semana 4 (Ago 22-28)', rooms: '41/60', revenue: '$11,600', rating: '4.9', status: 'Pendiente' }
        ]
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

// Sistema de notificaciones mejorado
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
        </div>
    `;
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Agregar estilos para animaciones
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .kpi-value {
        transition: all 0.3s ease;
    }
    
    .chart-container:hover {
        transform: translateY(-5px);
        transition: transform 0.3s ease;
    }
`;

document.head.appendChild(styleSheet);

// Mensaje de bienvenida
setTimeout(() => {
    showNotification('🎉 Dashboard cargado correctamente', 'success');
}, 1000);
