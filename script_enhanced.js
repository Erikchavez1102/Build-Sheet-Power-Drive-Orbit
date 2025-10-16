// Variables globales
let formattedDate;

// Espera a que el documento HTML se cargue completamente antes de ejecutar el código
document.addEventListener('DOMContentLoaded', (event) => {

    // Obtiene el elemento de entrada de fecha por su ID
    const dateInput = document.getElementById('date');

    // Crea un nuevo objeto de fecha (Date) para obtener la fecha actual del sistema
    const today = new Date();

    // Formatea la fecha en el formato "YYYY-MM-DD" para que el campo de fecha HTML lo entienda
    const year = today.getFullYear();
    // month + 1 porque en JavaScript los meses van de 0 a 11
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    
    // Combina el año, mes y día en el formato necesario
    formattedDate = `${year}-${month}-${day}`;

    // Asigna la fecha formateada al valor del campo de entrada de fecha
    dateInput.value = formattedDate;

    // Auto-llenar fecha en Sección 3.2
    const measuredDate32 = document.getElementById('measured-date-32');
    if (measuredDate32) {
        measuredDate32.value = formattedDate;
    }

    // Auto-llenar fecha y hora actual para mediciones
    const measuredDateTime = document.getElementById('measured-datetime-32');
    if (measuredDateTime) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        measuredDateTime.value = localDateTime;
    }

    const gapInput = document.getElementById('gap');
    const typeBiasUnit = document.getElementById('bias-unit-type');

    function validateGap() {
        const gapValue = parseFloat(gapInput.value);
        const type = typeBiasUnit.value;
        let inRange = false;

        if (type === 'PDORB4') {
            inRange = gapValue >= 32.10 && gapValue <= 32.50;
        } else if (['PDORB6', 'PDORB8', 'PDORB12'].includes(type)) {
            inRange = gapValue >= 40.10 && gapValue <= 40.50;
        }

        if (gapInput.value === '') {
            gapInput.style.backgroundColor = '';
        } else if (inRange) {
            gapInput.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
        } else {
            gapInput.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        }
    }

    gapInput.addEventListener('input', validateGap);
    typeBiasUnit.addEventListener('change', validateGap);

    // Funcionalidades avanzadas para la Sección 3.1
    const componentRows = [
        'upper-kicker', 'lower-kicker', 'hinge-pin', 'pad', 'clamp-plate',
        'sleeve-uh', 'sleeve-dh', 'ball-uh', 'ball-dh'
    ];

    // Inicializar estados QC
    componentRows.forEach(component => {
        updateQCStatus(component, 'pending');
    });

    // Event listeners mejorados para checkboxes
    componentRows.forEach(component => {
        const newCheckbox = document.getElementById(`${component}-new`);
        const usedCheckbox = document.getElementById(`${component}-used`);

        if (newCheckbox && usedCheckbox) {
            newCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    usedCheckbox.checked = false;
                    updateComponentRow(component);
                }
                updateSummaryCounters();
            });

            usedCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    newCheckbox.checked = false;
                    updateComponentRow(component);
                }
                updateSummaryCounters();
            });
        }

        // Event listeners para campos de entrada
        const snField = document.getElementById(`${component}-sn`);
        const pnField = document.getElementById(`${component}-pn`);
        const dateField = document.getElementById(`${component}-date`);

        if (snField) {
            snField.addEventListener('input', () => validateSerialNumber(component));
        }
        if (pnField) {
            pnField.addEventListener('input', () => validatePartNumber(component));
        }
        if (dateField) {
            dateField.addEventListener('change', () => updateComponentRow(component));
        }
    });

    // Funcionalidades avanzadas para la Sección 3.2
    const allMeasurementFields = [
        'uh-ball-1', 'uh-ball-2', 'uh-ball-3',
        'dh-ball-1', 'dh-ball-2', 'dh-ball-3',
        'uh-sleeve-1', 'uh-sleeve-2', 'uh-sleeve-3',
        'dh-sleeve-1', 'dh-sleeve-2', 'dh-sleeve-3'
    ];

    allMeasurementFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                validateMeasurement(fieldId);
                calculateAdvancedGaps();
                calculateStatistics();
                updateQualityScore();
            });
        }
    });

    // Inicializar contadores
    updateSummaryCounters();
});

