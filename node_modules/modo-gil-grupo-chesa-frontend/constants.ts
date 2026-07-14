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

export const INITIAL_MACROPROCESOS: import("./types").Macroproceso[] = [
  {
    "id": "mac_bdc",
    "name": "Macroproceso BDC",
    "type": "Soporte",
    "order": 1
  }
];

export const INITIAL_PROCESOS: import("./types").Proceso[] = [
  {
    "id": "p_bdc_mkt",
    "macroprocesoId": "mac_bdc",
    "name": "1. Mercadotecnia Digital (Marketing)",
    "order": 1
  },
  {
    "id": "p_bdc_ventas",
    "macroprocesoId": "mac_bdc",
    "name": "2. Ventas Digitales",
    "order": 2
  },
  {
    "id": "p_bdc_posventa",
    "macroprocesoId": "mac_bdc",
    "name": "3. Posventa Digital",
    "order": 3
  },
  {
    "id": "p_bdc_calidad",
    "macroprocesoId": "mac_bdc",
    "name": "4. Calidad Digital",
    "order": 4
  }
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

export const INITIAL_PROCEDIMIENTOS: import("./types").Procedimiento[] = [
  {
    "id": "bdc_mkt_1",
    "procesoId": "p_bdc_mkt",
    "name": "1. Planeación y Autorización de Pautas",
    "puestos": [
      "Mercadólogo Agencia",
      "Gerente Marketing",
      "Coordinador Marketing Digital"
    ],
    "sistemas": [
      "Correo",
      "Google Drive",
      "Google Calendar"
    ],
    "herramientas": [
      "Plantillas de presupuesto",
      "Plantillas de parrillas"
    ]
  },
  {
    "id": "bdc_mkt_2",
    "procesoId": "p_bdc_mkt",
    "name": "2. Configuración de Pautas y Generación de Leads",
    "puestos": [
      "Coordinador Marketing Digital",
      "Auxiliar de Marketing"
    ],
    "sistemas": [
      "CRM Seekop",
      "CRM Sale U",
      "Google Ads",
      "Meta Business Suite"
    ],
    "herramientas": [
      "Políticas de contenido y uso de marca",
      "Copys autorizados"
    ]
  },
  {
    "id": "bdc_mkt_3",
    "procesoId": "p_bdc_mkt",
    "name": "3. Gestión de Contenido Orgánico",
    "puestos": [
      "Coordinador Marketing Digital",
      "Auxiliar de Marketing"
    ],
    "sistemas": [
      "LinkedIn",
      "Meta Business Suite"
    ],
    "herramientas": [
      "Material gráfico",
      "Copys orgánicos"
    ]
  },
  {
    "id": "bdc_mkt_4",
    "procesoId": "p_bdc_mkt",
    "name": "4. Actualización de Catálogo de Seminuevos",
    "puestos": [
      "Gerentes Seminuevos",
      "Auxiliar de Marketing"
    ],
    "sistemas": [
      "DMS SIA",
      "CRM Seekop",
      "Facebook",
      "Outlet Chesa",
      "Milestone"
    ],
    "herramientas": [
      "Guía Fotos de seminuevos",
      "Formulario en Google Drive",
      "Políticas de contenido y uso de marca"
    ]
  },
  {
    "id": "bdc_mkt_5",
    "procesoId": "p_bdc_mkt",
    "name": "5. Atención de Hostess BDC",
    "puestos": [
      "Hostess Digital",
      "Asesor Piso Ventas Digital"
    ],
    "sistemas": [
      "ManyChat (bot IA)",
      "CRM Seekop",
      "CRM Sale-U",
      "Messenger Meta",
      "WhatsApp Business"
    ],
    "herramientas": [
      "Speech oficial de llamada y WhatsApp",
      "Rol de guardias APVD/APSD",
      "BD general en Drive"
    ]
  },
  {
    "id": "bdc_ven_1",
    "procesoId": "p_bdc_ventas",
    "name": "1. Recepción y Pre-Asignación en CRM",
    "puestos": [
      "Coordinador Ventas Digitales",
      "Hostess Digital"
    ],
    "sistemas": [
      "CRM Seekop",
      "CRM Sale-U"
    ],
    "herramientas": [
      "Rol de guardias de APVD"
    ]
  },
  {
    "id": "bdc_ven_2",
    "procesoId": "p_bdc_ventas",
    "name": "2. Primer Contacto",
    "puestos": [
      "Asesor Piso Ventas Digital",
      "Coordinador Ventas Digitales"
    ],
    "sistemas": [
      "CRM Seekop",
      "CRM Sale-U",
      "WhatsApp Business"
    ],
    "herramientas": [
      "Speeches de contacto"
    ]
  },
  {
    "id": "bdc_ven_3",
    "procesoId": "p_bdc_ventas",
    "name": "3. Perfilamiento, Agendamiento y Asignación de Escucha a Piso",
    "puestos": [
      "Asesor Piso Ventas Digital",
      "Asesor Piso Ventas 2.0"
    ],
    "sistemas": [
      "WhatsApp Business",
      "CRM Seekop",
      "CRM Sale-U"
    ],
    "herramientas": [
      "Fichas de asignación en WhatsApp por agencia",
      "Ubicación y contacto del APV 2.0",
      "Cotizador CaFi (enganches 25%-35%)"
    ]
  },
  {
    "id": "bdc_ven_4",
    "procesoId": "p_bdc_ventas",
    "name": "4. Seguimiento a Asignados, Inactivos y Escalamiento",
    "puestos": [
      "Asesor Piso Ventas Digital",
      "Coordinador Ventas Digitales",
      "Gerente Ventas"
    ],
    "sistemas": [
      "CRM Seekop",
      "CRM Sale-U"
    ],
    "herramientas": [
      "Reportes de embudos diarios en Excel",
      "Fichas de asignación",
      "Llamadas de escalamiento a gerencias"
    ]
  },
  {
    "id": "bdc_ven_5",
    "procesoId": "p_bdc_ventas",
    "name": "5. Rastreo de Ventas Facturadas",
    "puestos": [
      "Coordinador Ventas Digitales",
      "Asesor Piso Ventas Digital"
    ],
    "sistemas": [
      "CRM Seekop",
      "CRM Sale-U",
      "DMS SIA",
      "Seekop RK"
    ],
    "herramientas": [
      "Tablas y reportes de cortes de venta (Excel)"
    ]
  },
  {
    "id": "bdc_pos_1",
    "procesoId": "p_bdc_posventa",
    "name": "1. Extracción, Preparación y Cruce de Bases de Datos",
    "puestos": [
      "Coordinador Posventa Digital"
    ],
    "sistemas": [
      "DMS SIA",
      "Simetrical",
      "Dashboard Prosur"
    ],
    "herramientas": [
      "Tablas de control y limpieza manual (Excel)"
    ]
  },
  {
    "id": "bdc_pos_2",
    "procesoId": "p_bdc_posventa",
    "name": "2. Contacto Omnicanal y Agendamiento",
    "puestos": [
      "Asesor Piso Ventas Digital"
    ],
    "sistemas": [
      "Nuxiva",
      "Dashboard Prosur",
      "DMS SIA"
    ],
    "herramientas": [
      "Scripts de atención",
      "Manteletas de costos y cotizaciones (Prosur)"
    ]
  },
  {
    "id": "bdc_pos_3",
    "procesoId": "p_bdc_posventa",
    "name": "3. Auditoría y Actualización de Datos en Cita",
    "puestos": [
      "Asesor Piso Ventas Digital",
      "Asesores de Servicio"
    ],
    "sistemas": [
      "DMS SIA",
      "Service Tablet"
    ],
    "herramientas": [
      "Check-list verbal: VIN, placas, correo, teléfono"
    ]
  },
  {
    "id": "bdc_pos_4",
    "procesoId": "p_bdc_posventa",
    "name": "4. Rescate de No-Shows",
    "puestos": [
      "Asesor Piso Ventas Digital",
      "Coordinador Posventa Digital",
      "Gerente Posventa"
    ],
    "sistemas": [
      "DMS SIA",
      "WhatsApp Business"
    ],
    "herramientas": [
      "Bitácora de NO-SHOW",
      "Llamadas de reprogramación (2:00 pm)",
      "WhatsApp de grupos de agencias"
    ]
  },
  {
    "id": "bdc_cal_1",
    "procesoId": "p_bdc_calidad",
    "name": "1. Sincronización y Envío de Encuesta Inicial",
    "puestos": [
      "Coordinador Calidad Digital",
      "Administradora de Entregas (Agencia)",
      "Telencuestadoras"
    ],
    "sistemas": [
      "DMS SIA",
      "Dashboard Prosur",
      "Twilio"
    ],
    "herramientas": [
      "Formatos de mensajería automatizados"
    ]
  },
  {
    "id": "bdc_cal_2",
    "procesoId": "p_bdc_calidad",
    "name": "2. Asignación Manual, Encuesta Telefónica y Filtro",
    "puestos": [
      "Coordinador Calidad Digital",
      "Telencuestadoras"
    ],
    "sistemas": [
      "Dashboard Prosur",
      "Nuxiva",
      "Cero Papel"
    ],
    "herramientas": [
      "Speech oficial de encuestas (CSI/ISI/Rechazos)",
      "Cuestionarios en Prosur/Excel para limpieza",
      "WhatsApp Business y llamadas telefónicas"
    ]
  },
  {
    "id": "bdc_cal_3",
    "procesoId": "p_bdc_calidad",
    "name": "3. Alertas de Insatisfacción y Escalamiento",
    "puestos": [
      "Telencuestadoras",
      "Coordinador Calidad Digital",
      "Gerente Posventa",
      "Gerente Ventas"
    ],
    "sistemas": [
      "Nuxiva",
      "Nuxiva"
    ],
    "herramientas": [
      "Redacción literal de quejas (sin censura) + correo",
      "Grabaciones de voz como evidencia"
    ]
  },
  {
    "id": "bdc_cal_4",
    "procesoId": "p_bdc_calidad",
    "name": "4. Cotización y Venta de Seguros Digitales",
    "puestos": [
      "Ejecutivo Seguros Digital"
    ],
    "sistemas": [
      "Cotizadores web (Quálitas)",
      "Google Drive"
    ],
    "herramientas": [
      "Drive de pólizas a vencer",
      "Bitácora diaria de pólizas a vencer"
    ]
  }
];

export const INITIAL_KPIS: import("./types").ProjectKPI[] = [
  {
    "id": "kpi_bdc_mkt_1_1",
    "projectId": "global",
    "name": "Cumplimiento en fechas de entrega (días 20-25 del mes previo)",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_1"
  },
  {
    "id": "kpi_bdc_mkt_1_2",
    "projectId": "global",
    "name": "Aprobación de presupuesto",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_1"
  },
  {
    "id": "kpi_bdc_mkt_2_1",
    "projectId": "global",
    "name": "Costo por Lead (CPL)",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_2"
  },
  {
    "id": "kpi_bdc_mkt_2_2",
    "projectId": "global",
    "name": "ROI de inversión publicitaria",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_2"
  },
  {
    "id": "kpi_bdc_mkt_2_3",
    "projectId": "global",
    "name": "Tasa de contacto de leads (Meta: 15%-30%)",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_2"
  },
  {
    "id": "kpi_bdc_mkt_2_4",
    "projectId": "global",
    "name": "Cumplimiento de citas por canal",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_2"
  },
  {
    "id": "kpi_bdc_mkt_3_1",
    "projectId": "global",
    "name": "Alcance y engagement de cuentas oficiales",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_3"
  },
  {
    "id": "kpi_bdc_mkt_4_1",
    "projectId": "global",
    "name": "0 vehículos sin actualizar en catálogo",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_4"
  },
  {
    "id": "kpi_bdc_mkt_4_2",
    "projectId": "global",
    "name": "Cumplimiento de la Guía Fotos (8 fotografías)",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_4"
  },
  {
    "id": "kpi_bdc_mkt_5_1",
    "projectId": "global",
    "name": "SLA < 10 min",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_5"
  },
  {
    "id": "kpi_bdc_mkt_5_2",
    "projectId": "global",
    "name": "Cantidad de leads asignados a cada APVD vs. cantidad registrada en Seekop",
    "status": "Propuesto",
    "procedimientoId": "bdc_mkt_5"
  },
  {
    "id": "kpi_bdc_ven_1_1",
    "projectId": "global",
    "name": "Asignación de lead en CRM: 10 min",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_1"
  },
  {
    "id": "kpi_bdc_ven_1_2",
    "projectId": "global",
    "name": "0 leads sin asignar o estancados en cola (Seekop)",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_1"
  },
  {
    "id": "kpi_bdc_ven_2_1",
    "projectId": "global",
    "name": "Tiempo de primera respuesta: SLA < 10 min",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_2"
  },
  {
    "id": "kpi_bdc_ven_2_2",
    "projectId": "global",
    "name": "Contactabilidad efectiva > 90%",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_2"
  },
  {
    "id": "kpi_bdc_ven_3_1",
    "projectId": "global",
    "name": "Citas digitales: 5 diarias por APVD",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_3"
  },
  {
    "id": "kpi_bdc_ven_3_2",
    "projectId": "global",
    "name": "Tasa de conversión a citas ≥ 60%",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_3"
  },
  {
    "id": "kpi_bdc_ven_3_3",
    "projectId": "global",
    "name": "Cero inactivos en el CRM",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_3"
  },
  {
    "id": "kpi_bdc_ven_4_1",
    "projectId": "global",
    "name": "Regla de 72 hrs (descarte del lead)",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_4"
  },
  {
    "id": "kpi_bdc_ven_4_2",
    "projectId": "global",
    "name": "Reasignación de leads: SLA 3-4 min",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_4"
  },
  {
    "id": "kpi_bdc_ven_5_1",
    "projectId": "global",
    "name": "Meta mínima: 11 ventas facturadas/mes por APVD",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_5"
  },
  {
    "id": "kpi_bdc_ven_5_2",
    "projectId": "global",
    "name": "Mezcla: 60% Flujo Alto, 30% Flujo Medio, 10% Flujo Bajo",
    "status": "Propuesto",
    "procedimientoId": "bdc_ven_5"
  },
  {
    "id": "kpi_bdc_pos_1_1",
    "projectId": "global",
    "name": "Bases cruzadas en Semana 4 del mes previo",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_1"
  },
  {
    "id": "kpi_bdc_pos_1_2",
    "projectId": "global",
    "name": "Depuración de duplicados/inactivos (12 m)",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_1"
  },
  {
    "id": "kpi_bdc_pos_2_1",
    "projectId": "global",
    "name": "Citas de 1er Servicio",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_2"
  },
  {
    "id": "kpi_bdc_pos_2_2",
    "projectId": "global",
    "name": "Cobertura BDC en taller: 60%-70%",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_2"
  },
  {
    "id": "kpi_bdc_pos_3_1",
    "projectId": "global",
    "name": "Datos incorrectos/basura < 3% de la base",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_3"
  },
  {
    "id": "kpi_bdc_pos_3_2",
    "projectId": "global",
    "name": "Cumplimiento de Auditoría Interna BDC",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_3"
  },
  {
    "id": "kpi_bdc_pos_4_1",
    "projectId": "global",
    "name": "Reducción del índice de No-Shows",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_4"
  },
  {
    "id": "kpi_bdc_pos_4_2",
    "projectId": "global",
    "name": "Show Rate (asistencia real)",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_4"
  },
  {
    "id": "kpi_bdc_pos_4_3",
    "projectId": "global",
    "name": "Órdenes de Reparación facturadas (Tipo 1)",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_4"
  },
  {
    "id": "kpi_bdc_pos_4_4",
    "projectId": "global",
    "name": "Retención (10 años)",
    "status": "Propuesto",
    "procedimientoId": "bdc_pos_4"
  },
  {
    "id": "kpi_bdc_cal_1_1",
    "projectId": "global",
    "name": "Envío de encuesta en SLA de 24 hrs",
    "status": "Propuesto",
    "procedimientoId": "bdc_cal_1"
  },
  {
    "id": "kpi_bdc_cal_1_2",
    "projectId": "global",
    "name": "Tasa de respuesta por WhatsApp",
    "status": "Propuesto",
    "procedimientoId": "bdc_cal_1"
  },
  {
    "id": "kpi_bdc_cal_2_1",
    "projectId": "global",
    "name": "Respuesta efectiva en encuestas (Meta: 87%)",
    "status": "Propuesto",
    "procedimientoId": "bdc_cal_2"
  },
  {
    "id": "kpi_bdc_cal_3_1",
    "projectId": "global",
    "name": "Cierre de alertas: máximo 48 hrs",
    "status": "Propuesto",
    "procedimientoId": "bdc_cal_3"
  },
  {
    "id": "kpi_bdc_cal_3_2",
    "projectId": "global",
    "name": "Cumplimiento de Auditoría Interna BDC Calidad",
    "status": "Propuesto",
    "procedimientoId": "bdc_cal_3"
  },
  {
    "id": "kpi_bdc_cal_4_1",
    "projectId": "global",
    "name": "Ventas y renovaciones de seguros automotrices",
    "status": "Propuesto",
    "procedimientoId": "bdc_cal_4"
  }
];