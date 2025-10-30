'use client'

import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { coordinateValidator } from '@/lib/coordinate-validator';

interface Project {
  name: string;
  promoter: string;
  municipality: string;
  entryDate: string;
  expedient: string;
  type: string;
  nature: string;
  imageUrl: string;
  latitude?: number;
  longitude?: number;
  publicConsultationDeadline?: string;
}

interface Resolution {
  name: string;
  municipality: string;
  expedient: string;
  resolutionType: string;
  date: string;
  giro: string;
  tipo: string;
  nature: string;
  noOficioResolutivo: string;
  latitude?: number;
  longitude?: number;
}

interface BulletinData {
  date: string;
  projects: Project[];
  resolutions: Resolution[];
  deadlineDate: string;
}

// Función para corregir coordenadas comunes con errores de dígitos
function fixCoordinateDigits(x: number, y: number): { x: number; y: number } {
  let correctedX = x;
  let correctedY = y;
  
  // Corregir Y si tiene dígitos extra (ej: 24146188 -> 2414688)
  if (y > 10000000) {
    const yStr = y.toString();
    if (yStr.length === 8 && yStr.startsWith('24')) {
      correctedY = parseInt(yStr.substring(0, 7)); // Remover último dígito
      console.log(`🔧 Coordenada Y corregida: ${y} -> ${correctedY}`);
    }
  }
  
  // Corregir X si tiene formato incorrecto (ej: 781.265 -> 781265)
  if (x < 10000 && x > 100) {
    correctedX = Math.round(x * 1000);
    console.log(`🔧 Coordenada X corregida: ${x} -> ${correctedX}`);
  }
  
  return { x: correctedX, y: correctedY };
}