// Funciones originales
function calculateGaps() {
    // Calcular UH GAP (promedio de sleeves UH - promedio de balls UH)
    const uhBalls = [
        parseFloat(document.getElementById('uh-ball-1')?.value || 0),
        parseFloat(document.getElementById('uh-ball-2')?.value || 0),
        parseFloat(document.getElementById('uh-ball-3')?.value || 0)
    ];
    
    const uhSleeves = [
        parseFloat(document.getElementById('uh-sleeve-1')?.value || 0),
        parseFloat(document.getElementById('uh-sleeve-2')?.value || 0),
        parseFloat(document.getElementById('uh-sleeve-3')?.value || 0)
    ];

    // Calcular DH GAP (promedio de sleeves DH - promedio de balls DH)
    const dhBalls = [
        parseFloat(document.getElementById('dh-ball-1')?.value || 0),
        parseFloat(document.getElementById('dh-ball-2')?.value || 0),
        parseFloat(document.getElementById('dh-ball-3')?.value || 0)
    ];
    
    const dhSleeves = [
        parseFloat(document.getElementById('dh-sleeve-1')?.value || 0),
        parseFloat(document.getElementById('dh-sleeve-2')?.value || 0),
        parseFloat(document.getElementById('dh-sleeve-3')?.value || 0)
    ];

    // Calcular promedios solo si hay valores válidos
    const uhBallsValid = uhBalls.filter(val => val > 0);
    const uhSleevesValid = uhSleeves.filter(val => val > 0);
    const dhBallsValid = dhBalls.filter(val => val > 0);
    const dhSleevesValid = dhSleeves.filter(val => val > 0);

    if (uhBallsValid.length > 0 && uhSleevesValid.length > 0) {
        const uhBallAvg = uhBallsValid.reduce((a, b) => a + b) / uhBallsValid.length;
        const uhSleeveAvg = uhSleevesValid.reduce((a, b) => a + b) / uhSleevesValid.length;
        const uhGap = uhSleeveAvg - uhBallAvg;
        document.getElementById('uh-gap-calc').value = uhGap.toFixed(3);
    }

    if (dhBallsValid.length > 0 && dhSleevesValid.length > 0) {
        const dhBallAvg = dhBallsValid.reduce((a, b) => a + b) / dhBallsValid.length;
        const dhSleeveAvg = dhSleevesValid.reduce((a, b) => a + b) / dhSleevesValid.length;
        const dhGap = dhSleeveAvg - dhBallAvg;
        document.getElementById('dh-gap-calc').value = dhGap.toFixed(3);
    }
}

// Funciones para la Sección 3.1
function updateQCStatus(component, status) {
    const statusElement = document.getElementById(`${component}-status`);
    if (statusElement) {
        statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusElement.className = `qc-status ${status}`;
    }
}

function validateComponent(component) {
    const newChecked = document.getElementById(`${component}-new`)?.checked;
    const usedChecked = document.getElementById(`${component}-used`)?.checked;
    const serialNumber = document.getElementById(`${component}-sn`)?.value;
    const partNumber = document.getElementById(`${component}-pn`)?.value;
    const installDate = document.getElementById(`${component}-date`)?.value;

    if ((newChecked || usedChecked) && serialNumber && partNumber) {
        updateQCStatus(component, 'validated');
        showNotification(`${component} validated successfully!`, 'success');
    } else {
        updateQCStatus(component, 'failed');
        showNotification(`${component} validation failed. Check all fields.`, 'error');
    }
    
    updateSummaryCounters();
}

function clearComponent(component) {
    ['new', 'used'].forEach(condition => {
        const checkbox = document.getElementById(`${component}-${condition}`);
        if (checkbox) checkbox.checked = false;
    });
    
    ['sn', 'pn', 'date'].forEach(field => {
        const input = document.getElementById(`${component}-${field}`);
        if (input) input.value = '';
    });
    
    updateQCStatus(component, 'pending');
    updateSummaryCounters();
    showNotification(`${component} data cleared.`, 'info');
}

