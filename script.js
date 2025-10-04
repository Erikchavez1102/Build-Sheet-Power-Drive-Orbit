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
});