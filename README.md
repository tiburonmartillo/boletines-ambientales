# Dashboard de Boletines Ambientales - Aguascalientes

Dashboard interactivo para visualizar datos de boletines ambientales publicados por la Secretaría de Medio Ambiente del Estado de Aguascalientes.

## 🌐 Acceso

- **Producción**: [https://adn-a.org](https://adn-a.org)
- **GitHub Pages**: [https://tiburonmartillo.github.io/boletines-ambientales](https://tiburonmartillo.github.io/boletines-ambientales)

## ✨ Características

### 📊 Visualizaciones
- **Gráfica de tendencia temporal** - Evolución de proyectos y resolutivos en el tiempo
- **Gráficas de distribución** - Análisis por municipio y giro empresarial
- **Tarjetas de estadísticas** - Resumen de datos principales

### 🗺️ Sistema de Mapas
- **OpenStreetMap** con soporte nativo para coordenadas UTM
- **Conversión automática** de coordenadas UTM a Lat/Long para Aguascalientes
- **Modal interactivo** para visualización de ubicaciones
- **Enlaces directos** a mapas externos

### 📋 Tabla de Proyectos
- **Vista dual**: Proyectos Ingresados y Resolutivos Emitidos
- **Filtros avanzados**: Municipio, giro, tipo de estudio, fechas
- **Búsqueda**: Por expediente, proyecto o promovente
- **Paginación**: Navegación eficiente por grandes volúmenes de datos
- **Botones de acción**: Consultar boletines y ver ubicaciones

### 🔗 Trazabilidad
- **Relación automática** entre proyectos ingresados y resolutivos por expediente
- **Coordenadas heredadas** de proyectos a resolutivos
- **Acceso a boletines** tanto de ingreso como de resolución

## 🛠️ Tecnologías

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Recharts** - Gráficas interactivas
- **Leaflet** - Mapas interactivos
- **Shadcn/ui** - Componentes de interfaz

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Exportar sitio estático
npm run export
```

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
├── components/             # Componentes React
│   ├── ui/                # Componentes base (Shadcn/ui)
│   ├── dashboard-stats.tsx # Tarjetas de estadísticas
│   ├── time-series-chart.tsx # Gráfica de tendencia
│   ├── distribution-charts.tsx # Gráficas de distribución
│   ├── projects-table.tsx  # Tabla principal
│   ├── map-modal.tsx       # Modal de mapas
│   └── map-viewer.tsx      # Visualizador de mapas
├── lib/                    # Utilidades y lógica de datos
├── data/                   # Datos JSON
├── public/                 # Archivos estáticos
└── styles/                 # Estilos CSS
```

## 🌐 Despliegue

### GitHub Pages con Dominio Personalizado

El proyecto está configurado para desplegarse automáticamente en GitHub Pages con el dominio personalizado `adn-a.org`.

#### Configuración DNS Requerida:
```
Tipo: CNAME
Nombre: www
Valor: tiburonmartillo.github.io

Tipo: A
Nombre: @
Valor: 185.199.108.153
Valor: 185.199.109.153
Valor: 185.199.110.153
Valor: 185.199.111.153
```

#### Archivos de Configuración:
- `public/CNAME` - Configuración del dominio personalizado
- `public/.nojekyll` - Deshabilita Jekyll en GitHub Pages
- `next.config.mjs` - Configuración para sitio estático
- `.github/workflows/deploy.yml` - Workflow de despliegue automático

## 📊 Datos

Los datos se almacenan en formato JSON y incluyen:
- Información de boletines ambientales
- Proyectos ingresados con coordenadas UTM
- Resolutivos emitidos
- Metadatos de fechas y ubicaciones

## 🎨 Diseño

El diseño está inspirado en interfaces modernas con:
- Paleta de colores profesional (grises, azules, verdes)
- Tipografía clara y legible
- Componentes interactivos con feedback visual
- Layout responsivo para todos los dispositivos

## 📝 Licencia

Este proyecto es desarrollado para la Secretaría de Medio Ambiente del Estado de Aguascalientes.

## 🤝 Contribuciones

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

---

**Desarrollado para la Secretaría de Medio Ambiente del Estado de Aguascalientes**# Trigger deployment