function bulkValidateAll() {
    const componentRows = [
        'upper-kicker', 'lower-kicker', 'hinge-pin', 'pad', 'clamp-plate',
        'sleeve-uh', 'sleeve-dh', 'ball-uh', 'ball-dh'
    ];
    
    let validated = 0;
    componentRows.forEach(component => {
        const newChecked = document.getElementById(`${component}-new`)?.checked;
        const usedChecked = document.getElementById(`${component}-used`)?.checked;
        const serialNumber = document.getElementById(`${component}-sn`)?.value;
        
        if ((newChecked || usedChecked) && serialNumber) {
            updateQCStatus(component, 'validated');
            validated++;
        } else {
            updateQCStatus(component, 'failed');
        }
    });
    
    showNotification(`Bulk validation complete: ${validated}/${componentRows.length} components validated.`, 'info');
    updateSummaryCounters();
}

function updateComponentRow(component) {
    // Auto-llenar fecha si no está establecida
    const dateField = document.getElementById(`${component}-date`);
    if (dateField && !dateField.value) {
        dateField.value = formattedDate;
    }
}

function validateSerialNumber(component) {
    const snField = document.getElementById(`${component}-sn`);
    if (snField) {
        const value = snField.value;
        // Validar formato SN-XXXX-XXXX
        const isValid = /^SN-\w{4}-\w{4}$/i.test(value) || value === '';
        
        if (value && !isValid) {
            snField.style.borderColor = '#dc3545';
            showNotification('Invalid serial number format. Use: SN-XXXX-XXXX', 'warning');
        } else {
            snField.style.borderColor = value ? '#28a745' : '';
        }
    }
}

function validatePartNumber(component) {
    const pnField = document.getElementById(`${component}-pn`);
    if (pnField) {
        const value = pnField.value;
        // Validar formato PN-XXXX
        const isValid = /^PN-\w{4}$/i.test(value) || value === '';
        
        if (value && !isValid) {
            pnField.style.borderColor = '#dc3545';
            showNotification('Invalid part number format. Use: PN-XXXX', 'warning');
        } else {
            pnField.style.borderColor = value ? '#28a745' : '';
        }
    }
}

function updateSummaryCounters() {
    const componentRows = [
        'upper-kicker', 'lower-kicker', 'hinge-pin', 'pad', 'clamp-plate',
        'sleeve-uh', 'sleeve-dh', 'ball-uh', 'ball-dh'
    ];
    
    let newCount = 0;
    let usedCount = 0;
    let validatedCount = 0;
    let totalFields = 0;
    let completedFields = 0;
    
    componentRows.forEach(component => {
        if (document.getElementById(`${component}-new`)?.checked) newCount++;
        if (document.getElementById(`${component}-used`)?.checked) usedCount++;
        
        const status = document.getElementById(`${component}-status`)?.textContent;
        if (status === 'Validated') validatedCount++;
        
        // Contar campos completados
        ['new', 'used', 'sn', 'pn', 'date'].forEach(field => {
            totalFields++;
            const element = document.getElementById(`${component}-${field}`);
            if (element && (element.checked || element.value)) completedFields++;
        });
    });
    
    const newCountEl = document.getElementById('new-count');
    const usedCountEl = document.getElementById('used-count');
    const validatedCountEl = document.getElementById('validated-count');
    const completionPercentageEl = document.getElementById('completion-percentage');
    
    if (newCountEl) newCountEl.textContent = newCount;
    if (usedCountEl) usedCountEl.textContent = usedCount;
    if (validatedCountEl) validatedCountEl.textContent = `${validatedCount}/${componentRows.length}`;
    
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    if (completionPercentageEl) completionPercentageEl.textContent = `${completionPercentage}%`;
}

