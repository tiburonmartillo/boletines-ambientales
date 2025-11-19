# Estados de Cumplimiento de Boletines Ambientales

## Descripción de Estados

Los boletines ambientales se clasifican en diferentes estados de cumplimiento según la relación entre los proyectos ingresados y los resolutivos emitidos.

### 1. **Con Resolutivo** (Verde ✓)
- **Condición**: `totalResolutivos >= totalProyectos`
- **Significado**: Todos los proyectos ingresados en el boletín ya tienen su resolutivo correspondiente emitido.
- **Interpretación**: El proceso de evaluación ambiental se ha completado para todos los proyectos del boletín.
- **Color**: Verde (#10b981)
- **Icono**: CheckCircle2

### 2. **Sin Resolutivo** (Rojo ✗)
- **Condición**: `totalProyectos > 0` y `totalResolutivos === 0`
- **Significado**: Hay proyectos ingresados pero ninguno tiene resolutivo emitido aún.
- **Interpretación**: Los proyectos están en espera de evaluación y resolución.
- **Color**: Rojo (#ef4444)
- **Icono**: XCircle

### 3. **En Proceso** (Amarillo/Naranja ⏱)
- **Condición**: `totalResolutivos > 0` y `totalResolutivos < totalProyectos`
- **Significado**: Algunos proyectos ya tienen resolutivo, pero no todos.
- **Interpretación**: El proceso de evaluación está en curso, parcialmente completado.
- **Color**: Amarillo/Naranja (#f59e0b)
- **Icono**: Clock

### 4. **Desconocido** (Gris ?)
- **Condición**: `totalProyectos === 0`
- **Significado**: No hay proyectos ingresados registrados en el boletín.
- **Interpretación**: Puede ser un boletín vacío, con datos incompletos, o que solo contiene resolutivos de boletines anteriores.
- **Color**: Gris (#6b7280)
- **Icono**: HelpCircle

## Ejemplos Prácticos

### Ejemplo 1: Boletín con Resolutivo
- Proyectos ingresados: 5
- Resolutivos emitidos: 5
- **Estado**: Con Resolutivo ✓
- **Explicación**: Todos los proyectos tienen su resolutivo.

### Ejemplo 2: Boletín Sin Resolutivo
- Proyectos ingresados: 3
- Resolutivos emitidos: 0
- **Estado**: Sin Resolutivo ✗
- **Explicación**: Los proyectos están esperando evaluación.

### Ejemplo 3: Boletín En Proceso
- Proyectos ingresados: 10
- Resolutivos emitidos: 4
- **Estado**: En Proceso ⏱
- **Explicación**: 4 de 10 proyectos ya tienen resolutivo, el resto está en evaluación.

### Ejemplo 4: Boletín Desconocido
- Proyectos ingresados: 0
- Resolutivos emitidos: 2
- **Estado**: Desconocido ?
- **Explicación**: No hay proyectos nuevos, solo resolutivos (probablemente de proyectos anteriores).

## Notas Técnicas

- Los estados se calculan automáticamente usando la función `calcularEstadoCumplimiento()` en `lib/boletines-v2-utils.ts`
- La lógica considera que si hay más resolutivos que proyectos, probablemente hay resolutivos de boletines anteriores
- Los estados se muestran visualmente con colores e iconos para facilitar la identificación rápida

