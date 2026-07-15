export type SystemRole = 'Admin' | 'Equipo de Mejora Continua' | 'Patrocinador' | 'Facilitador' | 'Usuario clave' | 'Lector';
export type ProjectRole = 'Admin' | 'Equipo de Mejora Continua' | 'Patrocinador' | 'Facilitador' | 'Usuario clave';
export type ProjectType = 'MODO' | 'Reingeniería' | 'Taller de Herramientas';

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export type KPITool = 'HK' | 'RPD' | 'Tuberia';
export type KPIStatus = 'Propuesto' | 'Aprobado' | 'Liberado';

export type Milestone = {
  id: string;
  title: string;
  date: string;
  status: 'Completado' | 'En Progreso' | 'Pendiente';
};

export type Macroproceso = {
  id: string;
  name: string;
  type: 'Principal' | 'Soporte';
  order?: number;
};

export type Proceso = {
  id: string;
  macroprocesoId: string;
  name: string;
  diagram?: string;
  diagramImage?: string;
  puestos?: string[];
};

export type PropuestaProyecto = {
  id: string;
  projectId: string;
  name: string;
  type: 'Puesto' | 'Proceso' | 'Indicador' | 'Herramienta' | 'Sistema';
  macroprocesoId?: string;
  procesoId?: string;
  status: 'Propuesto' | 'Confirmado' | 'Definido';
};

export type ProjectKPI = {
  id: string;
  projectId: string;
  name: string;
  status: KPIStatus;
  puesto?: string;
  area?: string;
  sucursal?: string;
  tools?: KPITool[];
  macroprocesoId?: string;
  procesoId?: string;
  procedimientoId?: string;
  fuenteInfo?: string;
  target?: string;
  hoshinObjective?: string;
};

export type RPDConfig = {
  id: string;
  kpiId: string;
  projectId: string;
  nombreReporte: string;
  frecuencia: 'Diario' | 'Semanal' | 'Mensual' | 'Anual' | 'Otro';
  tomadorDecision: string;
  accionSiFalla: string;
  urlTablero?: string;
};

export type TuberiaData = {
  id: string;
  projectId: string;
  name: string;
  fuentesDeOrigen: string[];
  kpiIds: string[];
  frecuenciaActualizacion: string;
  responsableMantenimiento: string;
};

export type User = {
  id: string;
  name: string;
  puesto?: string;
  systemRole: SystemRole;
  areas: string[];
  sucursales?: string[];
  avatar?: string | null;
  password?: string;
  reportsTo?: string;
  telefono?: string;
  isSystemUser?: boolean;
};


export type ProjectRisk = {
  id: string;
  title: string;
  impact: 'Alto' | 'Medio' | 'Bajo';
  probability: 'Alta' | 'Media' | 'Baja';
  mitigation?: string;
  status: 'Abierto' | 'Mitigado' | 'Cerrado';
  createdAt: string;
};

export type MeetingParticipant = {
  name: string;
  role: string;
  attended: boolean;
};

export type MeetingTopic = {
  topic: string;
  responsible: string;
  duration: string; // ej. "0:15"
};

export type MeetingAgenda = {
  id: string;
  date: string;
  avance: string;
  acuerdosAnteriores: string;
  estatus: 'En tiempo' | 'Atrasado' | 'En riesgo' | 'Completado';
  proximosPasos: string;
  participants?: MeetingParticipant[];
  topics?: MeetingTopic[];
};

export type ProjectCommitment = {
  id: string;
  text: string;
  dueDate: string;
  responsible: string;
  status: 'Completado' | 'En progreso' | 'Retrasado' | 'No comenzado';
  comment?: string;
};

export type Modo = {
  id: string;
  name: string;
  projectType: ProjectType;
  area: string;
  currentPhase: number;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
  team: Record<string, string>; 
  phases: Record<number, PhaseState>;
  expirationDate?: string | null; 
  risks?: ProjectRisk[];
  agendas?: MeetingAgenda[];
  compromisos?: ProjectCommitment[];
};

export type TaskStatus = 'Por hacer' | 'En curso' | 'Listo';

export type ModoTask = {
  id: string;
  fase: string;
  codigo: string;
  actividad: string;
  descripcion: string;
  responsableDefault: string;
  responsableAsignado?: string;
  entregable: string;
  periodoDefault: string;
  fechaFin?: string;
  estado: TaskStatus;
};

export type PhaseLogEntry = {
  date: string;
  action: string;
  reason?: string;
  user: string;
};

export type PhaseState = {
  status: 'Pendiente' | 'En proceso' | 'Completo' | 'Aprobado';
  data: any; // Se usará data.tasks para almacenar ModoTask[] en la Fase 2
  checklistOut: Record<string, boolean>; 
  approvedAt?: string;
  logs?: PhaseLogEntry[];
};

export type SolicitudType = 'Idea de mejora' | 'Nuevo sistema' | 'Intervención';
export type SolicitudTag = 'Quick Win' | 'Proyecto Estratégico' | 'Backlog a Futuro' | 'Evaluación Pendiente';

export type Solicitud = {
  id: string;
  title: string;
  type: SolicitudType;
  area: string;
  requestor: string;
  date: string;
  answers: Record<string, string>;
  urgency: number;
  effort: number;
  tag: SolicitudTag;
  status: 'Nueva' | 'En Revisión' | 'Aprobada' | 'Rechazada';
};

export type Formato = {
  id: string;
  projectId?: string;
  macroprocesoId: string;
  procesoId: string;
  name: string;
  size: string;
  uploadedAt: string;
};

export type Procedimiento = {
  id: string;
  procesoId: string;
  name: string;
  diagram?: string;
  diagramImage?: string;
  puestos?: string[];
  sistemas?: string[];
  herramientas?: string[];
};

export type AppState = {
  currentUser: User;
  users: User[];
  modos: Record<string, Modo>;
  solicitudes: Record<string, Solicitud>;
  areas: string[];
  kpis: ProjectKPI[];
  macroprocesos: Macroproceso[];
  procesos: Proceso[];
  catalogoPuestos: string[];
  addCatalogoPuesto: (item: string) => void;
  deleteCatalogoPuesto: (item: string) => void;
  catalogoSistemas: string[];
  addCatalogoSistema: (item: string) => void;
  deleteCatalogoSistema: (item: string) => void;
  catalogoHerramientas: string[];
  addCatalogoHerramienta: (item: string) => void;
  deleteCatalogoHerramienta: (item: string) => void;
  procedimientos: Procedimiento[];
  addProcedimiento: (p: Omit<Procedimiento, 'id'>) => void;
  updateProcedimiento: (id: string, updates: Partial<Procedimiento>) => void;
  deleteProcedimiento: (id: string) => void;
  propuestas: PropuestaProyecto[];
  addPropuesta: (p: Omit<PropuestaProyecto, 'id'>) => void;
  updatePropuesta: (id: string, updates: Partial<PropuestaProyecto>) => void;
  deletePropuesta: (id: string) => void;
  formatos: Formato[];
  sucursales: string[];
  addSucursal: (name: string) => void;
  deleteSucursal: (name: string) => void;
};

export const _cacheBuster = 1;