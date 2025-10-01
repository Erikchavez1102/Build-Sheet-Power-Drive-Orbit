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
});