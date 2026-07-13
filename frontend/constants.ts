import { Modo, ProjectType, Solicitud, User, GlossaryTerm } from './types';

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: 'MODO', definition: 'Modelo de Operación Digital. No es solo un framework, es la columna vertebral que alinea la visión de negocio con la entrega.' },
  { term: 'AS-IS', definition: 'La radiografía del presente. Captura la realidad cruda de un proceso antes de cualquier intervención.' },
  { term: 'TO-BE', definition: 'El horizonte deseado. El diseño del proceso optimizado que resuelve ineficiencias, enfocado en simplicidad y automatización.' },
  { term: 'MVP', definition: 'Producto Mínimo Viable. La versión más pequeña de una idea que genera valor real temprano.' },
  { term: 'SIPOC', definition: 'Supplier, Input, Process, Output, Customer. Herramienta para mapear a alto nivel los elementos de un proceso.' },
  { term: 'KPI', definition: 'Key Performance Indicator. Métrica clave que indica el desempeño y salud de un proceso o proyecto.' },
  { term: 'DMAIC', definition: 'Define, Measure, Analyze, Improve, Control. Ciclo de mejora basado en datos usado para optimizar y estabilizar procesos.' },
  { term: 'RACI', definition: 'Responsible, Accountable, Consulted, Informed. Matriz utilizada para asignar y clarificar roles y responsabilidades.' }
];

export const AREAS = [
  'Planeación Anual',
  'BDC (Atracción y Gestión de Leads)',
  'Venta (En Piso)',
  'Postventa',
  'Calidad',
  'Administración',
  'TI',
  'Contabilidad',
  'Mejora Continua',
  'Auditoría'
];

export const INITIAL_MACROPROCESOS: import('./types').Macroproceso[] = [
  { id: 'm1', name: 'Planeación Anual', type: 'Principal', order: 1 },
  { id: 'm2', name: 'BDC (Atracción y Gestión de Leads)', type: 'Principal', order: 2 },
  { id: 'm3', name: 'Venta (En Piso)', type: 'Principal', order: 3 },
  { id: 'm4', name: 'Postventa', type: 'Principal', order: 4 },
  { id: 'm5', name: 'Calidad', type: 'Principal', order: 5 },
  { id: 'm6', name: 'Administración', type: 'Soporte' },
  { id: 'm7', name: 'TI', type: 'Soporte' },
  { id: 'm8', name: 'Contabilidad', type: 'Soporte' },
  { id: 'm9', name: 'Mejora Continua', type: 'Soporte' },
  { id: 'm10', name: 'Auditoría', type: 'Soporte' }
];

export const INITIAL_PROCESOS: import('./types').Proceso[] = [
  { id: 'p1', macroprocesoId: 'm1', name: 'Análisis del Entorno y del Negocio' },
  { id: 'p2', macroprocesoId: 'm1', name: 'Definición de Objetivos Anuales' },
  { id: 'p_bdc_mkt', macroprocesoId: 'm2', name: 'Marketing Digital' },
  { id: 'p_bdc_ventas', macroprocesoId: 'm2', name: 'Ventas Digital' },
  { id: 'p_bdc_posventa', macroprocesoId: 'm2', name: 'Postventa Digital' },
  { id: 'p_bdc_calidad', macroprocesoId: 'm2', name: 'Calidad Digital' },
  { id: 'p5', macroprocesoId: 'm3', name: 'Recepción y Bienvenida del Cliente' },
  { id: 'p6', macroprocesoId: 'm3', name: 'Cotización y Negociación' },
  { id: 'p7', macroprocesoId: 'm4', name: 'Programación de Citas / Servicios' },
  { id: 'p8', macroprocesoId: 'm4', name: 'Servicios de Mantenimiento y Reparación' },
  { id: 'p9', macroprocesoId: 'm5', name: 'Encuestas de Satisfacción (NPS)' },
  { id: 'p10', macroprocesoId: 'm5', name: 'Gestión de Quejas y Soluciones' }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Carlos Barrientos', puesto: 'Gerente de Mejora Continua', systemRole: 'Admin', areas: ['Todas'], sucursales: ['Todas'], telefono: '4421234567' },
  { id: 'u2', name: 'Ivonne', puesto: 'Líder de Mejora Continua', systemRole: 'Admin', areas: ['Todas'], sucursales: ['Todas'], reportsTo: 'u1', telefono: '4427654321' },
  { id: 'u3', name: 'Armando', puesto: 'Líder de Mejora Continua', systemRole: 'Admin', areas: ['Todas'], sucursales: ['Todas'], reportsTo: 'u1', telefono: '4429876543' },
  { id: 'u4', name: 'Líder de Área', puesto: 'Líder de Área (Solo Lectura)', systemRole: 'Lector', areas: ['Todas'], sucursales: ['Todas'], reportsTo: 'u2', telefono: '4421112233' }
];