// Funciones para la Sección 3.2
function validateMeasurement(fieldId) {
    const field = document.getElementById(fieldId);
    const statusDiv = document.getElementById(`${fieldId}-status`);
    
    if (field && statusDiv) {
        const value = parseFloat(field.value);
        const toleranceLevel = document.getElementById('tolerance-level')?.value || 'standard';
        
        let tolerance = 0.05; // standard
        if (toleranceLevel === 'tight') tolerance = 0.02;
        if (toleranceLevel === 'loose') tolerance = 0.10;
        
        // Definir rangos esperados basados en especificaciones PDORB6
        let expectedMin, expectedMax;
        if (fieldId.includes('ball')) {
            expectedMin = 46.71;
            expectedMax = 47.004;
        } else if (fieldId.includes('sleeve')) {
            expectedMin = 46.91;
            expectedMax = 47.204;
        }
        
        if (value && expectedMin && expectedMax) {
            if (value >= expectedMin && value <= expectedMax) {
                statusDiv.className = 'measurement-status valid';
                field.style.borderColor = '#28a745';
            } else if (value >= (expectedMin - tolerance) && value <= (expectedMax + tolerance)) {
                statusDiv.className = 'measurement-status warning';
                field.style.borderColor = '#ffc107';
            } else {
                statusDiv.className = 'measurement-status invalid';
                field.style.borderColor = '#dc3545';
            }
        } else {
            statusDiv.className = 'measurement-status';
            field.style.borderColor = '';
        }
    }
}

function calculateAdvancedGaps() {
    calculateGaps(); // Función original
    
    // Cálculos avanzados de calidad de gap
    const uhGap = parseFloat(document.getElementById('uh-gap-calc')?.value || 0);
    const dhGap = parseFloat(document.getElementById('dh-gap-calc')?.value || 0);
    
    updateGapQuality('uh', uhGap);
    updateGapQuality('dh', dhGap);
}

function updateGapQuality(location, gap) {
    const qualityDiv = document.getElementById(`${location}-gap-quality`);
    const statusSpan = document.getElementById(`${location}-gap-status`);
    
    if (qualityDiv && statusSpan) {
        // Rangos de calidad para PDORB6 (0.02-0.1mm)
        if (gap >= 0.02 && gap <= 0.1) {
            if (gap >= 0.04 && gap <= 0.08) {
                qualityDiv.textContent = 'Excellent';
                qualityDiv.className = 'gap-quality excellent';
                statusSpan.textContent = 'Optimal';
                statusSpan.className = 'gap-status optimal';
            } else {
                qualityDiv.textContent = 'Good';
                qualityDiv.className = 'gap-quality good';
                statusSpan.textContent = 'Acceptable';
                statusSpan.className = 'gap-status acceptable';
            }
        } else {
            qualityDiv.textContent = 'Poor';
            qualityDiv.className = 'gap-quality poor';
            statusSpan.textContent = 'Critical';
            statusSpan.className = 'gap-status critical';
        }
    }
}

function calculateStatistics() {
    // Calcular promedios y desviaciones estándar
    const locations = ['uh-ball', 'dh-ball', 'uh-sleeve', 'dh-sleeve'];
    
    locations.forEach(location => {
        const values = [];
        for (let i = 1; i <= 3; i++) {
            const value = parseFloat(document.getElementById(`${location}-${i}`)?.value || 0);
            if (value > 0) values.push(value);
        }
        
        if (values.length > 0) {
            const avg = values.reduce((a, b) => a + b) / values.length;
            const std = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / values.length);
            
            const avgElement = document.getElementById(`${location}-avg`);
            const stdElement = document.getElementById(`${location}-std`);
            
            if (avgElement) avgElement.textContent = avg.toFixed(3);
            if (stdElement) stdElement.textContent = std.toFixed(3);
        }
    });
}

function updateQualityScore() {
    // Calcular score de calidad basado en tolerancias y completitud
    const allMeasurementFields = [
        'uh-ball-1', 'uh-ball-2', 'uh-ball-3',
        'dh-ball-1', 'dh-ball-2', 'dh-ball-3',
        'uh-sleeve-1', 'uh-sleeve-2', 'uh-sleeve-3',
        'dh-sleeve-1', 'dh-sleeve-2', 'dh-sleeve-3'
    ];
    
    let validMeasurements = 0;
    let totalMeasurements = 0;
    
    allMeasurementFields.forEach(fieldId => {
        const statusDiv = document.getElementById(`${fieldId}-status`);
        if (statusDiv) {
            totalMeasurements++;
            if (statusDiv.classList.contains('valid')) {
                validMeasurements++;
            }
        }
    });
    
    const qualityPercentage = totalMeasurements > 0 ? (validMeasurements / totalMeasurements) * 100 : 0;
    
    const qualityBar = document.getElementById('quality-bar');
    const qualityPercentageSpan = document.getElementById('quality-percentage');
    
    if (qualityBar) {
        qualityBar.style.setProperty('--quality-width', `${qualityPercentage}%`);
    }
    
    if (qualityPercentageSpan) {
        qualityPercentageSpan.textContent = `${Math.round(qualityPercentage)}%`;
    }
    
    // Actualizar análisis de tolerancia
    updateToleranceAnalysis();
}

