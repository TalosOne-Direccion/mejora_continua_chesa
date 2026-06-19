import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json());

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

// Phase 1 MODO
app.post('/api/phase1', async (req, res) => {
  try {
    const { inputs } = req.body;
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
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al generar contenido con IA.' });
  }
});

// Phase 3 MODO
app.post('/api/phase3', async (req, res) => {
  try {
    const { inputs } = req.body;
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
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al generar diagrama AS-IS.' });
  }
});

// Phase 4 MODO
app.post('/api/phase4', async (req, res) => {
  try {
    const { inputs } = req.body;
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
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al generar diagrama TO-BE.' });
  }
});

// Generic Taller Endpoint
app.post('/api/taller', async (req, res) => {
  try {
    const { phase, inputs } = req.body;
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
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error al procesar las notas del taller.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MODO Ágil API running on port ${PORT}`);
});
