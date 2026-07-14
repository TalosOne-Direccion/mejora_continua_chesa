import { Modo, ProjectType, Solicitud, User, GlossaryTerm } from './types';

export const INITIAL_GLOSSARY: GlossaryTerm[] = [
  { term: 'MODO', definition: 'Modelo de Operaci├│n Digital. No es solo un framework, es la columna vertebral que alinea la visi├│n de negocio con la entrega.' },
  { term: 'AS-IS', definition: 'La radiograf├¡a del presente. Captura la realidad cruda de un proceso antes de cualquier intervenci├│n.' },
  { term: 'TO-BE', definition: 'El horizonte deseado. El dise├▒o del proceso optimizado que resuelve ineficiencias, enfocado en simplicidad y automatizaci├│n.' },
  { term: 'MVP', definition: 'Producto M├¡nimo Viable. La versi├│n m├ís peque├▒a de una idea que genera valor real temprano.' },
  { term: 'SIPOC', definition: 'Supplier, Input, Process, Output, Customer. Herramienta para mapear a alto nivel los elementos de un proceso.' },
  { term: 'KPI', definition: 'Key Performance Indicator. M├®trica clave que indica el desempe├▒o y salud de un proceso o proyecto.' },
  { term: 'DMAIC', definition: 'Define, Measure, Analyze, Improve, Control. Ciclo de mejora basado en datos usado para optimizar y estabilizar procesos.' },
  { term: 'RACI', definition: 'Responsible, Accountable, Consulted, Informed. Matriz utilizada para asignar y clarificar roles y responsabilidades.' }
];

export const AREAS = [
  'Planeaci├│n Anual',
  'BDC (Atracci├│n y Gesti├│n de Leads)',
  'Venta (En Piso)',
  'Postventa',
  'Calidad',
  'Administraci├│n',
  'TI',
  'Contabilidad',
  'Mejora Continua',
  'Auditor├¡a'
];

export const INITIAL_MACROPROCESOS: import('./types').Macroproceso[] = [
  { id: 'm1', name: 'Planeaci├│n Anual', type: 'Principal', order: 1 },
  { id: 'm2', name: 'BDC', type: 'Principal', order: 2 },
  { id: 'm3', name: 'Venta (En Piso)', type: 'Principal', order: 3 },
  { id: 'm4', name: 'Postventa', type: 'Principal', order: 4 },
  { id: 'm5', name: 'Calidad', type: 'Principal', order: 5 },
  { id: 'm6', name: 'Administraci├│n', type: 'Soporte' },
  { id: 'm7', name: 'TI', type: 'Soporte' },
  { id: 'm8', name: 'Contabilidad', type: 'Soporte' },
  { id: 'm9', name: 'Mejora Continua', type: 'Soporte' },
  { id: 'm10', name: 'Auditor├¡a', type: 'Soporte' }
];

export const INITIAL_PROCESOS: import('./types').Proceso[] = [
  { id: 'p1', macroprocesoId: 'm1', name: 'An├ílisis del Entorno y del Negocio' },
  { id: 'p2', macroprocesoId: 'm1', name: 'Definici├│n de Objetivos Anuales' },
  { id: 'p_bdc_mkt', macroprocesoId: 'm2', name: '1. Mercadotecnia Digital (MKT)' },
  { id: 'p_bdc_ventas', macroprocesoId: 'm2', name: '2. Ventas Digitales' },
  { id: 'p_bdc_posventa', macroprocesoId: 'm2', name: '3. Posventa' },
  { id: 'p_bdc_calidad', macroprocesoId: 'm2', name: '4. Calidad' },
  { id: 'p5', macroprocesoId: 'm3', name: 'Recepci├│n y Bienvenida del Cliente' },
  { id: 'p6', macroprocesoId: 'm3', name: 'Cotizaci├│n y Negociaci├│n' },
  { id: 'p7', macroprocesoId: 'm4', name: 'Programaci├│n de Citas / Servicios' },
  { id: 'p8', macroprocesoId: 'm4', name: 'Servicios de Mantenimiento y Reparaci├│n' },
  { id: 'p9', macroprocesoId: 'm5', name: 'Encuestas de Satisfacci├│n (NPS)' },
  { id: 'p10', macroprocesoId: 'm5', name: 'Gesti├│n de Quejas y Soluciones' }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Carlos Barrientos', puesto: 'Gerente de Mejora Continua', systemRole: 'Admin', areas: ['Todas'], sucursales: ['Todas'], telefono: '4421234567' },
  { id: 'u2', name: 'Ivonne', puesto: 'L├¡der de Mejora Continua', systemRole: 'Admin', areas: ['Todas'], sucursales: ['Todas'], reportsTo: 'u1', telefono: '4427654321' },
  { id: 'u3', name: 'Armando', puesto: 'L├¡der de Mejora Continua', systemRole: 'Admin', areas: ['Todas'], sucursales: ['Todas'], reportsTo: 'u1', telefono: '4429876543' },
  { id: 'u4', name: 'L├¡der de ├ürea', puesto: 'L├¡der de ├ürea (Solo Lectura)', systemRole: 'Lector', areas: ['Todas'], sucursales: ['Todas'], reportsTo: 'u2', telefono: '4421112233' }
];