function updateToleranceAnalysis() {
    const uhGap = parseFloat(document.getElementById('uh-gap-calc')?.value || 0);
    const dhGap = parseFloat(document.getElementById('dh-gap-calc')?.value || 0);
    
    const uhResult = document.getElementById('uh-gap-tolerance-result');
    const dhResult = document.getElementById('dh-gap-tolerance-result');
    const repeatabilityResult = document.getElementById('repeatability-result');
    
    if (uhResult) {
        uhResult.textContent = (uhGap >= 0.02 && uhGap <= 0.1) ? 'In Tolerance' : 'Out of Tolerance';
        uhResult.style.color = (uhGap >= 0.02 && uhGap <= 0.1) ? '#28a745' : '#dc3545';
    }
    
    if (dhResult) {
        dhResult.textContent = (dhGap >= 0.02 && dhGap <= 0.1) ? 'In Tolerance' : 'Out of Tolerance';
        dhResult.style.color = (dhGap >= 0.02 && dhGap <= 0.1) ? '#28a745' : '#dc3545';
    }
    
    // Calcular repetibilidad basada en desviación estándar
    const uhBallStd = parseFloat(document.getElementById('uh-ball-std')?.textContent || 0);
    const dhBallStd = parseFloat(document.getElementById('dh-ball-std')?.textContent || 0);
    const avgStd = (uhBallStd + dhBallStd) / 2;
    
    if (repeatabilityResult) {
        if (avgStd < 0.01) {
            repeatabilityResult.textContent = 'Excellent';
            repeatabilityResult.style.color = '#28a745';
        } else if (avgStd < 0.02) {
            repeatabilityResult.textContent = 'Good';
            repeatabilityResult.style.color = '#ffc107';
        } else {
            repeatabilityResult.textContent = 'Poor';
            repeatabilityResult.style.color = '#dc3545';
        }
    }
}

function finalizeMeasurements() {
    const measuredBy = document.getElementById('measured-by-32')?.value;
    const measuredDateTime = document.getElementById('measured-datetime-32')?.value;
    
    if (!measuredBy || !measuredDateTime) {
        showNotification('Please fill in Measured By and Date/Time fields.', 'warning');
        return;
    }
    
    // Marcar como finalizado
    const finalizeBtn = document.querySelector('.finalize-btn');
    if (finalizeBtn) {
        finalizeBtn.innerHTML = '<i class="fas fa-lock"></i> Finalized';
        finalizeBtn.disabled = true;
        finalizeBtn.style.background = '#6c757d';
    }
    
    // Deshabilitar todos los campos de medición
    const allInputs = document.querySelectorAll('.measurements-table.enhanced input:not([readonly])');
    allInputs.forEach(input => input.disabled = true);
    
    showNotification('Measurements finalized successfully!', 'success');
}

function exportMeasurements() {
    // Generar datos de exportación
    const exportData = {
        timestamp: new Date().toISOString(),
        measurements: {},
        gaps: {},
        statistics: {},
        quality: {}
    };
    
    // Recopilar datos
    const fields = ['uh-ball', 'dh-ball', 'uh-sleeve', 'dh-sleeve'];
    fields.forEach(field => {
        exportData.measurements[field] = [];
        for (let i = 1; i <= 3; i++) {
            const value = document.getElementById(`${field}-${i}`)?.value;
            exportData.measurements[field].push(value || null);
        }
        exportData.statistics[field] = {
            avg: document.getElementById(`${field}-avg`)?.textContent || '-',
            std: document.getElementById(`${field}-std`)?.textContent || '-'
        };
    });
    
    exportData.gaps = {
        uh: document.getElementById('uh-gap-calc')?.value || '0.000',
        dh: document.getElementById('dh-gap-calc')?.value || '0.000'
    };
    
    // Crear y descargar archivo JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PDORB_Measurements_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Measurement data exported successfully!', 'success');
}

function showNotification(message, type) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#856404';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);