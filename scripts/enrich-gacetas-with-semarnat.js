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
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Authorization': AUTH_TOKEN,
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'DNT': '1',
  'Origin': 'https://app.semarnat.gob.mx',
  'Referer': 'https://app.semarnat.gob.mx/',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Not_A Brand";v="99", "Chromium";v="142"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
});

// Función para delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para obtener archivos del proyecto (search-files)
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

// Función para obtener datos del proyecto (search-proyecto)
async function fetchProyectoData(clave) {
  try {
    const response = await fetch(
      `${SEMARNAT_BASE_URL}/proyectos/search-proyecto`,
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

// Función para obtener datos de la bitácora (search-bitacora)
async function fetchBitacoraData(numBitacora) {
  try {
    const response = await fetch(
      `${SEMARNAT_BASE_URL}/bitacoras/search-bitacora`,
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

// Función para obtener proyecto asociado a bitácora (search-proyecto-bitacora)
async function fetchProyectoBitacoraData(numBitacora) {
  try {
    const response = await fetch(
      `${SEMARNAT_BASE_URL}/proyectos/search-proyecto-bitacora`,
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
  let registrosConFiles = 0;
  let registrosConProyecto = 0;
  let registrosConBitacora = 0;
  let registrosConProyectoBitacora = 0;
  let registrosConHistorial = 0;
  let erroresFiles = 0;
  let erroresProyecto = 0;
  let erroresBitacora = 0;
  let erroresProyectoBitacora = 0;
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

      // Verificar qué datos ya tiene el registro
      const tieneFiles = registro.semarnat_data !== undefined;
      const tieneProyecto = registro.semarnat_proyecto !== undefined;
      const tieneBitacora = registro.semarnat_bitacora !== undefined;
      const tieneProyectoBitacora = registro.semarnat_proyecto_bitacora !== undefined;
      const tieneHistorial = registro.semarnat_historial !== undefined;

      // 1. Obtener archivos del proyecto (search-files) si tiene clave_proyecto
      if (registro.clave_proyecto && !tieneFiles) {
        console.log(`    🔍 [Files] Obteniendo archivos para: ${registro.clave_proyecto}`);
        const data = await fetchSemarnatData(registro.clave_proyecto);
        
        if (data.error) {
          console.log(`    ❌ [Files] Error: ${data.error}`);
          registro.semarnat_data = { error: data.error, details: data.details || null };
          erroresFiles++;
        } else {
          console.log(`    ✅ [Files] Archivos obtenidos exitosamente`);
          registro.semarnat_data = data;
          registrosConFiles++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneFiles) {
        console.log(`    ⏭️  [Files] Ya existente, omitiendo...`);
      }

      // 2. Obtener datos del proyecto (search-proyecto) si tiene clave_proyecto
      if (registro.clave_proyecto && !tieneProyecto) {
        console.log(`    🔍 [Proyecto] Obteniendo datos del proyecto para: ${registro.clave_proyecto}`);
        const proyectoData = await fetchProyectoData(registro.clave_proyecto);
        
        if (proyectoData.error) {
          console.log(`    ❌ [Proyecto] Error: ${proyectoData.error}`);
          registro.semarnat_proyecto = { error: proyectoData.error, details: proyectoData.details || null };
          erroresProyecto++;
        } else {
          console.log(`    ✅ [Proyecto] Datos obtenidos exitosamente`);
          registro.semarnat_proyecto = proyectoData;
          registrosConProyecto++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneProyecto) {
        console.log(`    ⏭️  [Proyecto] Ya existente, omitiendo...`);
      }

      // 3. Obtener datos de la bitácora (search-bitacora) si tiene id
      if (registro.id && !tieneBitacora) {
        console.log(`    🔍 [Bitácora] Obteniendo datos de bitácora para: ${registro.id}`);
        const bitacoraData = await fetchBitacoraData(registro.id);
        
        if (bitacoraData.error) {
          console.log(`    ❌ [Bitácora] Error: ${bitacoraData.error}`);
          registro.semarnat_bitacora = { error: bitacoraData.error, details: bitacoraData.details || null };
          erroresBitacora++;
        } else {
          console.log(`    ✅ [Bitácora] Datos obtenidos exitosamente`);
          registro.semarnat_bitacora = bitacoraData;
          registrosConBitacora++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneBitacora) {
        console.log(`    ⏭️  [Bitácora] Ya existente, omitiendo...`);
      }

      // 4. Obtener proyecto asociado a bitácora (search-proyecto-bitacora) si tiene id
      if (registro.id && !tieneProyectoBitacora) {
        console.log(`    🔍 [Proyecto-Bitácora] Obteniendo proyecto-bitácora para: ${registro.id}`);
        const proyectoBitacoraData = await fetchProyectoBitacoraData(registro.id);
        
        if (proyectoBitacoraData.error) {
          console.log(`    ❌ [Proyecto-Bitácora] Error: ${proyectoBitacoraData.error}`);
          registro.semarnat_proyecto_bitacora = { error: proyectoBitacoraData.error, details: proyectoBitacoraData.details || null };
          erroresProyectoBitacora++;
        } else {
          console.log(`    ✅ [Proyecto-Bitácora] Datos obtenidos exitosamente`);
          registro.semarnat_proyecto_bitacora = proyectoBitacoraData;
          registrosConProyectoBitacora++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneProyectoBitacora) {
        console.log(`    ⏭️  [Proyecto-Bitácora] Ya existente, omitiendo...`);
      }

      // 5. Obtener historial (search-historial-bitacora) si tiene id
      if (registro.id && !tieneHistorial) {
        console.log(`    🔍 [Historial] Obteniendo historial para: ${registro.id}`);
        const historial = await fetchHistorial(registro.id);
        
        if (historial.error) {
          console.log(`    ❌ [Historial] Error: ${historial.error}`);
          registro.semarnat_historial = { error: historial.error, details: historial.details || null };
          erroresHistorial++;
        } else {
          console.log(`    ✅ [Historial] Historial obtenido exitosamente`);
          registro.semarnat_historial = historial;
          registrosConHistorial++;
        }
        await delay(DELAY_BETWEEN_REQUESTS);
      } else if (tieneHistorial) {
        console.log(`    ⏭️  [Historial] Ya existente, omitiendo...`);
      }

      // Guardar progreso cada 10 registros
      if (registrosProcesados % 10 === 0) {
        console.log(`\n💾 Guardando progreso intermedio...`);
        fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2), 'utf8');
      }
    }
  }

  // Actualizar metadata
  if (!jsonData.metadata) {
    jsonData.metadata = {};
  }
  jsonData.metadata.last_enriched = new Date().toISOString();
  jsonData.metadata.enrichment_stats = {
    total_registros: totalRegistros,
    registros_con_files: registrosConFiles,
    registros_con_proyecto: registrosConProyecto,
    registros_con_bitacora: registrosConBitacora,
    registros_con_proyecto_bitacora: registrosConProyectoBitacora,
    registros_con_historial: registrosConHistorial,
    errores_files: erroresFiles,
    errores_proyecto: erroresProyecto,
    errores_bitacora: erroresBitacora,
    errores_proyecto_bitacora: erroresProyectoBitacora,
    errores_historial: erroresHistorial
  };

  // Guardar archivo final
  console.log(`\n💾 Guardando archivo final...`);
  fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2), 'utf8');

  // Mostrar estadísticas finales
  console.log(`\n✅ Proceso completado!\n`);
  console.log(`📊 Estadísticas:`);
  console.log(`   Total de registros: ${totalRegistros}`);
  console.log(`   Registros con archivos (search-files): ${registrosConFiles}`);
  console.log(`   Registros con datos proyecto (search-proyecto): ${registrosConProyecto}`);
  console.log(`   Registros con datos bitácora (search-bitacora): ${registrosConBitacora}`);
  console.log(`   Registros con proyecto-bitácora (search-proyecto-bitacora): ${registrosConProyectoBitacora}`);
  console.log(`   Registros con historial: ${registrosConHistorial}`);
  console.log(`\n❌ Errores:`);
  console.log(`   Errores archivos: ${erroresFiles}`);
  console.log(`   Errores proyecto: ${erroresProyecto}`);
  console.log(`   Errores bitácora: ${erroresBitacora}`);
  console.log(`   Errores proyecto-bitácora: ${erroresProyectoBitacora}`);
  console.log(`   Errores historial: ${erroresHistorial}`);
}

// Ejecutar script
if (require.main === module) {
  enrichGacetas().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { enrichGacetas };