export const PROJECT_PHASES: Record<ProjectType, string[]> = {
  'MODO': [
    'Inicio Ágil', 'Planeación Ágil', 'Análisis Rápido', 
    'Diseño MODO MVP', 'Ejecución Piloto', 'Implementación Formal', 'Cierre y Control'
  ],
  'Reingeniería': [
    'Activación de la reingeniería', 'Diagnóstico AS-IS', 'Análisis Lean, causa raíz y priorización', 
    'Diseño TO-BE', 'Ejecución Agile', 'Gestión del cambio y Kaizen', 'Control y cierre'
  ],
  'Taller de Herramientas': [
    'Preparación del taller', 'Clasificación y entendimiento', 'Taller de roles', 
    'Taller documental', 'Taller técnico', 'Taller de indicadores', 'Taller de control', 'Validación y liberación'
  ]
};

export const CHECKLISTS: Record<ProjectType, { phase: number, text: string }[]> = {
  'MODO': [
    { phase: 1, text: 'El problema está definido en el Acta Lean del Proyecto.' },
    { phase: 1, text: 'El alcance y fuera de alcance están claros.' },
    { phase: 1, text: 'El patrocinador y el dueño del proceso están identificados.' },
    { phase: 2, text: 'El backlog del proyecto está priorizado.' },
    { phase: 3, text: 'El proceso actual AS-IS fue validado con usuarios clave.' },
    { phase: 3, text: 'La línea base de indicadores fue definida.' },
    { phase: 3, text: 'Las causas raíz fueron identificadas y priorizadas.' },
    { phase: 4, text: 'El proceso futuro TO-BE fue diseñado y validado.' },
    { phase: 4, text: 'Los roles, reglas, controles e indicadores del MODO están definidos.' },
    { phase: 5, text: 'El piloto fue ejecutado y medido.' },
    { phase: 5, text: 'Los ajustes del piloto fueron incorporados.' },
    { phase: 6, text: 'El MODO fue comunicado e implementado formalmente.' },
    { phase: 6, text: 'El tablero de control está activo.' },
    { phase: 6, text: 'El dueño del proceso asumió el seguimiento.' },
    { phase: 7, text: 'Se documentaron resultados, lecciones aprendidas y mejoras futuras.' }
  ],
  'Reingeniería': [
    { phase: 1, text: 'Acta de Reingeniería aprobada.' },
    { phase: 1, text: 'Problema y objetivo definidos.' },
    { phase: 1, text: 'Alcance validado.' },
    { phase: 2, text: 'Mapa AS-IS documentado.' },
    { phase: 2, text: 'Línea base medida.' },
    { phase: 2, text: 'Hallazgos operativos identificados.' },
    { phase: 3, text: 'Mapa de desperdicios creado.' },
    { phase: 3, text: 'Causas raíz (Ishikawa/5 Porqués) validadas.' },
    { phase: 3, text: 'Matriz impacto-esfuerzo y backlog priorizado.' },
    { phase: 4, text: 'Mapa TO-BE diseñado.' },
    { phase: 4, text: 'Reglas de operación definidas.' },
    { phase: 4, text: 'Controles e indicadores establecidos.' },
    { phase: 5, text: 'Backlog de ejecución definido.' },
    { phase: 5, text: 'Incrementos de mejora implementados.' },
    { phase: 5, text: 'Revisión de ciclo completada.' },
    { phase: 6, text: 'Plan Kotter comunicado.' },
    { phase: 6, text: 'Victorias rápidas generadas.' },
    { phase: 6, text: 'Evidencia de estabilización.' },
    { phase: 7, text: 'Reporte final y comparativa de línea base.' },
    { phase: 7, text: 'Plan de control formalizado.' },
    { phase: 7, text: 'Cierre aprobado.' }
  ],
  'Taller de Herramientas': [
    { phase: 1, text: 'Agenda de taller definida.' },
    { phase: 1, text: 'Matriz de entregables seleccionada.' },
    { phase: 1, text: 'Inventario documental inicial preparado.' },
    { phase: 2, text: 'Arquitectura básica APQC / PCF.' },
    { phase: 2, text: 'SIPOC y VSM básico levantados.' },
    { phase: 2, text: 'Alcance validado.' },
    { phase: 3, text: 'Perfil de puesto y actividades definidos.' },
    { phase: 3, text: 'Matriz de comunicación construida.' },
    { phase: 4, text: 'Manual de proceso y BPMN 2.0.' },
    { phase: 4, text: 'IDO y Formatos definidos.' },
    { phase: 5, text: 'Manual técnico y guía de uso.' },
    { phase: 5, text: 'Criterios técnicos documentados.' },
    { phase: 6, text: 'Tablero de KPIs y Tubería diseñados.' },
    { phase: 6, text: 'Matriz Hoshin Kanri vinculada.' },
    { phase: 7, text: 'Matriz de auditoría y criterios de revisión.' },
    { phase: 7, text: 'Plan de seguimiento establecido.' },
    { phase: 8, text: 'Paquete liberado y versionado.' },
    { phase: 8, text: 'Evidencia de capacitación registrada.' },
    { phase: 8, text: 'Checklist de cierre completado.' }
  ]
};

