# Power Drive Orbit Build Sheet

Aplicación web para gestionar hojas de construcción del Power Drive Orbit.

## 📋 Descripción

Esta es una aplicación web estática que permite registrar y gestionar información técnica relacionada con el ensamblaje del Power Drive Orbit. Incluye funcionalidades para capturar fotos, generar PDFs y validar mediciones.

## 🚀 Cómo Ejecutar el Proyecto desde GitHub

### Opción 1: Usar GitHub Pages (Recomendado)

El proyecto puede ejecutarse directamente desde GitHub Pages:

1. **Activar GitHub Pages** (solo el propietario del repositorio):
   - Ve a la pestaña **Settings** del repositorio
   - En el menú lateral, selecciona **Pages**
   - En **Source**, selecciona la rama `main`
   - En **Folder**, selecciona `/ (root)`
   - Haz clic en **Save**
   - Espera unos minutos y la aplicación estará disponible en: `https://erikchavez1102.github.io/Build-Sheet-Power-Drive-Orbit/`

2. **Acceder a la aplicación**:
   - Una vez activado GitHub Pages, simplemente abre el enlace en tu navegador
   - No requiere instalación ni configuración adicional

### Opción 2: Ejecutar Localmente

Si prefieres ejecutar el proyecto en tu computadora:

#### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Git instalado en tu sistema

#### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Erikchavez1102/Build-Sheet-Power-Drive-Orbit.git
```

2. **Navegar al directorio del proyecto**:
```bash
cd Build-Sheet-Power-Drive-Orbit
```

3. **Abrir el proyecto**:

   **Opción A - Abrir directamente en el navegador:**
   - Localiza el archivo `index.html` en el explorador de archivos
   - Haz doble clic en `index.html` para abrirlo en tu navegador predeterminado

   **Opción B - Usar un servidor local (Recomendado para desarrollo):**
   
   Si tienes Python instalado:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   
   Si tienes Node.js instalado:
   ```bash
   # Instalar http-server globalmente (solo la primera vez)
   npm install -g http-server
   
   # Ejecutar el servidor
   http-server
   ```
   
   Si tienes PHP instalado:
   ```bash
   php -S localhost:8000
   ```
   
   Luego abre tu navegador y ve a `http://localhost:8000`

## 📱 Uso de la Aplicación

Una vez que la aplicación esté ejecutándose:

1. **Completar el formulario** con la información técnica requerida
2. **Tomar fotos** usando el botón de cámara (en dispositivos móviles)
3. **Validar mediciones** - los campos GAP se validarán automáticamente según el tipo de unidad
4. **Generar PDF** usando el botón de impresión
5. **Resetear el formulario** usando el botón Reset si es necesario

## 🔧 Estructura del Proyecto

```
Build-Sheet-Power-Drive-Orbit/
│
├── index.html          # Página principal de la aplicación
├── style.css           # Estilos y diseño
├── script.js           # Lógica de la aplicación (validaciones, fecha automática)
├── image/              # Carpeta con imágenes y logos
│   ├── SLB_Logo_2022.svg.png
│   └── powerdrive-x6-combo.jpg
└── README.md           # Este archivo
```

## ⚙️ Funcionalidades

- ✅ Formulario interactivo para registro de datos técnicos
- ✅ Validación automática de mediciones GAP según el tipo de unidad
- ✅ Captura de fotos (en dispositivos móviles)
- ✅ Generación de PDF para impresión
- ✅ Fecha automática del día actual
- ✅ Diseño responsive (se adapta a móviles y tablets)
- ✅ Interfaz en español

## 📊 Especificaciones Técnicas

### PDORB6
- **Ball Measurement**: MIN: 46.71mm - MAX: 47.004mm
- **Sleeve Measurement**: MIN: 46.91mm - MAX: 47.204mm
- **Downhole Ball/Sleeve Radial Gap**: MIN: 0.02mm - MAX: 0.1mm

### Validación GAP
- **PDORB4**: 32.10mm - 32.50mm (fondo verde cuando está en rango)
- **PDORB6, PDORB8, PDORB12**: 40.10mm - 40.50mm (fondo verde cuando está en rango)
- Fondo rojo cuando está fuera de rango

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome 6.4.0 (iconos)
- Google Fonts (Orbitron)

## 📝 Notas Adicionales

- **No requiere instalación de dependencias** - Es una aplicación completamente estática
- **Compatible con dispositivos móviles** - Incluye funcionalidad de cámara para capturar fotos
- **Sin base de datos** - Toda la información se mantiene en el navegador hasta que se genera el PDF o se resetea

## 🤝 Contribuciones

Si deseas contribuir al proyecto:

1. Haz un Fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Agregar nueva funcionalidad'`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso interno para SLB.

---

**Desarrollado por**: Erik Chavez
**Última actualización**: 2024