export const PROJECT_PHASES: Record<ProjectType, string[]> = {
  'MODO': [
    'Inicio ├ügil', 'Planeaci├│n ├ügil', 'An├ílisis R├ípido', 
    'Dise├▒o MODO MVP', 'Ejecuci├│n Piloto', 'Implementaci├│n Formal', 'Cierre y Control'
  ],
  'Reingenier├¡a': [
    'Activaci├│n de la reingenier├¡a', 'Diagn├│stico AS-IS', 'An├ílisis Lean, causa ra├¡z y priorizaci├│n', 
    'Dise├▒o TO-BE', 'Ejecuci├│n Agile', 'Gesti├│n del cambio y Kaizen', 'Control y cierre'
  ],
  'Taller de Herramientas': [
    'Preparaci├│n del taller', 'Clasificaci├│n y entendimiento', 'Taller de roles', 
    'Taller documental', 'Taller t├®cnico', 'Taller de indicadores', 'Taller de control', 'Validaci├│n y liberaci├│n'
  ]
};

export const CHECKLISTS: Record<ProjectType, { phase: number, text: string }[]> = {
  'MODO': [
    { phase: 1, text: 'El problema est├í definido en el Acta Lean del Proyecto.' },
    { phase: 1, text: 'El alcance y fuera de alcance est├ín claros.' },
    { phase: 1, text: 'El patrocinador y el due├▒o del proceso est├ín identificados.' },
    { phase: 2, text: 'El backlog del proyecto est├í priorizado.' },
    { phase: 3, text: 'El proceso actual AS-IS fue validado con usuarios clave.' },
    { phase: 3, text: 'La l├¡nea base de indicadores fue definida.' },
    { phase: 3, text: 'Las causas ra├¡z fueron identificadas y priorizadas.' },
    { phase: 4, text: 'El proceso futuro TO-BE fue dise├▒ado y validado.' },
    { phase: 4, text: 'Los roles, reglas, controles e indicadores del MODO est├ín definidos.' },
    { phase: 5, text: 'El piloto fue ejecutado y medido.' },
    { phase: 5, text: 'Los ajustes del piloto fueron incorporados.' },
    { phase: 6, text: 'El MODO fue comunicado e implementado formalmente.' },
    { phase: 6, text: 'El tablero de control est├í activo.' },
    { phase: 6, text: 'El due├▒o del proceso asumi├│ el seguimiento.' },
    { phase: 7, text: 'Se documentaron resultados, lecciones aprendidas y mejoras futuras.' }
  ],
  'Reingenier├¡a': [
    { phase: 1, text: 'Acta de Reingenier├¡a aprobada.' },
    { phase: 1, text: 'Problema y objetivo definidos.' },
    { phase: 1, text: 'Alcance validado.' },
    { phase: 2, text: 'Mapa AS-IS documentado.' },
    { phase: 2, text: 'L├¡nea base medida.' },
    { phase: 2, text: 'Hallazgos operativos identificados.' },
    { phase: 3, text: 'Mapa de desperdicios creado.' },
    { phase: 3, text: 'Causas ra├¡z (Ishikawa/5 Porqu├®s) validadas.' },
    { phase: 3, text: 'Matriz impacto-esfuerzo y backlog priorizado.' },
    { phase: 4, text: 'Mapa TO-BE dise├▒ado.' },
    { phase: 4, text: 'Reglas de operaci├│n definidas.' },
    { phase: 4, text: 'Controles e indicadores establecidos.' },
    { phase: 5, text: 'Backlog de ejecuci├│n definido.' },
    { phase: 5, text: 'Incrementos de mejora implementados.' },
    { phase: 5, text: 'Revisi├│n de ciclo completada.' },
    { phase: 6, text: 'Plan Kotter comunicado.' },
    { phase: 6, text: 'Victorias r├ípidas generadas.' },
    { phase: 6, text: 'Evidencia de estabilizaci├│n.' },
    { phase: 7, text: 'Reporte final y comparativa de l├¡nea base.' },
    { phase: 7, text: 'Plan de control formalizado.' },
    { phase: 7, text: 'Cierre aprobado.' }
  ],
  'Taller de Herramientas': [
    { phase: 1, text: 'Agenda de taller definida.' },
    { phase: 1, text: 'Matriz de entregables seleccionada.' },
    { phase: 1, text: 'Inventario documental inicial preparado.' },
    { phase: 2, text: 'Arquitectura b├ísica APQC / PCF.' },
    { phase: 2, text: 'SIPOC y VSM b├ísico levantados.' },
    { phase: 2, text: 'Alcance validado.' },
    { phase: 3, text: 'Perfil de puesto y actividades definidos.' },
    { phase: 3, text: 'Matriz de comunicaci├│n construida.' },
    { phase: 4, text: 'Manual de proceso y BPMN 2.0.' },
    { phase: 4, text: 'IDO y Formatos definidos.' },
    { phase: 5, text: 'Manual t├®cnico y gu├¡a de uso.' },
    { phase: 5, text: 'Criterios t├®cnicos documentados.' },
    { phase: 6, text: 'Tablero de KPIs y Tuber├¡a dise├▒ados.' },
    { phase: 6, text: 'Matriz Hoshin Kanri vinculada.' },
    { phase: 7, text: 'Matriz de auditor├¡a y criterios de revisi├│n.' },
    { phase: 7, text: 'Plan de seguimiento establecido.' },
    { phase: 8, text: 'Paquete liberado y versionado.' },
    { phase: 8, text: 'Evidencia de capacitaci├│n registrada.' },
    { phase: 8, text: 'Checklist de cierre completado.' }
  ]
};