// Función para convertir coordenadas a Lat/Long (reutilizada de client-only-map.tsx)
function convertToLatLong(x: number | null, y: number | null): { lat: number; lng: number } | null {
  if (!x || !y) return null

  // Aplicar correcciones de dígitos antes de validar
  const { x: correctedX, y: correctedY } = fixCoordinateDigits(x, y);

  // Validar y corregir coordenadas
  const validationResult = coordinateValidator.processCoordinates(correctedX, correctedY);
  
  if (!validationResult.success) {
    console.warn('Coordenadas inválidas después de corrección:', validationResult.error);
    return null;
  }

  const finalX = validationResult.corrected.x;
  const finalY = validationResult.corrected.y;

  // Si las coordenadas ya están en formato Lat/Lng, devolverlas directamente
  if (validationResult.type === 'latlng') {
    return { lat: finalY, lng: finalX };
  }

  // Si son coordenadas UTM, aplicar conversión completa
  if (validationResult.type === 'utm' || validationResult.type === 'utm14') {
    const zone = validationResult.type === 'utm14' ? 14 : 13;
    
    // Parámetros del elipsoide WGS84
    const sm_a = 6378137;
    const sm_b = 6356752.314;
    const UTMScaleFactor = 0.9996;
    
    // Función auxiliar para calcular la latitud del pie
    const calculateFootpointLatitude = (y: number): number => {
      const n = (sm_a - sm_b) / (sm_a + sm_b);
      const alpha_ = ((sm_a + sm_b) / 2) * (1 + (n ** 2) / 4) + (n ** 4) / 64;
      const y_ = y / alpha_;
      
      const beta_ = (3 * n / 2) + (-27 * (n ** 3) / 32) + (269 * (n ** 5) / 512);
      const gamma_ = (21 * (n ** 2) / 16) + (-55 * (n ** 4) / 32);
      const delta_ = (151 * (n ** 3) / 96) + (-417 * (n ** 5) / 128);
      const epsilon_ = (1097 * (n ** 4) / 512);
      
      return y_ + (beta_ * Math.sin(2 * y_)) + (gamma_ * Math.sin(4 * y_)) + 
             (delta_ * Math.sin(6 * y_)) + (epsilon_ * Math.sin(8 * y_));
    };
    
    // Ajustar coordenadas UTM
    let x = finalX - 500000;
    x = x / UTMScaleFactor;
    const y = finalY / UTMScaleFactor;
    
    // Calcular meridiano central de la zona
    const lambda0 = ((-183 + (zone * 6)) / 180) * Math.PI;
    
    // Calcular latitud del pie
    const phif = calculateFootpointLatitude(y);
    
    // Precalcular valores auxiliares
    const ep2 = (sm_a ** 2 - sm_b ** 2) / (sm_b ** 2);
    const cf = Math.cos(phif);
    const nuf2 = ep2 * (cf ** 2);
    const Nf = (sm_a ** 2) / (sm_b * Math.sqrt(1 + nuf2));
    
    const tf = Math.tan(phif);
    const tf2 = tf * tf;
    const tf4 = tf2 * tf2;
    
    // Calcular coeficientes fraccionarios
    let Nfpow = Nf;
    const x1frac = 1 / (Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x2frac = tf / (2 * Nfpow);
    
    Nfpow = Nfpow * Nf;
    const x3frac = 1 / (6 * Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x4frac = tf / (24 * Nfpow);
    
    Nfpow = Nfpow * Nf;
    const x5frac = 1 / (120 * Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x6frac = tf / (720 * Nfpow);
    
    Nfpow = Nfpow * Nf;
    const x7frac = 1 / (5040 * Nfpow * cf);
    
    Nfpow = Nfpow * Nf;
    const x8frac = tf / (40320 * Nfpow);
    
    // Calcular coeficientes polinomiales
    const x2poly = -1 - nuf2;
    const x3poly = -1 - 2 * tf2 - nuf2;
    const x4poly = 5 + 3 * tf2 + 6 * nuf2 - 6 * tf2 * nuf2 - 3 * (nuf2 * nuf2) - 9 * tf2 * (nuf2 * nuf2);
    const x5poly = 5 + 28 * tf2 + 24 * tf4 + 6 * nuf2 + 8 * tf2 * nuf2;
    const x6poly = -61 - 90 * tf2 - 45 * tf4 - 107 * nuf2 + 162 * tf2 * nuf2;
    const x7poly = -61 - 662 * tf2 - 1320 * tf4 - 720 * (tf4 * tf2);
    const x8poly = 1385 + 3633 * tf2 + 4095 * tf4 + 1575 * (tf4 * tf2);
    
    // Calcular latitud y longitud
    const lat = phif + x2frac * x2poly * (x * x) + x4frac * x4poly * x ** 4 + 
                x6frac * x6poly * x ** 6 + x8frac * x8poly * x ** 8;
    const lng = lambda0 + x1frac * x + x3frac * x3poly * x ** 3 + 
                x5frac * x5poly * x ** 5 + x7frac * x7poly * x ** 7;
    
    // Convertir de radianes a grados
    const latDegrees = (lat / Math.PI) * 180;
    const lngDegrees = (lng / Math.PI) * 180;
    
    console.log(`🗺️ UTM convertido a Lat/Lng: ${finalX}, ${finalY} -> ${latDegrees.toFixed(6)}, ${lngDegrees.toFixed(6)}`);
    
    return { lat: latDegrees, lng: lngDegrees };
  }

  return null;
}

export default function EmailGeneratorPage() {
  const { toast } = useToast();
  const [bulletinData, setBulletinData] = useState<BulletinData>({
    date: '',
    deadlineDate: '',
    projects: [],
    resolutions: []
  });
  const [bulletinId, setBulletinId] = useState('454');
  const [isLoading, setIsLoading] = useState(false);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number>(1200);

  const previewHtml = useMemo(() => generateHTML(), [bulletinData]);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const fetchBulletinData = async (id: string) => {
    setHasAttemptedLoad(true);
    if (!id) {
      toast({
        title: "Error",
        description: "Por favor ingresa un ID de boletín",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const url = `https://adn-a.org/data/boletines.json`;
      console.log('Fetching from:', url, 'looking for ID:', id);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Handle the actual API response structure
      let bulletin;
      
      if (data.boletines && Array.isArray(data.boletines)) {
        // Find the bulletin with the matching ID
        bulletin = data.boletines.find((b: any) => b.id.toString() === id);
      } else if (Array.isArray(data)) {
        bulletin = data[0];
      } else {
        bulletin = data;
      }
      
      if (!bulletin) {
        throw new Error(`No se encontró el boletín con ID ${id}`);
      }
      
      console.log('Found bulletin:', bulletin);
      
      // Transform the API data to our format
      const transformedData: BulletinData = {
        date: bulletin.fecha_publicacion || bulletin.fecha || bulletin.date || '',
        deadlineDate: '', // This might need to be calculated or comes from another field
        projects: [],
        resolutions: []
      };
      
      // Handle projects - using the actual API field names
      const projectsArray = bulletin.proyectos_ingresados || bulletin.proyectos || [];
      transformedData.projects = projectsArray.map((p: any) => {
        // Obtener coordenadas originales de la API
        const originalX = p.coordenadas_x || p.latitude || p.lat;
        const originalY = p.coordenadas_y || p.longitude || p.lng;
        
        // Conversión inteligente de coordenadas con manejo robusto de errores
        let latitude = originalX;
        let longitude = originalY;
        
        // Solo intentar conversión si tenemos coordenadas válidas
        if (originalX && originalY && !isNaN(originalX) && !isNaN(originalY)) {
          try {
            const convertedCoords = convertToLatLong(originalX, originalY);
            if (convertedCoords && convertedCoords.lat && convertedCoords.lng) {
              // Validar que las coordenadas convertidas sean razonables
              if (convertedCoords.lat >= -90 && convertedCoords.lat <= 90 && 
                  convertedCoords.lng >= -180 && convertedCoords.lng <= 180) {
                latitude = convertedCoords.lat;
                longitude = convertedCoords.lng;
                console.log(`🗺️ Coordenadas convertidas para "${p.nombre_proyecto}":`, {
                  original: { x: originalX, y: originalY },
                  converted: { lat: latitude, lng: longitude }
                });
              }
            }
          } catch (error) {
            // Si hay cualquier error, simplemente usar las coordenadas originales
            console.warn(`⚠️ Conversión omitida para "${p.nombre_proyecto}":`, error);
            // Las coordenadas ya están asignadas a originalX/originalY
          }
        }

        return {
          name: p.nombre_proyecto || p.proyecto || p.name || '',
          promoter: p.promovente || p.promoter || '',
          municipality: p.municipio || p.municipality || '',
          entryDate: p.fecha_ingreso || p.fecha || p.entryDate || '',
          expedient: p.expediente || p.numero_expediente || '',
          type: p.tipo_estudio || p.tipo || p.type || '',
          nature: p.naturaleza_proyecto || p.naturaleza || p.nature || p.descripcion || '',
          imageUrl: p.imagen || p.image || '',
          latitude: latitude,
          longitude: longitude,
          publicConsultationDeadline: p.fecha_limite_consulta || p.publicConsultationDeadline || p.deadline || ''
        };
      });
      
      // Handle resolutions - using the actual API field names
      const resolutionsArray = bulletin.resolutivos_emitidos || bulletin.resolutivos || [];
      transformedData.resolutions = resolutionsArray.map((r: any) => {
        // Obtener coordenadas originales de la API para resolutivos
        const originalX = r.coordenadas_x || r.latitude || r.lat;
        const originalY = r.coordenadas_y || r.longitude || r.lng;
        
        // Conversión inteligente de coordenadas para resolutivos
        let latitude = originalX;
        let longitude = originalY;
        
        // Solo intentar conversión si tenemos coordenadas válidas
        if (originalX && originalY && !isNaN(originalX) && !isNaN(originalY)) {
          try {
            const convertedCoords = convertToLatLong(originalX, originalY);
            if (convertedCoords && convertedCoords.lat && convertedCoords.lng) {
              // Validar que las coordenadas convertidas sean razonables
              if (convertedCoords.lat >= -90 && convertedCoords.lat <= 90 && 
                  convertedCoords.lng >= -180 && convertedCoords.lng <= 180) {
                latitude = convertedCoords.lat;
                longitude = convertedCoords.lng;
                console.log(`🗺️ Coordenadas convertidas para resolutivo "${r.nombre_proyecto}":`, {
                  original: { x: originalX, y: originalY },
                  converted: { lat: latitude, lng: longitude }
                });
              }
            }
          } catch (error) {
            // Si hay cualquier error, simplemente usar las coordenadas originales
            console.warn(`⚠️ Conversión omitida para resolutivo "${r.nombre_proyecto}":`, error);
          }
        }

        return {
          name: r.nombre_proyecto || r.proyecto || r.name || '',
          municipality: r.municipio || r.municipality || '',
          expedient: r.expediente || r.numero_expediente || '',
          resolutionType: r.tipo_resolutivo || r.resolutivo || r.resolutionType || '',
          date: r.fecha_resolutivo || r.fecha || r.date || '',
          giro: r.giro || r.sector || r.activity || '',
          tipo: r.tipo_estudio || r.tipo || r.type || r.study_type || '',
          noOficioResolutivo: r.no_oficio_resolutivo || r.noOficioResolutivo || r.no_oficio || r.oficio || '',
          latitude: latitude,
          longitude: longitude,
          nature: r.naturaleza_proyecto || r.naturaleza || r.nature || r.descripcion || ''
        };
      });
      
      console.log('Transformed data:', transformedData);
      setBulletinData(transformedData);
      toast({
        title: "Éxito",
        description: `Boletín ${id} cargado: ${transformedData.projects.length} proyectos, ${transformedData.resolutions.length} resolutivos`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast({
        title: "Error",
        description: `Error al cargar los datos: ${errorMessage}`,
        variant: "destructive"
      });
      console.error('Error fetching bulletin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = () => {
    setBulletinData({
      ...bulletinData,
      projects: [
        ...bulletinData.projects,
        {
          name: '',
          promoter: '',
          municipality: '',
          entryDate: '',
          expedient: '',
          type: '',
          nature: '',
          imageUrl: '',
          latitude: undefined,
          longitude: undefined,
          publicConsultationDeadline: ''
        }
      ]
    });
  };

  const removeProject = (index: number) => {
    setBulletinData({
      ...bulletinData,
      projects: bulletinData.projects.filter((_, i) => i !== index)
    });
  };

  const updateProject = (index: number, field: keyof Project, value: string | number | undefined) => {
    const newProjects = [...bulletinData.projects];
    const currentProject = { ...newProjects[index] };
    
    // Actualizar el campo
    (currentProject as any)[field] = value;
    
    // Si se actualizó latitud o longitud, intentar conversión automática
    if ((field === 'latitude' || field === 'longitude') && currentProject.latitude && currentProject.longitude) {
      try {
        // Verificar si las coordenadas parecen UTM (valores grandes)
        const lat = currentProject.latitude;
        const lng = currentProject.longitude;
        
        if ((lat > 100000 || lng > 100000) && (lat < 10000000 && lng < 10000000)) {
          const convertedCoords = convertToLatLong(lat, lng);
          
          if (convertedCoords && convertedCoords.lat && convertedCoords.lng) {
            // Verificar si la conversión resultó en cambio significativo (eran UTM)
            const latChanged = Math.abs(convertedCoords.lat - lat) > 0.01;
            const lngChanged = Math.abs(convertedCoords.lng - lng) > 0.01;
            
            if (latChanged || lngChanged) {
              currentProject.latitude = convertedCoords.lat;
              currentProject.longitude = convertedCoords.lng;
              
              toast({
                title: "🗺️ Coordenadas convertidas",
                description: "UTM convertidas automáticamente a Lat/Long"
              });
            }
          }
        }
      } catch (error) {
        // Si hay error, simplemente continuar sin conversión
        console.warn('⚠️ Error en conversión automática:', error);
      }
    }
    
    newProjects[index] = currentProject;
    setBulletinData({ ...bulletinData, projects: newProjects });
  };

  const addResolution = () => {
    setBulletinData({
      ...bulletinData,
      resolutions: [
        ...bulletinData.resolutions,
        {
          name: '',
          municipality: '',
          expedient: '',
          resolutionType: '',
          date: '',
          giro: '',
          tipo: '',
          noOficioResolutivo: '',
          nature: '',
          latitude: undefined,
          longitude: undefined
        }
      ]
    });
  };

  const removeResolution = (index: number) => {
    setBulletinData({
      ...bulletinData,
      resolutions: bulletinData.resolutions.filter((_, i) => i !== index)
    });
  };

  const updateResolution = (index: number, field: keyof Resolution, value: string | number | undefined) => {
    const newResolutions = [...bulletinData.resolutions];
    const currentResolution = { ...newResolutions[index] };
    
    // Actualizar el campo
    (currentResolution as any)[field] = value;
    
    // Si se actualizó latitud o longitud, intentar conversión automática
    if ((field === 'latitude' || field === 'longitude') && currentResolution.latitude && currentResolution.longitude) {
      try {
        // Verificar si las coordenadas parecen UTM (valores grandes)
        const lat = currentResolution.latitude;
        const lng = currentResolution.longitude;
        
        if ((lat > 100000 || lng > 100000) && (lat < 10000000 && lng < 10000000)) {
          const convertedCoords = convertToLatLong(lat, lng);
          
          if (convertedCoords && convertedCoords.lat && convertedCoords.lng) {
            // Verificar si la conversión resultó en cambio significativo (eran UTM)
            const latChanged = Math.abs(convertedCoords.lat - lat) > 0.01;
            const lngChanged = Math.abs(convertedCoords.lng - lng) > 0.01;
            
            if (latChanged || lngChanged) {
              currentResolution.latitude = convertedCoords.lat;
              currentResolution.longitude = convertedCoords.lng;
              
              toast({
                title: "🗺️ Coordenadas convertidas",
                description: "UTM del resolutivo convertidas automáticamente a Lat/Long"
              });
            }
          }
        }
      } catch (error) {
        // Si hay error, simplemente continuar sin conversión
        console.warn('⚠️ Error en conversión automática de resolutivo:', error);
      }
    }
    
    newResolutions[index] = currentResolution;
    setBulletinData({ ...bulletinData, resolutions: newResolutions });
  };

  // Función removida - ahora usamos botones de Google Maps en lugar de mapas estáticos
  // const generateStaticMapUrl = (lat: number, lng: number, width: number = 400, height: number = 200): string => {
  //   const baseUrl = 'https://staticmap.openstreetmap.fr/staticmap.php';
  //   const params = new URLSearchParams({
  //     center: `${lat},${lng}`,
  //     zoom: '14',
  //     size: `${width}x${height}`,
  //     markers: `${lat},${lng},red`,
  //     maptype: 'mapnik',
  //     format: 'png'
  //   });
  //   return `${baseUrl}?${params.toString()}`;
  // };

  function generateHTML() {
    const projectsHTML = bulletinData.projects.map(project => `
      <tr>
        <td style="padding: 10px 5px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border-radius: 10px; border: 1px solid #e6e6e6;">
            <tr>
              <td style="padding: 10px 5px;">
                <!-- Project Info -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 0 5px 30px 5px;">
                      <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000;">Proyecto:</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.2; color: #000000;">${project.name}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 5px 30px 5px;">
                      <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000;">Promovente:</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.2; color: #000000;">${project.promoter}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="50%" style="padding: 0 5px 10px 5px; vertical-align: top;">
                            <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000;">Municipio:</p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.2; color: #000000;">${project.municipality}</p>
                          </td>
                          <td width="50%" style="padding: 0 5px 10px 5px; vertical-align: top;">
                            <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000;">Fechas de ingreso:</p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.2; color: #000000;">${project.entryDate}</p>
                          </td>
                        </tr>
                        <tr>
                          <td width="50%" style="padding: 0 5px; vertical-align: top;">
                            <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000;">Expediente:</p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.2; color: #000000;">${project.expedient}</p>
                          </td>
                          <td width="50%" style="padding: 0 5px; vertical-align: top;">
                            <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000;">Tipo:</p>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; line-height: 1.2; color: #000000;">${project.type}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${project.imageUrl ? `
                  <tr>
                    <td style="padding: 14px 5px 0 5px;">
                      <img src="${project.imageUrl}" alt="Proyecto" style="width: 100%; max-width: 100%; height: auto; border-radius: 4px; display: block;" />
                    </td>
                  </tr>
                  ` : ''}
                  ${project.latitude && project.longitude ? `
                  <tr>
                    <td style="padding: 14px 5px 0 5px; text-align: center;">
                      <a href="https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}" target="_blank" style="display: block; width: 90%; margin: 0 auto; padding: 12px 16px; background-color: #f8f8f8; color: #000000; text-decoration: none; border-radius: 9999px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-align: center; cursor: pointer; border: 1px solid #000000;">📍 Ver Ubicación en Google Maps</a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
                
                <!-- Nature -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
                  <tr>
                    <td style="padding: 12px 20px; background: white; border: 1px solid #000000; border-radius: 10px;">
                      <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; line-height: 1.5; color: #000000;">Naturaleza del proyecto:</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #000000;">${project.nature}</p>
                    </td>
                  </tr>
                </table>
                
                ${project.publicConsultationDeadline ? `
                <!-- Public Consultation Deadline -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
                  <tr>
                    <td style="padding: 12px 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 10px;">
                      <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 1.5; color: #856404;">📅 Fecha límite para consulta pública:</p>
                      <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #856404;">${project.publicConsultationDeadline}</p>
                    </td>
                  </tr>
                </table>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    const resolutionsHTML = bulletinData.resolutions.length > 0 
      ? bulletinData.resolutions.map(resolution => `
        <tr>
          <td style="padding: 10px 5px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: white; border-radius: 10px; border: 1px solid #e6e6e6;">
              <tr>
                <td style="padding: 20px;">
                  <p style="margin: 0 0 10px 0; font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #000000;">${resolution.name}</p>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="50%" style="padding: 5px 0;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">Municipio: <strong>${resolution.municipality}</strong></p>
                      </td>
                      <td width="50%" style="padding: 5px 0;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">Expediente: <strong>${resolution.expedient}</strong></p>
                      </td>
                    </tr>
                    ${resolution.noOficioResolutivo ? `
                    <tr>
                      <td style="padding: 5px 0;" colspan="2">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">No. de Oficio Resolutivo: <strong>${resolution.noOficioResolutivo}</strong></p>
                      </td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td width="50%" style="padding: 5px 0;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">Giro: <strong>${resolution.giro}</strong></p>
                      </td>
                      <td width="50%" style="padding: 5px 0;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">Tipo: <strong>${resolution.tipo}</strong></p>
                      </td>
                    </tr>
                    <tr>
                     
                      <td width="50%" style="padding: 5px 0;">
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">Fecha: <strong>${resolution.date}</strong></p>
                      </td>
                    </tr>
                  </table>
                  
                  ${resolution.nature ? `
                  <div style="margin-top: 15px; padding: 12px 20px; background: white; border: 1px solid #000000; border-radius: 10px;">
                    <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 1.5; color: #000000;">Naturaleza del proyecto:</p>
                    <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #000000;">${resolution.nature}</p>
                  </div>
                  ` : ''}
                  
                  ${resolution.latitude && resolution.longitude ? `
                  <div style="text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <a href="https://www.google.com/maps/search/?api=1&query=${resolution.latitude},${resolution.longitude}" target="_blank" style="display: block; width: 100%; padding: 12px 16px; background-color: #f8f8f8; color: #000000; text-decoration: none; border-radius: 9999px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-align: center; cursor: pointer; border: 1px solid #000000;">📍 Ver Ubicación en Google Maps</a>
                  </div>
                  ` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('')
      : `
        <tr>
          <td style="padding: 10px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="padding: 12px; background: #f2f2f7; border-radius: 100px;">
                  <p style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: 900; color: #000000; text-align: center;">No se emitieron resolutivos</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boletín Ambiental de SSMAA</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
        <tr>
            <td align="center" style="padding: 0 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; margin: 0 auto;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ff8d28; padding: 10px 20px; text-align: center;">
                            <h1 style="margin: 0 0 10px 0; font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; color: #ffffff; line-height: 1; text-shadow: 0px 4px 4px rgba(0,0,0,0.25);">Resumen del Boletín<br>Ambiental de SSMAA</h1>
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: normal; color: #ffffff; line-height: 1;">${bulletinData.date}</p>
                        </td>
                    </tr>
                    
                    <!-- Projects Section -->
                    <tr>
                        <td style="padding: 20px 10px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-bottom: 10px;">
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #000000; text-align: center; line-height: 1.2;">Proyectos ingresados a impacto ambiental (${bulletinData.projects.length})</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif; font-size: 16px; color: #3a2b00; text-align: center; text-transform: lowercase; line-height: 1.2;">FECHA LÍMITE PARA SOLICITUD DE CONSULTA PÚBLICA</p>
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #3a2b00; text-align: center; line-height: 1.2;">${bulletinData.deadlineDate}</p>
                                    </td>
                                </tr>
                                ${projectsHTML}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Resolutions Section -->
                    <tr>
                        <td style="padding: 10px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding-bottom: 15px;">
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; color: #000000; text-align: center; line-height: 1.2;">Resolutivos emitidos (${bulletinData.resolutions.length})</p>
                                    </td>
                                </tr>
                                ${resolutionsHTML}
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA: Ver más boletines/proyectos/resolutivos -->
                    <tr>
                        <td style="padding: 10px 15px 0 15px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 10px; border: 1px solid #e6e6e6;">
                                <tr>
                                    <td style="padding: 16px 16px 8px 16px;">
                                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; color: #000000; text-align: center; line-height: 1.4;">
                                            Puedes consultar más boletines, proyectos ingresados y resolutivos en nuestro sitio.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 16px 16px 16px; text-align: center;">
                                        <a href="https://adn-a.org/boletines-ssmaa/" target="_blank" style="display: block; width: 100%; max-width: 520px; margin: 0 auto; padding: 12px 16px; background-color: #ff8d28; color: white; text-decoration: none; border-radius: 9999px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-align: center; cursor: pointer; border: 1px solid #000000;">
                                            Ver más en adn-a.org
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                   
                    <tr>
                        <td style="padding: 20px 15px;">
                            <p style="margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.2; color: #000000; text-align: left;">
                                La información presentada es obtenida de <span style="text-decoration: underline;">https://www.aguascalientes.gob.mx/SSMAA/BoletinesSMA/usuario_webexplorer.asp</span><br><br>
                                La precisión de las ubicaciones y la calidad de la información son responsabilidad de la Secretaría de Sustentabilidad, Medio Ambiente y Agua.<br><br>
                                ADN-A se limita a compartir información pública de interés para la sociedad.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Bottom Bar -->
                    <tr>
                        <td style="background-color: #6155f5; height: 10px;"></td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  }

  const sendToWebhook = async (html: string) => {
    const webhookUrl = 'https://hook.eu1.make.com/8tr7utbpyhsj2he46v8uvsr7pm6tmwjn';
    const payload = {
      html: html,
      bulletin_id: bulletinId,
      date: bulletinData.date,
      projects_count: bulletinData.projects.length,
      resolutions_count: bulletinData.resolutions.length,
      timestamp: new Date().toISOString()
    };

    console.log('🔄 Enviando al webhook:', webhookUrl);
    console.log('📦 Payload:', { ...payload, html: html.substring(0, 100) + '...' });

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Respuesta del webhook:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        
        if (response.status === 410) {
          throw new Error(`Escenario no activo en Make.com: ${errorText}`);
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const responseData = await response.text();
      console.log('✅ Webhook enviado exitosamente:', responseData);
      return true;
    } catch (error) {
      console.error('❌ Error completo enviando webhook:', {
        message: error instanceof Error ? error.message : 'Error desconocido',
        error: error
      });
      throw error;
    }
  };

  const copyHTML = async () => {
    const html = generateHTML();
    
    try {
      // Copiar al portapapeles
      await navigator.clipboard.writeText(html);
      console.log('✅ HTML copiado al portapapeles exitosamente');

      // Enviar al webhook
      await sendToWebhook(html);

      toast({
        title: "✅ Éxito completo",
        description: "HTML copiado al portapapeles y enviado al webhook"
      });
    } catch (error) {
      console.error('❌ Error en copyHTML:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Si falla el webhook, aún así copiar al portapapeles
      try {
        await navigator.clipboard.writeText(html);
        console.log('⚠️ HTML copiado pero webhook falló');
        
        if (errorMessage.includes('Escenario no activo')) {
          toast({
            title: "⚠️ Escenario inactivo",
            description: "HTML copiado. Ve a Make.com y ACTIVA tu escenario para recibir webhooks",
            variant: "destructive"
          });
        } else if (errorMessage.includes('CORS') || errorMessage.includes('Cross-Origin')) {
          toast({
            title: "⚠️ Problema de CORS",
            description: "HTML copiado, pero el navegador bloquea el webhook. Usa 'Probar Webhook' para diagnóstico",
            variant: "destructive"
          });
        } else {
          toast({
            title: "⚠️ Parcialmente exitoso",
            description: `HTML copiado, pero webhook falló: ${errorMessage}. Revisa consola (F12)`,
            variant: "destructive"
          });
        }
      } catch (clipboardError) {
        console.error('❌ Error también en portapapeles:', clipboardError);
        toast({
          title: "❌ Error completo",
          description: `No se pudo copiar ni enviar: ${errorMessage}`,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" style={{ fontFamily: 'var(--font-sans), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-[32px]">Generador de Boletín Ambiental</h1>
          <p className="text-gray-600">Crea plantillas HTML para correo electrónico del boletín de SSMAA</p>
  
        </div>

        <div className="">
          {/* Editor Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Cargar Boletín</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="bulletinId">ID del Boletín</Label>
                    <Input
                      id="bulletinId"
                      value={bulletinId}
                      onChange={(e) => setBulletinId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          fetchBulletinData(bulletinId);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button 
                      onClick={() => fetchBulletinData(bulletinId)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      <span className="ml-2">Cargar</span>
                    </Button>
                    
                    <Button 
                      onClick={async () => {
                        try {
                          console.log('🔍 Iniciando diagnóstico...');
                          
                          // Probar API directamente
                          const response = await fetch('https://adn-a.org/data/boletines.json');
                          console.log('📡 Respuesta de API:', response.status, response.statusText);
                          
                          if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                          }
                          
                          const data = await response.json();
                          console.log('📊 Datos recibidos:', {
                            boletines: data.boletines?.length || 0,
                            primerBoletin: data.boletines?.[0]?.id || 'N/A'
                          });
                          
                          // Buscar boletín específico
                          const bulletin = data.boletines?.find((b: any) => b.id.toString() === bulletinId);
                          console.log('🎯 Boletín encontrado:', bulletin ? `ID ${bulletin.id}` : 'NO ENCONTRADO');
                          
                          if (bulletin) {
                            console.log('📋 Estructura del boletín:', {
                              proyectos: bulletin.proyectos_ingresados?.length || 0,
                              resolutivos: bulletin.resolutivos_emitidos?.length || 0,
                              fecha: bulletin.fecha_publicacion,
                              primer_proyecto: bulletin.proyectos_ingresados?.[0]?.nombre_proyecto || 'N/A'
                            });
                          }
                          
                          toast({
                            title: "✅ Diagnóstico completado",
                            description: "Revisa la consola (F12) para detalles completos"
                          });
                          
                        } catch (error) {
                          console.error('❌ Error en diagnóstico:', error);
                          toast({
                            title: "❌ Error en diagnóstico",
                            description: error instanceof Error ? error.message : 'Error desconocido',
                            variant: "destructive"
                          });
                        }
                      }}
                      variant="outline" 
                      size="sm"
                      disabled={isLoading}
                    >
                      🔍
                    </Button>
                  </div>
                </div>
                {!isLoading && !hasAttemptedLoad && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    Ingresa un ID y presiona "Cargar" para obtener los datos del boletín
                  </div>
                )}
                {!isLoading && hasAttemptedLoad && bulletinData.projects.length === 0 && bulletinData.resolutions.length === 0 && (
                  <div className="text-sm text-amber-600 text-center py-2">
                    ⚠ No se encontraron datos. Verifica el ID del boletín o revisa la consola del navegador (F12) para más detalles.
                  </div>
                )}
                {!isLoading && (bulletinData.projects.length > 0 || bulletinData.resolutions.length > 0) && (
                  <div className="text-sm text-green-600 text-center py-2">
                    ✓ Boletín cargado: {bulletinData.projects.length} proyectos, {bulletinData.resolutions.length} resolutivos
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos del Boletín</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Fecha del Boletín</Label>
                    <Input
                      id="date"
                      value={bulletinData.date}
                      onChange={(e) => setBulletinData({ ...bulletinData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Fecha límite de consulta pública</Label>
                    <Input
                      id="deadline"
                      value={bulletinData.deadlineDate}
                      onChange={(e) => setBulletinData({ ...bulletinData, deadlineDate: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
            <div className="space-y-3 my-4">
              
              <Button 
                onClick={async () => {
                  const html = generateHTML();
                  try {
                    await sendToWebhook(html);
                    toast({
                      title: "Enviado exitosamente",
                      description: "HTML enviado al webhook de Make.com"
                    });
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                    console.error('Error detallado:', error);
                    
                    if (errorMessage.includes('Escenario no activo')) {
                      toast({
                        title: "⚠️ Escenario inactivo",
                        description: "Ve a Make.com y ACTIVA tu escenario para recibir webhooks",
                        variant: "destructive"
                      });
                    } else {
                      toast({
                        title: "Error al enviar webhook",
                        description: `${errorMessage}. Revisa la consola (F12) para más detalles.`,
                        variant: "destructive"
                      });
                    }
                  }
                }}
                variant="default" 
                className="w-full" 
                size="lg"
              >
                Enviar correo
              </Button>
              
            </div>

          {/* Preview Panel */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <iframe
                    ref={previewIframeRef}
                    srcDoc={previewHtml}
                    sandbox="allow-same-origin allow-popups allow-forms"
                    style={{ width: '100%', border: 0, height: previewHeight }}
                    onLoad={() => {
                      try {
                        const iframe = previewIframeRef.current;
                        if (!iframe) return;
                        const doc = iframe.contentDocument || iframe.contentWindow?.document;
                        if (!doc) return;
                        const body = doc.body;
                        if (!body) return;
                        const newHeight = Math.max(body.scrollHeight, 600);
                        if (newHeight !== previewHeight) setPreviewHeight(newHeight);
                      } catch {}
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