export const TALLER_INFO: Record<number, { proposito: string, queSeHace: string[] }> = {
  1: {
    proposito: 'Alinear alcance, objetivo, proceso, participantes, agenda y entregables. Se evita convocar talleres sin insumos, sin responsables o sin claridad de decisión.',
    queSeHace: ['Definir proceso o subproceso a trabajar.', 'Identificar dueño del proceso, usuarios clave y aprobadores.', 'Seleccionar entregables requeridos.', 'Preparar agenda, insumos, plantillas y criterios de salida.']
  },
  2: {
    proposito: 'Fusiona la clasificación del proceso con el entendimiento operativo para optimizar el plan de trabajo: primero se ordena el proceso dentro de la arquitectura y, en la misma etapa, se comprende cómo fluye en la operación real.',
    queSeHace: ['Clasificar macroproceso, proceso, subproceso y actividad.', 'Definir límites del proceso.', 'Relacionar proceso con áreas, puestos, sistemas y clientes internos.', 'Levantar SIPOC.', 'Construir VSM básico cuando existan tiempos, esperas o retrabajos.', 'Identificar entradas, salidas, responsables, sistemas, evidencias y puntos de control.']
  },
  3: {
    proposito: 'Definir responsabilidades, actividades, indicadores e interacciones entre puestos.',
    queSeHace: ['Levantar funciones y actividades reales.', 'Definir responsabilidades principales y secundarias.', 'Identificar indicadores del puesto.', 'Construir matriz de comunicación y escalación.']
  },
  4: {
    proposito: 'Construir los documentos que explican cómo opera el proceso y sus reglas.',
    queSeHace: ['Diagramar proceso BPMN 2.0 con Swimlanes.', 'Integrar políticas como reglas operativas dentro del manual.', 'Definir procedimientos, IDO, formatos y checklists.', 'Validar con usuarios clave.']
  },
  5: {
    proposito: 'Documentar uso de herramientas, sistemas, configuraciones o criterios técnicos.',
    queSeHace: ['Identificar herramienta o sistema utilizado.', 'Documentar pasos de uso.', 'Definir configuraciones, criterios técnicos y errores comunes.', 'Validar con responsable técnico.']
  },
  6: {
    proposito: 'Construir indicadores y reportes que permitan controlar, decidir y alinear la mejora.',
    queSeHace: ['Definir KPI, fórmula, meta, fuente, frecuencia y responsable.', 'Diseñar Tubería de trazabilidad de información.', 'Definir RPD: Reportes para Decidir.', 'Vincular indicadores a Hoshin Kanri.']
  },
  7: {
    proposito: 'Definir cómo se auditará el uso de las herramientas y el cumplimiento del proceso.',
    queSeHace: ['Definir criterios de auditoría.', 'Definir frecuencia, responsable y evidencia.', 'Establecer tratamiento de desviaciones.', 'Conectar auditoría con tablero de KPIs.']
  },
  8: {
    proposito: 'Asegurar que los entregables sean útiles, aprobados, versionados y explicados a la operación.',
    queSeHace: ['Validar entregables con usuarios clave.', 'Ajustar redacción, formato y criterios de uso.', 'Codificar y versionar documentos.', 'Liberar, capacitar y registrar evidencia.']
  }
};

