# Gestor de Tareas

Aplicación web interactiva para la gestión de tareas diarias, desarrollada como evaluación final para la Unidad III de Programación Web.

---

## Objetivo

Desarrollar una mini-aplicación web que permita gestionar tareas diarias, demostrando habilidades en HTML, CSS y JavaScript, incluyendo manipulación del DOM, eventos, validaciones y persistencia de datos.

---

## Requerimientos Cumplidos

### Estructura y Maqueta
-  Página principal (index.html) con maqueta propia
-  Separación de responsabilidades: HTML, CSS y JS
-  Diseño usable y legible con jerarquía visual

### Interacción con DOM y Eventos
-  Manipulación del DOM (selección y modificación)
-  6 eventos implementados: submit, click, keyup, change, input, DOMContentLoaded
-  Generación dinámica: createElement, append, remove

### Formulario y Validaciones
-  Formulario con 5 campos
-  6 reglas de validación:
  1. Título requerido
  2. Título mínimo 3 caracteres
  3. Categoría requerida
  4. Fecha límite requerida
  5. Fecha debe ser hoy o en el futuro
  6. Confirmación de título coincide
-  Mensajes de error por campo y feedback visual
-  Prevención de envío con preventDefault()

### Datos y Persistencia
-  Persistencia en LocalStorage
-  Datos de ejemplo precargados

### Usabilidad y Calidad
-  Diseño responsive para móviles y tablets
-  Sin errores en consola (DevTools)
-  Código ordenado con funciones reutilizables

### Versionamiento
-  Repositorio GitHub con los commits requeridos (mínimo 4)
-  README completo con evidencias

---

## Instrucciones de Ejecución

### Opción 1: Abrir directamente
```bash
# Navegar a la carpeta del proyecto
cd gestor-tareas

# Abrir index.html en el navegador
# Windows: start index.html
# macOS: open index.html
# Linux: xdg-open index.html
