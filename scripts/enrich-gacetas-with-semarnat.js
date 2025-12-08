#!/usr/bin/env node

/**
 * Script para enriquecer el JSON de gacetas con datos del API de SEMARNAT
 * Extrae información de proyectos e historial y la guarda directamente en el JSON
 */

const fs = require('fs');
const path = require('path');

const SEMARNAT_BASE_URL = 'https://apps1.semarnat.gob.mx/ws-bitacora-tramite';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzZW1hcm5hdEpXVCIsInN1YiI6IlVzdWFyaW97c2VnVXN1YXJpb3NJZDoxLHNlZ1VzdWFyaW9zTm9tYnJlVXN1YXJpbzogJ2FuYV9vbHZlcmFfc2FyZ2F6bycsc2VnVXN1YXJpb3NQYXNzd29yZDogJyQyYSQxMCRqb21vU2JCT0VycWhoWmU3cEFER2J1WjA4ZDhhUUpucEk0dkhOZU9ScVZjbFRtNWJYZUFHQyd9IiwiYXV0aG9yaXRpZXMiOlsic2FyZ2F6byJdLCJpYXQiOjE2NTk5NDEyODZ9.qd17vj3iTjaGnB8w8wq4Eb-44o_2Zcy-x1o8vF9WvRmYGYupShpLaYXK8vL7FxxXy5MDIlOIhnTCQL-rpUw_ow';

const JSON_FILE = path.join(__dirname, '../public/data/gacetas_semarnat_analizadas.json');
const DELAY_BETWEEN_REQUESTS = 800; // ms

// Headers para las peticiones
const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.5',
  'Authorization': AUTH_TOKEN,
  'Content-Type': 'application/json',
  'Origin': 'https://app.semarnat.gob.mx',
  'Referer': 'https://app.semarnat.gob.mx/',
});

// Función para delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para obtener datos del proyecto
async function fetchSemarnatData(clave) {
  try {
    const response = await fetch(
      `${SEMARNAT_BASE_URL}/proyectos/search-files`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ clave })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `HTTP ${response.status}`, details: errorText };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || 'Error desconocido' };
  }
}

// Función para obtener historial
async function fetchHistorial(numBitacora) {
  try {
    const response = await fetch(
      `${SEMARNAT_BASE_URL}/historial/search-historial-bitacora`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ numBitacora })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `HTTP ${response.status}`, details: errorText };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message || 'Error desconocido' };
  }
}

// Función principal
async function enrichGacetas() {
  console.log('📖 Leyendo archivo JSON...');
  const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  
  let totalRegistros = 0;
  let registrosProcesados = 0;
  let registrosConData = 0;
  let registrosConHistorial = 0;
  let erroresData = 0;
  let erroresHistorial = 0;

  // Contar registros totales
  jsonData.analyses.forEach(gaceta => {
    if (gaceta.analisis_completo?.registros) {
      totalRegistros += gaceta.analisis_completo.registros.length;
    }
  });

  console.log(`📊 Total de registros encontrados: ${totalRegistros}\n`);

  // Procesar cada gaceta
  for (let i = 0; i < jsonData.analyses.length; i++) {
    const gaceta = jsonData.analyses[i];
    
    if (!gaceta.analisis_completo?.registros) {
      continue;
    }

    console.log(`\n📄 Procesando gaceta ${gaceta.gaceta_id} (${i + 1}/${jsonData.analyses.length})`);

    // Procesar cada registro
    for (let j = 0; j < gaceta.analisis_completo.registros.length; j++) {
      const registro = gaceta.analisis_completo.registros[j];
      registrosProcesados++;

      const progress = `[${registrosProcesados}/${totalRegistros}]`;
      console.log(`  ${progress} Registro: ${registro.id || registro.clave_proyecto || 'sin ID'}`);

      // Si ya tiene los datos, verificar si necesita actualización
      const tieneData = registro.semarnat_data !== undefined;
      const tieneHistorial = registro.semarnat_historial !== undefined;

      // Obtener datos del proyecto si tiene clave_proyecto
      if (registro.clave_proyecto && !tieneData) {
        console.log(`    🔍 Obteniendo datos del proyecto para: ${registro.clave_proyecto}`);
        const data = await fetchSemarnatData(registro.clave_proyecto);
        
        if (data.error) {
          console.log(`    ❌ Error al obtener datos: ${data.error}`);
          registro.semarnat_data = { error: data.error, details: data.details || null };
          erroresData++;
        } else {
          console.log(`    ✅ Datos obtenidos exitosamente`);
          registro.semarnat_data = data;
          registrosConData++;
        }

        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneData) {
        console.log(`    ⏭️  Datos ya existentes, omitiendo...`);
      }

      // Obtener historial si tiene id
      if (registro.id && !tieneHistorial) {
        console.log(`    🔍 Obteniendo historial para: ${registro.id}`);
        const historial = await fetchHistorial(registro.id);
        
        if (historial.error) {
          console.log(`    ❌ Error al obtener historial: ${historial.error}`);
          registro.semarnat_historial = { error: historial.error, details: historial.details || null };
          erroresHistorial++;
        } else {
          console.log(`    ✅ Historial obtenido exitosamente`);
          registro.semarnat_historial = historial;
          registrosConHistorial++;
        }

        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneHistorial) {
        console.log(`    ⏭️  Historial ya existente, omitiendo...`);
      }

      // Guardar progreso cada 10 registros
      if (registrosProcesados % 10 === 0) {
        console.log(`\n💾 Guardando progreso intermedio...`);
        fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2), 'utf8');
      }
    }
  }

  // Actualizar metadata
  jsonData.metadata.last_enriched = new Date().toISOString();
  jsonData.metadata.enrichment_stats = {
    total_registros: totalRegistros,
    registros_con_data: registrosConData,
    registros_con_historial: registrosConHistorial,
    errores_data: erroresData,
    errores_historial: erroresHistorial
  };

  // Guardar archivo final
  console.log(`\n💾 Guardando archivo final...`);
  fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2), 'utf8');

  // Mostrar estadísticas finales
  console.log(`\n✅ Proceso completado!\n`);
  console.log(`📊 Estadísticas:`);
  console.log(`   Total de registros: ${totalRegistros}`);
  console.log(`   Registros con datos SEMARNAT: ${registrosConData}`);
  console.log(`   Registros con historial: ${registrosConHistorial}`);
  console.log(`   Errores al obtener datos: ${erroresData}`);
  console.log(`   Errores al obtener historial: ${erroresHistorial}`);
}

// Ejecutar script
if (require.main === module) {
  enrichGacetas().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { enrichGacetas };

