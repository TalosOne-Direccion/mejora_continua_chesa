import { ModoTask } from './types';

export const modoTasksTemplate: Omit<ModoTask, 'id' | 'estado' | 'responsableAsignado'>[] = [
  // 1. Inicio Ágil
  {
    fase: '1. Inicio Ágil',
    codigo: '1.1',
    actividad: 'Identificar necesidad o dolor operativo',
    descripcion: 'Recopilar evidencias iniciales, casos reales, quejas, retrasos, errores o retrabajos que justifican el proyecto.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Problemática inicial documentada',
    periodoDefault: 'S1'
  },
  {
    fase: '1. Inicio Ágil',
    codigo: '1.2',
    actividad: 'Definir problema y objetivo medible',
    descripcion: 'Redactar problema con impacto, indicador, línea base tentativa y meta inicial.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Problema y objetivo preliminar',
    periodoDefault: 'S1'
  },
  {
    fase: '1. Inicio Ágil',
    codigo: '1.3',
    actividad: 'Delimitar alcance y fuera de alcance',
    descripcion: 'Definir proceso, área, roles, ubicaciones y exclusiones de la primera fase.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Alcance validado',
    periodoDefault: 'S1'
  },
  {
    fase: '1. Inicio Ágil',
    codigo: '1.4',
    actividad: 'Identificar equipo y reglas de trabajo',
    descripcion: 'Nombrar sponsor, líder, dueño del proceso, usuarios clave y cadencia de seguimiento.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Equipo y gobernanza definidos',
    periodoDefault: 'S1'
  },
  {
    fase: '1. Inicio Ágil',
    codigo: '1.5',
    actividad: 'Formalizar Acta Lean del Proyecto',
    descripcion: 'Consolidar problema, objetivo, alcance, meta, riesgos, roles y criterios de cierre.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Acta Lean aprobada',
    periodoDefault: 'S1'
  },

  // 2. Planeación Ágil
  {
    fase: '2. Planeación Ágil',
    codigo: '2.1',
    actividad: 'Crear backlog inicial del proyecto',
    descripcion: 'Desglosar diagnóstico, diseño, piloto, implementación, documentación y control en actividades ejecutables.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Backlog inicial',
    periodoDefault: 'S1'
  },
  {
    fase: '2. Planeación Ágil',
    codigo: '2.2',
    actividad: 'Priorizar backlog',
    descripcion: 'Priorizar por impacto, urgencia, dependencia, riesgo y esfuerzo.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Backlog priorizado',
    periodoDefault: 'S1'
  },
  {
    fase: '2. Planeación Ágil',
    codigo: '2.3',
    actividad: 'Construir hoja de ruta',
    descripcion: 'Organizar actividades por etapas, semanas, responsables, fechas compromiso y entregables.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Hoja de ruta estándar',
    periodoDefault: 'S1'
  },
  {
    fase: '2. Planeación Ágil',
    codigo: '2.4',
    actividad: 'Configurar tablero de seguimiento',
    descripcion: 'Crear tablero Kanban: Por hacer, En proceso, En revisión, Terminado y Bloqueado.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Tablero activo',
    periodoDefault: 'S1'
  },
  {
    fase: '2. Planeación Ágil',
    codigo: '2.5',
    actividad: 'Registrar riesgos iniciales',
    descripcion: 'Identificar riesgos de disponibilidad, resistencia, datos, sistemas, dependencia y decisiones.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Matriz de riesgos inicial',
    periodoDefault: 'S1'
  },

  // 3. Análisis Rápido
  {
    fase: '3. Análisis Rápido',
    codigo: '3.1',
    actividad: 'Levantar información documental',
    descripcion: 'Revisar procedimientos, formatos, reportes, indicadores, sistemas y reglas actuales.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Inventario documental',
    periodoDefault: 'S2'
  },
  {
    fase: '3. Análisis Rápido',
    codigo: '3.2',
    actividad: 'Realizar entrevistas y observación',
    descripcion: 'Entrevistar usuarios clave y observar la operación real para entender variaciones y excepciones.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Hallazgos de campo',
    periodoDefault: 'S2'
  },
  {
    fase: '3. Análisis Rápido',
    codigo: '3.3',
    actividad: 'Mapear proceso AS-IS',
    descripcion: 'Documentar flujo actual, entradas, salidas, responsables, tiempos, sistemas y puntos de control.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Mapa AS-IS',
    periodoDefault: 'S2-S3'
  },
  {
    fase: '3. Análisis Rápido',
    codigo: '3.4',
    actividad: 'Definir línea base de KPIs',
    descripcion: 'Medir situación actual: tiempos, errores, cumplimiento, retrabajo, productividad o calidad.',
    responsableDefault: 'Analista de datos',
    entregable: 'Línea base',
    periodoDefault: 'S3'
  },
  {
    fase: '3. Análisis Rápido',
    codigo: '3.5',
    actividad: 'Identificar causas raíz y brechas',
    descripcion: 'Usar 5 Porqués, Pareto, Ishikawa o evidencia para priorizar problemas críticos.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Brechas y causas raíz priorizadas',
    periodoDefault: 'S3'
  },
  {
    fase: '3. Análisis Rápido',
    codigo: '3.6',
    actividad: 'Validar diagnóstico',
    descripcion: 'Presentar AS-IS, línea base y causas raíz al área para confirmar que reflejan la operación real.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Diagnóstico validado',
    periodoDefault: 'S3'
  },

  // 4. Diseño
  {
    fase: '4. Diseño',
    codigo: '4.1',
    actividad: 'Diseñar proceso TO-BE',
    descripcion: 'Rediseñar flujo futuro eliminando desperdicios, duplicidades, retrabajos y esperas innecesarias.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Mapa TO-BE',
    periodoDefault: 'S4'
  },
  {
    fase: '4. Diseño',
    codigo: '4.2',
    actividad: 'Definir roles y responsabilidades',
    descripcion: 'Crear matriz RACI y responsabilidades operativas por rol.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Matriz RACI',
    periodoDefault: 'S4'
  },
  {
    fase: '4. Diseño',
    codigo: '4.3',
    actividad: 'Diseñar estándares y documentos operativos',
    descripcion: 'Definir manual operativo ligero, IDO, formatos, checklists y reglas de operación.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Paquete documental MVP',
    periodoDefault: 'S4-S5'
  },
  {
    fase: '4. Diseño',
    codigo: '4.4',
    actividad: 'Definir controles y KPIs del nuevo modelo',
    descripcion: 'Establecer indicadores, metas, frecuencia, responsable y evidencia de control.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Tablero de KPIs y matriz de control',
    periodoDefault: 'S5'
  },
  {
    fase: '4. Diseño',
    codigo: '4.5',
    actividad: 'Validar diseño con usuarios clave',
    descripcion: 'Revisar viabilidad operativa, carga de trabajo, excepciones y puntos de riesgo antes del piloto.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'TO-BE validado',
    periodoDefault: 'S5'
  },

  // 5. Ejecución Piloto
  {
    fase: '5. Ejecución Piloto',
    codigo: '5.1',
    actividad: 'Definir alcance del piloto',
    descripcion: 'Seleccionar área, equipo, muestra, periodo, indicadores y criterios de éxito.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Plan de piloto',
    periodoDefault: 'S6'
  },
  {
    fase: '5. Ejecución Piloto',
    codigo: '5.2',
    actividad: 'Capacitar equipo piloto',
    descripcion: 'Explicar flujo, roles, reglas, formatos, controles y canal de dudas.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Equipo piloto capacitado',
    periodoDefault: 'S6'
  },
  {
    fase: '5. Ejecución Piloto',
    codigo: '5.3',
    actividad: 'Ejecutar piloto y acompañar operación',
    descripcion: 'Operar el nuevo MODO, resolver bloqueos y registrar incidencias en tablero.',
    responsableDefault: 'Equipo piloto',
    entregable: 'MODO piloto ejecutado',
    periodoDefault: 'S6-S7'
  },
  {
    fase: '5. Ejecución Piloto',
    codigo: '5.4',
    actividad: 'Medir resultados del piloto',
    descripcion: 'Comparar KPIs del piloto contra línea base y documentar adopción, desviaciones y beneficios.',
    responsableDefault: 'Analista de datos',
    entregable: 'Resultados del piloto',
    periodoDefault: 'S7'
  },
  {
    fase: '5. Ejecución Piloto',
    codigo: '5.5',
    actividad: 'Ajustar modelo operativo',
    descripcion: 'Actualizar TO-BE, roles, documentos, controles y tablero según evidencia del piloto.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'MODO ajustado',
    periodoDefault: 'S7'
  },

  // 6. Implementación Formal
  {
    fase: '6. Implementación Formal',
    codigo: '6.1',
    actividad: 'Preparar plan de despliegue',
    descripcion: 'Definir olas de implementación, responsables, fechas, capacitación, comunicación y soporte.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Plan de implementación',
    periodoDefault: 'S8'
  },
  {
    fase: '6. Implementación Formal',
    codigo: '6.2',
    actividad: 'Liberar documentación oficial',
    descripcion: 'Publicar versión aprobada del manual, IDO, formatos, matriz RACI, controles y KPIs.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Documentación liberada',
    periodoDefault: 'S8'
  },
  {
    fase: '6. Implementación Formal',
    codigo: '6.3',
    actividad: 'Capacitar alcance completo',
    descripcion: 'Capacitar de forma práctica a todos los involucrados y confirmar entendimiento.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Personal capacitado',
    periodoDefault: 'S8-S9'
  },
  {
    fase: '6. Implementación Formal',
    codigo: '6.4',
    actividad: 'Implementar nuevo estándar',
    descripcion: 'Operar el MODO en el alcance completo y controlar incidencias de arranque.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'MODO implementado',
    periodoDefault: 'S9'
  },
  {
    fase: '6. Implementación Formal',
    codigo: '6.5',
    actividad: 'Activar tablero de control',
    descripcion: 'Monitorear KPIs, cumplimiento, desviaciones, bloqueos y acciones correctivas.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Tablero activo',
    periodoDefault: 'S9'
  },

  // 7. Cierre y Control
  {
    fase: '7. Cierre y Control',
    codigo: '7.1',
    actividad: 'Medir resultados finales',
    descripcion: 'Comparar línea base vs resultados posteriores e identificar beneficios alcanzados.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Resultados finales',
    periodoDefault: 'S10'
  },
  {
    fase: '7. Cierre y Control',
    codigo: '7.2',
    actividad: 'Formalizar plan de control',
    descripcion: 'Definir auditorías, responsables, frecuencia, evidencias, tablero y escalación.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Plan de control',
    periodoDefault: 'S10'
  },
  {
    fase: '7. Cierre y Control',
    codigo: '7.3',
    actividad: 'Realizar retrospectiva',
    descripcion: 'Documentar qué funcionó, qué no funcionó, aprendizajes y recomendaciones.',
    responsableDefault: 'Líder de Mejora Continua',
    entregable: 'Lecciones aprendidas',
    periodoDefault: 'S10'
  },
  {
    fase: '7. Cierre y Control',
    codigo: '7.4',
    actividad: 'Crear backlog de mejora continua',
    descripcion: 'Registrar oportunidades futuras, priorizarlas y asignar responsable de seguimiento.',
    responsableDefault: 'Dueño del proceso',
    entregable: 'Backlog de mejora continua',
    periodoDefault: 'S10'
  },
  {
    fase: '7. Cierre y Control',
    codigo: '7.5',
    actividad: 'Cerrar proyecto formalmente',
    descripcion: 'Presentar reporte final y obtener validación de patrocinador y dueño del proceso.',
    responsableDefault: 'Patrocinador',
    entregable: 'Cierre aprobado',
    periodoDefault: 'S10'
  }
];
