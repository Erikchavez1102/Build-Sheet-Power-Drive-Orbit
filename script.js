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
    const formattedDate = `${year}-${month}-${day}`;

    // Asigna la fecha formateada al valor del campo de entrada de fecha
    dateInput.value = formattedDate;


    // Auto-llenar fecha en Sección 3.2
    const measuredDate32 = document.getElementById('measured-date-32');
    if (measuredDate32) {
        measuredDate32.value = formattedDate;
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

    // Funcionalidad para checkboxes mutuamente excluyentes en la tabla de componentes
    const componentRows = [
        'upper-kicker', 'lower-kicker', 'hinge-pin', 'pad', 'clamp-plate',
        'sleeve-uh', 'sleeve-dh', 'ball-uh', 'ball-dh'
    ];

    componentRows.forEach(component => {
        const newCheckbox = document.getElementById(`${component}-new`);
        const usedCheckbox = document.getElementById(`${component}-used`);

        if (newCheckbox && usedCheckbox) {
            newCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    usedCheckbox.checked = false;
                }
            });

            usedCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    newCheckbox.checked = false;
                }
            });
        }
    });

    // Funcionalidad para calcular GAPs automáticamente en Sección 3.2
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

    // Añadir event listeners para todos los campos de medición
    const measurementFields = [
        'uh-ball-1', 'uh-ball-2', 'uh-ball-3',
        'dh-ball-1', 'dh-ball-2', 'dh-ball-3',
        'uh-sleeve-1', 'uh-sleeve-2', 'uh-sleeve-3',
        'dh-sleeve-1', 'dh-sleeve-2', 'dh-sleeve-3'
    ];

    measurementFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', calculateGaps);
        }
    });
});