export const TALLER_INFO: Record<number, { proposito: string, queSeHace: string[] }> = {
  1: {
    proposito: 'Alinear alcance, objetivo, proceso, participantes, agenda y entregables. Se evita convocar talleres sin insumos, sin responsables o sin claridad de decisi├│n.',
    queSeHace: ['Definir proceso o subproceso a trabajar.', 'Identificar due├▒o del proceso, usuarios clave y aprobadores.', 'Seleccionar entregables requeridos.', 'Preparar agenda, insumos, plantillas y criterios de salida.']
  },
  2: {
    proposito: 'Fusiona la clasificaci├│n del proceso con el entendimiento operativo para optimizar el plan de trabajo: primero se ordena el proceso dentro de la arquitectura y, en la misma etapa, se comprende c├│mo fluye en la operaci├│n real.',
    queSeHace: ['Clasificar macroproceso, proceso, subproceso y actividad.', 'Definir l├¡mites del proceso.', 'Relacionar proceso con ├íreas, puestos, sistemas y clientes internos.', 'Levantar SIPOC.', 'Construir VSM b├ísico cuando existan tiempos, esperas o retrabajos.', 'Identificar entradas, salidas, responsables, sistemas, evidencias y puntos de control.']
  },
  3: {
    proposito: 'Definir responsabilidades, actividades, indicadores e interacciones entre puestos.',
    queSeHace: ['Levantar funciones y actividades reales.', 'Definir responsabilidades principales y secundarias.', 'Identificar indicadores del puesto.', 'Construir matriz de comunicaci├│n y escalaci├│n.']
  },
  4: {
    proposito: 'Construir los documentos que explican c├│mo opera el proceso y sus reglas.',
    queSeHace: ['Diagramar proceso BPMN 2.0 con Swimlanes.', 'Integrar pol├¡ticas como reglas operativas dentro del manual.', 'Definir procedimientos, IDO, formatos y checklists.', 'Validar con usuarios clave.']
  },
  5: {
    proposito: 'Documentar uso de herramientas, sistemas, configuraciones o criterios t├®cnicos.',
    queSeHace: ['Identificar herramienta o sistema utilizado.', 'Documentar pasos de uso.', 'Definir configuraciones, criterios t├®cnicos y errores comunes.', 'Validar con responsable t├®cnico.']
  },
  6: {
    proposito: 'Construir indicadores y reportes que permitan controlar, decidir y alinear la mejora.',
    queSeHace: ['Definir KPI, f├│rmula, meta, fuente, frecuencia y responsable.', 'Dise├▒ar Tuber├¡a de trazabilidad de informaci├│n.', 'Definir RPD: Reportes para Decidir.', 'Vincular indicadores a Hoshin Kanri.']
  },
  7: {
    proposito: 'Definir c├│mo se auditar├í el uso de las herramientas y el cumplimiento del proceso.',
    queSeHace: ['Definir criterios de auditor├¡a.', 'Definir frecuencia, responsable y evidencia.', 'Establecer tratamiento de desviaciones.', 'Conectar auditor├¡a con tablero de KPIs.']
  },
  8: {
    proposito: 'Asegurar que los entregables sean ├║tiles, aprobados, versionados y explicados a la operaci├│n.',
    queSeHace: ['Validar entregables con usuarios clave.', 'Ajustar redacci├│n, formato y criterios de uso.', 'Codificar y versionar documentos.', 'Liberar, capacitar y registrar evidencia.']
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
    name: 'Atenci├│n de garant├¡as',
    projectType: 'Reingenier├¡a',
    area: 'Postventa',
    currentPhase: 4,
    progress: 42,
    status: 'At Risk',
    team: {
      'Patrocinador': 'Elena (Direcci├│n)',
      'L├¡der': 'Carlos (L├¡der MC)',
      'Due├▒o del proceso': 'Pedro (Gerente)'
    },
    phases: {
      1: { status: 'Aprobado', data: {}, checklistOut: { 'Acta de Reingenier├¡a aprobada.': true, 'Problema y objetivo definidos.': true, 'Alcance validado.': true } },
      2: { status: 'Aprobado', data: {}, checklistOut: { 'Mapa AS-IS documentado.': true, 'L├¡nea base medida.': true, 'Hallazgos operativos identificados.': true } },
      3: { status: 'Aprobado', data: {}, checklistOut: { 'Mapa de desperdicios creado.': true, 'Causas ra├¡z (Ishikawa/5 Porqu├®s) validadas.': true, 'Matriz impacto-esfuerzo y backlog priorizado.': true } },
      4: { status: 'En proceso', data: {}, checklistOut: {} }
    }
  },
  'm3': {
    id: 'm3',
    name: 'Optimizaci├│n de Tiempos de Respuesta',
    projectType: 'Taller de Herramientas',
    area: 'BDC (Atracci├│n y Gesti├│n de Leads)',
    currentPhase: 1,
    progress: 0,
    status: 'On Track',
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    team: {
      'L├¡der': 'Ana (Admin MC)'
    },
    phases: {
      1: { status: 'En proceso', data: {}, checklistOut: {} }
    }
  }
};

