import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

function cleanupMermaid(code: string): string {
  if (!code) return '';
  return code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
}

const inventorySchema = {
  type: Type.OBJECT,
  properties: {
    perfiles: { type: Type.ARRAY, items: { type: Type.STRING } },
    procesos: { type: Type.ARRAY, items: { type: Type.STRING } },
    formatos: { type: Type.ARRAY, items: { type: Type.STRING } },
    ido: { type: Type.ARRAY, items: { type: Type.STRING } },
    tecnicos: { type: Type.ARRAY, items: { type: Type.STRING } },
    auditoria: { type: Type.ARRAY, items: { type: Type.STRING } },
    indicadores: { type: Type.ARRAY, items: { type: Type.STRING } }
  }
};

export const generatePhaseData = async (phase: number, inputs: any, context: any) => {
  try {
    if (phase === 1) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Genera el Acta Lean del Proyecto a partir de estos parámetros:
          Notas de Entrevista al Patrocinador: ${inputs.entrevistaPatrocinador}
          Dolor: ${inputs.dolorOperativo}
          Objetivo: ${inputs.objetivoGeneral}
          Alcance: ${inputs.alcance}
          Fuera de alcance: ${inputs.fueraDeAlcance}
          Equipo: Patrocinador (${inputs.patrocinador}), Dueño (${inputs.duenoProceso}), Líder (${inputs.lider}), Usuarios Clave (${inputs.usuariosClave})
          No inventes nombres de personas, usa estrictamente los proporcionados.`,
        config: {
          temperature: 0.2,
          systemInstruction: 'Eres MODO Hub, orquestador metodológico de Grupo Chesa. Responde en español claro y corporativo.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nombreProyecto: { type: Type.STRING },
              problema: { type: Type.STRING },
              objetivoMedible: {
                type: Type.OBJECT,
                properties: { indicador: { type: Type.STRING }, meta: { type: Type.STRING }, plazo: { type: Type.STRING } }
              },
              alcance: { type: Type.STRING },
              fueraDeAlcance: { type: Type.STRING },
              beneficioEsperado: { type: Type.STRING },
              equipo: {
                type: Type.OBJECT,
                properties: {
                  patrocinador: { type: Type.STRING },
                  duenoProceso: { type: Type.STRING },
                  lider: { type: Type.STRING },
                  usuariosClave: { type: Type.STRING }
                }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text.trim());
      data.checklistOut = [
        'El problema está definido con claridad',
        'El alcance está validado por patrocinador y dueño del proceso',
        'Existe responsable del proyecto y dueño operativo',
        'El equipo entiende por qué se implementará el MODO'
      ];
      return data;
    } else if (phase === 3) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analiza estas notas y genera un diagrama AS-IS en Mermaid.js (flowchart TD), extrae dolores operativos y genera un inventario actual segmentado:
          Notas: ${inputs.notas}`,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mermaidASIS: { type: Type.STRING },
              doloresOperativos: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { problema: { type: Type.STRING }, impacto: { type: Type.STRING } } }
              },
              inventarioActual: inventorySchema
            }
          }
        }
      });
      const data = JSON.parse(response.text.trim());
      data.mermaidASIS = cleanupMermaid(data.mermaidASIS);
      data.checklistOut = [
        'El equipo entiende cómo opera el proceso actual',
        'Existen datos o evidencia de los problemas principales',
        'Las causas raíz fueron validadas con usuarios clave',
        'Las oportunidades de mejora están priorizadas'
      ];
      return data;
    } else if (phase === 4) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Diseña el proceso TO-BE optimizado basado en el AS-IS y genera el código Mermaid.js (flowchart TD), matriz RACI y el inventario propuesto segmentado:
          AS-IS: ${inputs.asis}`,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mermaidTOBE: { type: Type.STRING },
              matrizRACI: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    actividad: { type: Type.STRING },
                    sponsor: { type: Type.STRING },
                    dueñoProceso: { type: Type.STRING },
                    operación: { type: Type.STRING }
                  }
                }
              },
              inventarioPropuesto: inventorySchema
            }
          }
        }
      });
      const data = JSON.parse(response.text.trim());
      data.mermaidTOBE = cleanupMermaid(data.mermaidTOBE);
      data.checklistOut = [
        'El proceso futuro está documentado y validado',
        'Cada rol sabe qué debe hacer',
        'Los controles mínimos están definidos',
        'Los indicadores del nuevo modelo están claros',
        'El modelo está listo para piloto'
      ];
      return data;
    } else {
      return getMockDataForPhase(phase, inputs);
    }
  } catch (error) {
    console.warn(`AI call failed for Phase ${phase}, using mock data. Error:`, error);
    return getMockDataForPhase(phase, inputs);
  }
};

export const generateTallerData = async (phase: number, inputs: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Estructura las siguientes notas de la sesión del Taller de Herramientas (Fase ${phase}) en entregables claros y accionables.
        Notas: ${inputs.notas}`,
      config: {
        temperature: 0.2,
        systemInstruction: 'Eres un analista de procesos experto. Extrae la información clave y estructúrala en entregables.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumenEjecutivo: { type: Type.STRING },
            entregablesGenerados: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING, description: 'Nombre del entregable (ej. SIPOC, Matriz RACI)' },
                  contenido: { type: Type.STRING, description: 'Contenido estructurado en Markdown' }
                }
              }
            }
          }
        }
      }
    });
    const data = JSON.parse(response.text.trim());
    return data;
  } catch (error) {
    console.warn(`AI call failed for Taller Phase ${phase}, using mock data.`);
    return {
      resumenEjecutivo: "Resumen generado automáticamente a partir de las notas de la sesión.",
      entregablesGenerados: [
        { nombre: "Documento de Trabajo", contenido: "### Puntos Clave\n- " + (inputs.notas || "Sin notas").substring(0, 50) + "..." }
      ]
    };
  }
};