export const INITIAL_MODOS: Record<string, Modo> = {
  'm1': {
    id: 'm1',
    name: 'Entrega de unidades nuevas',
    projectType: 'MODO',
    area: 'Venta (En Piso)',
    currentPhase: 1,
    progress: 10,
    status: 'On Track',
    team: {}, 
    phases: {
      1: { status: 'En proceso', data: {}, checklistOut: {} }
    }
  },
  'm2': {
    id: 'm2',
    name: 'Atención de garantías',
    projectType: 'Reingeniería',
    area: 'Postventa',
    currentPhase: 4,
    progress: 42,
    status: 'At Risk',
    team: {
      'Patrocinador': 'Elena (Dirección)',
      'Líder': 'Carlos (Líder MC)',
      'Dueño del proceso': 'Pedro (Gerente)'
    },
    phases: {
      1: { status: 'Aprobado', data: {}, checklistOut: { 'Acta de Reingeniería aprobada.': true, 'Problema y objetivo definidos.': true, 'Alcance validado.': true } },
      2: { status: 'Aprobado', data: {}, checklistOut: { 'Mapa AS-IS documentado.': true, 'Línea base medida.': true, 'Hallazgos operativos identificados.': true } },
      3: { status: 'Aprobado', data: {}, checklistOut: { 'Mapa de desperdicios creado.': true, 'Causas raíz (Ishikawa/5 Porqués) validadas.': true, 'Matriz impacto-esfuerzo y backlog priorizado.': true } },
      4: { status: 'En proceso', data: {}, checklistOut: {} }
    }
  },
  'm3': {
    id: 'm3',
    name: 'Optimización de Tiempos de Respuesta',
    projectType: 'Taller de Herramientas',
    area: 'BDC (Atracción y Gestión de Leads)',
    currentPhase: 1,
    progress: 0,
    status: 'On Track',
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    team: {
      'Líder': 'Ana (Admin MC)'
    },
    phases: {
      1: { status: 'En proceso', data: {}, checklistOut: {} }
    }
  }
};