export const INITIAL_SOLICITUDES: Record<string, Solicitud> = {
  's1': {
    id: 's1',
    title: 'Digitalizaci├│n de Checklists de Taller',
    type: 'Nuevo sistema',
    area: 'Postventa',
    requestor: 'Juan P├®rez',
    date: new Date().toISOString(),
    answers: {
      q1: 'Implementar tablets para los t├®cnicos',
      q2: 'Eliminar el uso de papel y doble captura',
      q3: 'T├®cnicos y Asesores',
      q4: 'Ya tengo cotizaciones'
    },
    urgency: 2,
    effort: 2,
    tag: 'Proyecto Estrat├®gico',
    status: 'Nueva'
  },
  's2': {
    id: 's2',
    title: 'Reducir tiempo de lavado',
    type: 'Idea de mejora',
    area: 'Postventa',
    requestor: 'Mar├¡a G├│mez',
    date: new Date(Date.now() - 86400000).toISOString(),
    answers: {
      q1: 'Reorganizar los insumos de lavado',
      q2: 'Lavado de autos',
      q3: 'Los lavadores caminan mucho por el jab├│n',
      q4: 'Reducci├│n de tiempos'
    },
    urgency: 2,
    effort: 1,
    tag: 'Quick Win',
    status: 'En Revisi├│n'
  }
};