function getMockDataForPhase(phase: number, inputs: any) {
  return new Promise(resolve => {
    setTimeout(() => {
      switch (phase) {
        case 1:
          resolve({
            nombreProyecto: inputs.objetivoGeneral || 'Optimización de Proceso',
            problema: inputs.dolorOperativo || 'Retrasos en la operación actual.',
            objetivoMedible: { indicador: 'Tiempo de ciclo', meta: 'Reducir 20%', plazo: '3 meses' },
            alcance: inputs.alcance || 'Proceso principal',
            fueraDeAlcance: inputs.fueraDeAlcance || 'Sistemas externos',
            beneficioEsperado: 'Mejora en satisfacción del cliente y reducción de costos.',
            equipo: {
              patrocinador: inputs.patrocinador || 'No definido',
              duenoProceso: inputs.duenoProceso || 'No definido',
              lider: inputs.lider || 'No definido',
              usuariosClave: inputs.usuariosClave || 'No definido'
            },
            checklistOut: [
              'El problema está definido con claridad',
              'El alcance está validado por patrocinador y dueño del proceso',
              'Existe responsable del proyecto y dueño operativo',
              'El equipo entiende por qué se implementará el MODO'
            ]
          });
          break;
        case 2:
          resolve({
            backlog: [
              { actividad: 'Mapeo detallado', responsable: 'Analista', prioridad: 'Alta', estado: 'Por hacer' },
              { actividad: 'Entrevistas a técnicos', responsable: 'Líder', prioridad: 'Media', estado: 'Por hacer' }
            ],
            hojaRuta: [{ fase: 'Diagnóstico', entregable: 'AS-IS', ciclo: 'Semana 1-2' }],
            checklistOut: [
              'Existe una lista clara de actividades priorizadas',
              'Cada actividad crítica tiene responsable',
              'Se definió una cadencia de seguimiento',
              'El patrocinador y el dueño del proceso validaron la hoja de ruta'
            ]
          });
          break;
        case 3:
          resolve({
            mermaidASIS: `flowchart TD\n  A[Inicio] --> B(Paso 1)\n  B --> C{Decisión}\n  C -->|Sí| D[Fin]\n  C -->|No| B`,
            doloresOperativos: [{ problema: 'Cuello de botella en B', impacto: 'Alto' }],
            causasRaiz: [{ problema: 'Falta de personal', categoriaIshikawa: 'Mano de obra' }],
            inventarioActual: {
              perfiles: ['Asesor de Servicio', 'Técnico Diagnóstico'],
              procesos: ['Recepción de Vehículo'],
              formatos: ['Checklist de Recepción', 'Orden de Reparación'],
              ido: [],
              tecnicos: ['Manual de Garantías OEM'],
              auditoria: [],
              indicadores: ['Tiempo de Recepción']
            },
            checklistOut: [
              'El equipo entiende cómo opera el proceso actual',
              'Existen datos o evidencia de los problemas principales',
              'Las causas raíz fueron validadas con usuarios clave',
              'Las oportunidades de mejora están priorizadas'
            ]
          });
          break;
        case 4:
          resolve({
            mermaidTOBE: `flowchart TD\n  A[Inicio] --> B(Paso 1 Automatizado)\n  B --> D[Fin]`,
            matrizRACI: [{ actividad: 'Aprobar paso 1', dueñoProceso: 'A', operación: 'R' }],
            inventarioPropuesto: {
              perfiles: ['Asesor de Servicio (Actualizado)', 'Controlador de Calidad'],
              procesos: ['Recepción Express (Nuevo)'],
              formatos: ['Checklist Digital (Tablet)'],
              ido: ['IDO - Toma de Evidencia Fotográfica'],
              tecnicos: ['Guía de Uso App Recepción'],
              auditoria: ['Matriz de Calidad en Recepción'],
              indicadores: ['Tiempo de Recepción', 'Tasa de Adopción Digital']
            },
            checklistOut: [
              'El proceso futuro está documentado y validado',
              'Cada rol sabe qué debe hacer',
              'Los controles mínimos están definidos',
              'Los indicadores del nuevo modelo están claros',
              'El modelo está listo para piloto'
            ]
          });
          break;
        case 5:
          resolve({
            resultadosPiloto: [{ hallazgo: 'El sistema es más rápido', impacto: 'Positivo' }],
            ajustes: [{ elemento: 'Formato X', cambioRequerido: 'Añadir campo de firma' }],
            checklistOut: [
              'El piloto fue ejecutado en el alcance definido',
              'Se midieron resultados contra la línea base',
              'Se identificaron ajustes concretos',
              'El equipo validó qué sí funciona y qué debe cambiar',
              'Existe una versión corregida lista para implementar'
            ]
          });
          break;
        case 6:
          resolve({
            planImplementacion: [{ ola: 'Sucursal Tuxtla', accion: 'Capacitación', responsable: 'Líder' }],
            checklistOut: [
              'El nuevo modelo opera en el alcance definido',
              'El personal conoce el flujo, roles y controles',
              'El tablero de indicadores está activo',
              'El dueño del proceso asumió el seguimiento',
              'Las principales incidencias de arranque fueron atendidas'
            ]
          });
          break;
        case 7:
          resolve({
            leccionesAprendidas: ['Involucrar a TI desde el día 1'],
            tableroControl: [{ kpi: 'Tiempo de ciclo', meta: '< 2 hrs', responsable: 'Dueño' }],
            checklistOut: [
              'Se compararon resultados contra línea base',
              'El patrocinador y el dueño del proceso validaron el cierre',
              'Los controles quedaron activos',
              'Existe responsable de seguimiento',
              'Las mejoras futuras quedaron priorizadas'
            ]
          });
          break;
        default:
          resolve({ checklistOut: [] });
      }
    }, 1500);
  });
}