export const INITIAL_SOLICITUDES: Record<string, Solicitud> = {
  's1': {
    id: 's1',
    title: 'Digitalización de Checklists de Taller',
    type: 'Nuevo sistema',
    area: 'Postventa',
    requestor: 'Juan Pérez',
    date: new Date().toISOString(),
    answers: {
      q1: 'Implementar tablets para los técnicos',
      q2: 'Eliminar el uso de papel y doble captura',
      q3: 'Técnicos y Asesores',
      q4: 'Ya tengo cotizaciones'
    },
    urgency: 2,
    effort: 2,
    tag: 'Proyecto Estratégico',
    status: 'Nueva'
  },
  's2': {
    id: 's2',
    title: 'Reducir tiempo de lavado',
    type: 'Idea de mejora',
    area: 'Postventa',
    requestor: 'María Gómez',
    date: new Date(Date.now() - 86400000).toISOString(),
    answers: {
      q1: 'Reorganizar los insumos de lavado',
      q2: 'Lavado de autos',
      q3: 'Los lavadores caminan mucho por el jabón',
      q4: 'Reducción de tiempos'
    },
    urgency: 2,
    effort: 1,
    tag: 'Quick Win',
    status: 'En Revisión'
  }
};

export const INITIAL_PROCEDIMIENTOS: import('./types').Procedimiento[] = [
  // Nuevos procedimientos del BDC
  { id: 'bdc_mkt_1', procesoId: 'p_bdc_mkt', name: 'Captación y Registro de Lead', puestos: ['MKT Digital'], sistemas: ['Portales Web', 'CRM'] },
  { id: 'bdc_mkt_2', procesoId: 'p_bdc_mkt', name: 'Asignación de Lead', puestos: ['Lead Manager'], sistemas: ['CRM'] },
  { id: 'bdc_mkt_3', procesoId: 'p_bdc_mkt', name: 'Primer Contacto', puestos: ['Asesor BDC'], sistemas: ['Conmutador', 'CRM'] },
  { id: 'bdc_mkt_4', procesoId: 'p_bdc_mkt', name: 'Perfilamiento e Identificación de Necesidad', puestos: ['Asesor BDC'], sistemas: ['CRM'] },
  { id: 'bdc_mkt_5', procesoId: 'p_bdc_mkt', name: 'Cotización y Propuesta', puestos: ['Asesor Ventas'], sistemas: ['Intelisis', 'CRM'] },
  { id: 'bdc_mkt_6', procesoId: 'p_bdc_mkt', name: 'Prueba de Manejo', puestos: ['Asesor Ventas'], sistemas: ['CRM'] },
  { id: 'bdc_mkt_7', procesoId: 'p_bdc_mkt', name: 'Negociación y Cierre de Venta', puestos: ['Asesor Ventas', 'Gerente Ventas'], sistemas: ['Intelisis', 'CRM'] },
  { id: 'bdc_mkt_8', procesoId: 'p_bdc_mkt', name: 'Preparación de Entrega', puestos: ['Asesor Ventas', 'Coordinador Entregas'], sistemas: ['SIP', 'Intelisis'] },
  { id: 'bdc_mkt_9', procesoId: 'p_bdc_mkt', name: 'Entrega de Unidad', puestos: ['Coordinador Entregas'], sistemas: ['CRM'] },
  
  { id: 'bdc_ven_1', procesoId: 'p_bdc_ventas', name: 'Recepción de Lead Digital', puestos: ['Lead Manager', 'Contact Center'], sistemas: ['CRM', 'Redes Sociales'] },
  { id: 'bdc_ven_2', procesoId: 'p_bdc_ventas', name: 'Intento de Contacto (Llamada/WhatsApp)', puestos: ['Asesor BDC'], sistemas: ['WhatsApp Business', 'Telefonía VoIP'] },
  { id: 'bdc_ven_3', procesoId: 'p_bdc_ventas', name: 'Perfilamiento y Cotización Digital', puestos: ['Asesor BDC'], sistemas: ['CRM', 'Intelisis'] },
  { id: 'bdc_ven_4', procesoId: 'p_bdc_ventas', name: 'Agendamiento de Cita en Sucursal', puestos: ['Asesor BDC'], sistemas: ['CRM', 'Agenda Digital'] },
  { id: 'bdc_ven_5', procesoId: 'p_bdc_ventas', name: 'Seguimiento a Cita', puestos: ['Asesor BDC'], sistemas: ['WhatsApp Business', 'CRM'] },
  
  { id: 'bdc_pos_1', procesoId: 'p_bdc_posventa', name: 'Agendamiento de Cita de Servicio', puestos: ['Asesor BDC Servicio'], sistemas: ['CRM Servicio', 'Intelisis'] },
  { id: 'bdc_pos_2', procesoId: 'p_bdc_posventa', name: 'Recordatorio de Cita', puestos: ['Asesor BDC Servicio'], sistemas: ['WhatsApp Business', 'Telefonía VoIP'] },
  { id: 'bdc_pos_3', procesoId: 'p_bdc_posventa', name: 'Recepción en Taller', puestos: ['Asesor de Servicio'], sistemas: ['Intelisis', 'Tableta Recepción'] },
  { id: 'bdc_pos_4', procesoId: 'p_bdc_posventa', name: 'Seguimiento de Reparación', puestos: ['Asesor de Servicio'], sistemas: ['WhatsApp Business', 'CRM Servicio'] },
  { id: 'bdc_pos_5', procesoId: 'p_bdc_posventa', name: 'Entrega y Cobro', puestos: ['Asesor de Servicio', 'Caja'], sistemas: ['Intelisis', 'Terminal de Pagos'] },
  
  { id: 'bdc_cal_1', procesoId: 'p_bdc_calidad', name: 'Encuesta de Calidad Posventa', puestos: ['Agente BDC Calidad'], sistemas: ['CRM', 'Sistema Encuestas'] },
  { id: 'bdc_cal_2', procesoId: 'p_bdc_calidad', name: 'Encuesta de Calidad Ventas', puestos: ['Agente BDC Calidad'], sistemas: ['CRM', 'Sistema Encuestas'] },
  { id: 'bdc_cal_3', procesoId: 'p_bdc_calidad', name: 'Tratamiento de Alertas / Detractores', puestos: ['Líder BDC', 'Gerente Sucursal'], sistemas: ['CRM', 'Portal Alertas'] },
  { id: 'bdc_cal_4', procesoId: 'p_bdc_calidad', name: 'Cierre y Plan de Acción', puestos: ['Gerente Sucursal', 'Mejora Continua'], sistemas: ['Herramienta Jira/Trello', 'CRM'] },
  
  // Procedimientos antiguos conservados
  { id: 'procsub6', procesoId: 'p7', name: 'Recepción Telefónica / WhatsApp del Cliente' },
  { id: 'procsub7', procesoId: 'p7', name: 'Validación de Capacidad y Asignación de Bahía' },
  { id: 'procsub8', procesoId: 'p8', name: 'Inspección Visual 28 Puntos en Elevador' },
  { id: 'procsub9', procesoId: 'p8', name: 'Apertura y Firma de Orden de Servicio' },
  { id: 'procsub10', procesoId: 'p8', name: 'Ejecución de Mantenimiento / Reparación Mecánica' }
];

export const INITIAL_KPIS: import('./types').ProjectKPI[] = [
  { id: 'kpi_bdc_1', projectId: 'global', name: 'SLA Primer Contacto (< 15 min)', status: 'Aprobado', procedimientoId: 'bdc_ven_2' },
  { id: 'kpi_bdc_2', projectId: 'global', name: '% Contactabilidad', status: 'Aprobado', procedimientoId: 'bdc_ven_2' },
  { id: 'kpi_bdc_3', projectId: 'global', name: '% Conversión de Lead a Cita', status: 'Aprobado', procedimientoId: 'bdc_ven_4' },
  { id: 'kpi_bdc_4', projectId: 'global', name: '% de Citas Asistidas (Showroom)', status: 'Aprobado', procedimientoId: 'bdc_ven_5' },
  { id: 'kpi_bdc_5', projectId: 'global', name: 'NPS Ventas', status: 'Aprobado', procedimientoId: 'bdc_cal_2' },
  { id: 'kpi_bdc_6', projectId: 'global', name: 'CSI Posventa', status: 'Aprobado', procedimientoId: 'bdc_cal_1' }
];