export const INITIAL_PROCEDIMIENTOS: import('./types').Procedimiento[] = [
  // Nuevos procedimientos del BDC (MKT)
  { 
    id: 'bdc_mkt_1', 
    procesoId: 'p_bdc_mkt', 
    name: '1. Planeaci├│n y Autorizaci├│n de Pautas',
    puestos: ['Mercad├│logo de agencia', 'Gerente de MKT', 'Coordinador MKT BDC'],
    sistemas: ['Correo', 'Google Drive', 'Google Calendar'],
    herramientas: ['Plantilla de planeaci├│n', 'Plantillas de pauteo', 'Pol├¡tica de contenido y uso de marca']
  },
  { 
    id: 'bdc_mkt_2', 
    procesoId: 'p_bdc_mkt', 
    name: '2. Configuraci├│n de Pautas y Generaci├│n de Leads',
    puestos: ['Coordinador MKT BDC', 'Auxiliar de MKT (Community Manager)'],
    sistemas: ['CRM (Seekop / Sale-U)', 'Google Ads', 'Meta Business Suite'],
    herramientas: ['Mapa publicitario (┬┐?)', 'Pol├¡tica de contenido y uso de marca']
  },
  { 
    id: 'bdc_mkt_3', 
    procesoId: 'p_bdc_mkt', 
    name: '3. Gesti├│n de Contenido Org├ínico (Community Management)',
    puestos: ['Coordinador MKT BDC', 'Auxiliar de MKT (Community Manager)'],
    sistemas: ['LinkedIn', 'Meta Business Suite'],
    herramientas: ['Pauta org├ínica (┬┐?)', 'Material gr├ífico']
  },
  { 
    id: 'bdc_mkt_4', 
    procesoId: 'p_bdc_mkt', 
    name: '4. Actualizaci├│n de Cat├ílogo de Seminuevos',
    puestos: ['Gerentes de Seminuevos en agencia', 'Auxiliar de MKT (Community Manager)'],
    sistemas: ['DMS (SIA)', 'CRM (Seekop)', 'Facebook Outlet Chesa', 'Portal web (┬┐?)'],
    herramientas: ['Gu├¡a Fotos de seminuevos (┬┐?)', 'Formatos de alta de unidades (┬┐?)']
  },
  { 
    id: 'bdc_mkt_5', 
    procesoId: 'p_bdc_mkt', 
    name: '5. Atenci├│n de Hostess BDC (Primer Contacto)',
    puestos: ['Hostess Digital', 'APV Digital (APVD)'],
    sistemas: ['ManyChat (bot de IA)', 'CRM Seekop / Sale-U', 'Messenger Meta (5 perfiles)', 'WhatsApp Business (10 l├¡neas)'],
    herramientas: ['Guion / speech de llamada y WhatsApp (┬┐?)']
  },

  // Nuevos procedimientos del BDC (Ventas Digitales)
  { 
    id: 'bdc_ven_1', 
    procesoId: 'p_bdc_ventas', 
    name: '1. Recepci├│n y Pre-Asignaci├│n en CRM',
    puestos: ['Coordinador de Ventas Digitales', 'Hostess Digital'],
    sistemas: ['CRM Seekop (Nissan/Renault)', 'CRM Sale-U (Changan)'],
    herramientas: ['Reporte de eficiencia de asignaci├│n (┬┐?)', 'Rol de guardias (┬┐?)']
  },
  { 
    id: 'bdc_ven_2', 
    procesoId: 'p_bdc_ventas', 
    name: '2. Primer Contacto (APVD)',
    puestos: ['APV Digital (APVD)', 'Coordinador de Ventas Digitales'],
    sistemas: ['CRM Seekop / Sale-U', 'WhatsApp Business'],
    herramientas: ['Guiones de contacto']
  },
  { 
    id: 'bdc_ven_3', 
    procesoId: 'p_bdc_ventas', 
    name: '3. Perfilamiento, Agendamiento y Asignaci├│n de Escucha a Piso (┬┐?)',
    puestos: ['APV Digital', 'APV 2.0 (Asesor de Piso)'],
    sistemas: ['WhatsApp Business', 'CRM Seekop', 'CRM Sale-U'],
    herramientas: ['Plantilla de asignaci├│n por WhatsApp (┬┐?)']
  },
  { 
    id: 'bdc_ven_4', 
    procesoId: 'p_bdc_ventas', 
    name: '4. Seguimiento a Asignados, Inactivos y Escalamiento',
    puestos: ['APV Digital', 'Coord. Ventas BDC', 'Gerente de Ventas de la agencia'],
    sistemas: ['CRM Seekop / Sale-U'],
    herramientas: ['Reportes de seguimiento (┬┐?)']
  },
  { 
    id: 'bdc_ven_5', 
    procesoId: 'p_bdc_ventas', 
    name: '5. Rastreo de Ventas Facturadas (Corte de Mes)',
    puestos: ['Coordinador de Ventas BDC', 'APV Digital'],
    sistemas: ['CRM Seekop / Sale-U', 'SIA / Seekop (┬┐RH?)'],
    herramientas: ['Tabla / reporte de corte de ventas (Excel) (┬┐?)']
  },

  // Nuevos procedimientos del BDC (Posventa)
  { 
    id: 'bdc_pos_1', 
    procesoId: 'p_bdc_posventa', 
    name: '1. Extracci├│n, Preparaci├│n y Cruce de Bases de Datos',
    puestos: ['Coordinador de Posventa Digital'],
    sistemas: ['SIA ÔÇô DMS', 'Movicheck (┬┐?)', 'Dashboard Prosur'],
    herramientas: ['Base de datos', 'Layout de extracci├│n / normalizaci├│n (┬┐?)']
  },
  { 
    id: 'bdc_pos_2', 
    procesoId: 'p_bdc_posventa', 
    name: '2. Contacto Omnicanal y Agendamiento (Campa├▒as)',
    puestos: ['APV Digital (┬┐NP10?)'],
    sistemas: ['Telefon├¡a Neotel (predictivo)', 'Dashboard Prosur (cotizador)', 'SIA ÔÇô DMS (registro de cita)'],
    herramientas: ['Guion de atenci├│n (┬┐?)', 'Calendario de campa├▒as (┬┐?)']
  },
  { 
    id: 'bdc_pos_3', 
    procesoId: 'p_bdc_posventa', 
    name: '3. Auditor├¡a y Actualizaci├│n de Datos en Cita',
    puestos: ['APV Digital', 'Asesores de Servicio (Piso)'],
    sistemas: ['DMS SIA', 'Servisor Tablet'],
    herramientas: ['Matriz / checklist de auditor├¡a (┬┐?)']
  },
  { 
    id: 'bdc_pos_4', 
    procesoId: 'p_bdc_posventa', 
    name: '4. Rescate de No-Shows',
    puestos: ['APV Digital', 'Coordinador de Posventa Digital', 'Gerente de Posventa de agencia'],
    sistemas: ['SMS SIA (env├¡os/confirmaciones)', 'WhatsApp'],
    herramientas: ['Matriz de No-Shows (┬┐?)', 'Llamadas de reagendamiento (┬┐?)', 'WhatsApp de grupos de agencia (┬┐?)']
  },

  // Nuevos procedimientos del BDC (Calidad)
  { 
    id: 'bdc_cal_1', 
    procesoId: 'p_bdc_calidad', 
    name: '1. Sincronizaci├│n y Env├¡o de Encuesta Inicial',
    puestos: ['Coordinadora de Calidad', 'Administradora de Entregas (Agencia)', 'Telencuestadoras'],
    sistemas: ['SMS SIA (entregas)', 'Prosur (sync 3:00 am)', 'Twilio (env├¡o 9:45 am)'],
    herramientas: ['Reporte de entregas (┬┐?)']
  },
  { 
    id: 'bdc_cal_2', 
    procesoId: 'p_bdc_calidad', 
    name: '2. Asignaci├│n Manual, Encuesta Telef├│nica y Filtro (┬┐?)',
    puestos: ['Coordinadora de Calidad', 'Telencuestadoras'],
    sistemas: ['Prosur (asignaci├│n manual)', 'Telefon├¡a Neotel', 'Plataforma (┬┐Coro Papel?)'],
    herramientas: ['Reporte diario de encuestas (┬┐?)']
  },
  { 
    id: 'bdc_cal_3', 
    procesoId: 'p_bdc_calidad', 
    name: '3. Alertas de Insatisfacci├│n y Escalamiento',
    puestos: ['Telencuestadoras', 'Coordinadora de Calidad', '(┬┐KSFC / agencias?)', 'Gerencias de Ventas / Posventa'],
    sistemas: ['Prosur (m├│dulo de alertas)', '(┬┐Neotel?)'],
    herramientas: ['Bit├ícora de alertas y cierres (┬┐?)']
  },
  { 
    id: 'bdc_cal_4', 
    procesoId: 'p_bdc_calidad', 
    name: '4. Cotizaci├│n y Venta de Seguros Digitales',
    puestos: ['Ejecutiva de Seguros Digital'],
    sistemas: ['Cotizadores web (Qualitas)', 'Listas de p├│lizas a renovar (┬┐?)'],
    herramientas: ['Cartera de renovaciones (┬┐?)']
  },
  
  // Procedimientos antiguos conservados
  { id: 'procsub6', procesoId: 'p7', name: 'Recepci├│n Telef├│nica / WhatsApp del Cliente' },
  { id: 'procsub7', procesoId: 'p7', name: 'Validaci├│n de Capacidad y Asignaci├│n de Bah├¡a' },
  { id: 'procsub8', procesoId: 'p8', name: 'Inspecci├│n Visual 28 Puntos en Elevador' },
  { id: 'procsub9', procesoId: 'p8', name: 'Apertura y Firma de Orden de Servicio' },
  { id: 'procsub10', procesoId: 'p8', name: 'Ejecuci├│n de Mantenimiento / Reparaci├│n Mec├ínica' }
];

export const INITIAL_KPIS: import('./types').ProjectKPI[] = [
  // MKT
  { id: 'kpi_bdc_mkt_1_1', projectId: 'global', name: 'Cumplimiento en fechas de entrega (d├¡as 20ÔÇô25 del mes previo)', status: 'Propuesto', procedimientoId: 'bdc_mkt_1' },
  { id: 'kpi_bdc_mkt_1_2', projectId: 'global', name: 'Aprobaci├│n de presupuesto', status: 'Propuesto', procedimientoId: 'bdc_mkt_1' },
  { id: 'kpi_bdc_mkt_2_1', projectId: 'global', name: 'Costo por Lead (CPL)', status: 'Propuesto', procedimientoId: 'bdc_mkt_2' },
  { id: 'kpi_bdc_mkt_2_2', projectId: 'global', name: 'ROI de inversi├│n publicitaria', status: 'Propuesto', procedimientoId: 'bdc_mkt_2' },
  { id: 'kpi_bdc_mkt_2_3', projectId: 'global', name: 'Tasa de contacto de leads (Meta: 35% al 50%)', status: 'Propuesto', procedimientoId: 'bdc_mkt_2' },
  { id: 'kpi_bdc_mkt_2_4', projectId: 'global', name: 'Cumplimiento de citas por canal', status: 'Propuesto', procedimientoId: 'bdc_mkt_2' },
  { id: 'kpi_bdc_mkt_3_1', projectId: 'global', name: 'Alcance y engagement de cuentas oficiales', status: 'Propuesto', procedimientoId: 'bdc_mkt_3' },
  { id: 'kpi_bdc_mkt_4_1', projectId: 'global', name: '0 veh├¡culos sin actualizar en cat├ílogo', status: 'Propuesto', procedimientoId: 'bdc_mkt_4' },
  { id: 'kpi_bdc_mkt_4_2', projectId: 'global', name: 'Cumplimiento de la Gu├¡a Fotos (8 fotograf├¡as)', status: 'Propuesto', procedimientoId: 'bdc_mkt_4' },
  { id: 'kpi_bdc_mkt_5_1', projectId: 'global', name: 'SLA < 15 min', status: 'Propuesto', procedimientoId: 'bdc_mkt_5' },
  { id: 'kpi_bdc_mkt_5_2', projectId: 'global', name: 'Cantidad de leads asignados a cada APVD vs cantidad registrada en Seekop', status: 'Propuesto', procedimientoId: 'bdc_mkt_5' },

  // Ventas Digitales
  { id: 'kpi_bdc_ven_1_1', projectId: 'global', name: 'Asignaci├│n de lead en CRM: 15 min', status: 'Propuesto', procedimientoId: 'bdc_ven_1' },
  { id: 'kpi_bdc_ven_1_2', projectId: 'global', name: '0 leads sin asignar o extraviados en cola (Seekop)', status: 'Propuesto', procedimientoId: 'bdc_ven_1' },
  { id: 'kpi_bdc_ven_2_1', projectId: 'global', name: 'Tiempo de primera respuesta: SLA < 15 min', status: 'Propuesto', procedimientoId: 'bdc_ven_2' },
  { id: 'kpi_bdc_ven_2_2', projectId: 'global', name: 'Contactabilidad efectiva > 40%', status: 'Propuesto', procedimientoId: 'bdc_ven_2' },
  { id: 'kpi_bdc_ven_3_1', projectId: 'global', name: 'Citas digitales: 5 diarias por APVD', status: 'Propuesto', procedimientoId: 'bdc_ven_3' },
  { id: 'kpi_bdc_ven_3_2', projectId: 'global', name: 'Tasa de conversi├│n a citas (┬┐% meta?)', status: 'Propuesto', procedimientoId: 'bdc_ven_3' },
  { id: 'kpi_bdc_ven_3_3', projectId: 'global', name: 'Cero inasistencias sin registro en el CRM (┬┐?)', status: 'Propuesto', procedimientoId: 'bdc_ven_3' },
  { id: 'kpi_bdc_ven_4_1', projectId: 'global', name: 'Regla de 72 hrs (descarte del lead)', status: 'Propuesto', procedimientoId: 'bdc_ven_4' },
  { id: 'kpi_bdc_ven_4_2', projectId: 'global', name: 'Reasignaci├│n de leads: SLA (┬┐?)', status: 'Propuesto', procedimientoId: 'bdc_ven_4' },
  { id: 'kpi_bdc_ven_5_1', projectId: 'global', name: 'Meta m├¡nima: 12 ventas facturadas/mes por APVD', status: 'Propuesto', procedimientoId: 'bdc_ven_5' },
  { id: 'kpi_bdc_ven_5_2', projectId: 'global', name: 'Mezcla de unidades de Piso vs Flujo (┬┐% exactos por verificar?)', status: 'Propuesto', procedimientoId: 'bdc_ven_5' },

  // Posventa
  { id: 'kpi_bdc_pos_1_1', projectId: 'global', name: 'Bases cruzadas en Semana 4 del mes previo', status: 'Propuesto', procedimientoId: 'bdc_pos_1' },
  { id: 'kpi_bdc_pos_1_2', projectId: 'global', name: 'Depuraci├│n de duplicados / inactivos (┬┐12 hr?)', status: 'Propuesto', procedimientoId: 'bdc_pos_1' },
  { id: 'kpi_bdc_pos_2_1', projectId: 'global', name: 'Citas de 1er Servicio', status: 'Propuesto', procedimientoId: 'bdc_pos_2' },
  { id: 'kpi_bdc_pos_2_2', projectId: 'global', name: 'Retenci├│n (┬┐10 a├▒os?)', status: 'Propuesto', procedimientoId: 'bdc_pos_2' },
  { id: 'kpi_bdc_pos_2_3', projectId: 'global', name: 'Cobertura BDC en taller: 65% al 70%', status: 'Propuesto', procedimientoId: 'bdc_pos_2' },
  { id: 'kpi_bdc_pos_3_1', projectId: 'global', name: 'Datos incorrectos / b├ísicos < 8% de la base (┬┐?)', status: 'Propuesto', procedimientoId: 'bdc_pos_3' },
  { id: 'kpi_bdc_pos_3_2', projectId: 'global', name: 'Cumplimiento de Auditor├¡a Interna BDC', status: 'Propuesto', procedimientoId: 'bdc_pos_3' },
  { id: 'kpi_bdc_pos_4_1', projectId: 'global', name: 'Reducci├│n del ├¡ndice de No-Shows', status: 'Propuesto', procedimientoId: 'bdc_pos_4' },
  { id: 'kpi_bdc_pos_4_2', projectId: 'global', name: 'Show Rate (asistencia real)', status: 'Propuesto', procedimientoId: 'bdc_pos_4' },
  { id: 'kpi_bdc_pos_4_3', projectId: 'global', name: '├ôrdenes de Reparaci├│n facturadas (Tipo 1)', status: 'Propuesto', procedimientoId: 'bdc_pos_4' },

  // Calidad
  { id: 'kpi_bdc_cal_1_1', projectId: 'global', name: 'Env├¡o de encuesta en SLA de 24 hrs', status: 'Propuesto', procedimientoId: 'bdc_cal_1' },
  { id: 'kpi_bdc_cal_1_2', projectId: 'global', name: 'Tasa de respuesta por WhatsApp', status: 'Propuesto', procedimientoId: 'bdc_cal_1' },
  { id: 'kpi_bdc_cal_2_1', projectId: 'global', name: 'Respuesta efectiva en encuestas (Meta: 87%)', status: 'Propuesto', procedimientoId: 'bdc_cal_2' },
  { id: 'kpi_bdc_cal_3_1', projectId: 'global', name: 'Cierre de alertas: m├íximo 48 hrs', status: 'Propuesto', procedimientoId: 'bdc_cal_3' },
  { id: 'kpi_bdc_cal_3_2', projectId: 'global', name: 'Cumplimiento de Auditor├¡a Interna BDC Calidad', status: 'Propuesto', procedimientoId: 'bdc_cal_3' },
  { id: 'kpi_bdc_cal_4_1', projectId: 'global', name: 'Ventas y renovaciones de seguros automotrices', status: 'Propuesto', procedimientoId: 'bdc_cal_4' }
];
