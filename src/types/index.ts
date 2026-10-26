export type ProjectCategory = 'LST' | 'SAN' | 'KAY' | 'KNS';

export type DifficultyLevel = 'Pemula' | 'Menengah' | 'Mahir';

export interface SNIStandardReference {
  code: string;       // Contoh: "SNI 03-2835-2002" atau "PUIL 2020"
  title: string;      // Contoh: "Tata Cara Pengerjaan Plesteran & Acian Dinding"
  clause?: string;    // Contoh: "Pasal 4.2 Rasio 1:4"
  summary: string;    // Keterangan praktis untuk tukang
}

export interface MandatorySafetyCheckItem {
  id: string;
  text: string;
  detail: string;
  critical: boolean;
}

export interface ToolItem {
  id: string;
  name: string;
  required: boolean;
  specification?: string;
  note?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  defaultQty: number;
  unit: string;
  estimatedPriceUnit: number; // in IDR
  note?: string;
  sniStandard?: string;       // Contoh: "SNI 2049:2015 Semen PCC"
}

export interface CalculatorParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  tooltip?: string;
}

export interface CalculatorConfig {
  formulaType: 
    | 'electrical_cable' 
    | 'plumbing_pipe' 
    | 'floating_shelf' 
    | 'door_repair'
    | 'wall_plaster_ahsp'
    | 'hebel_aac_block'
    | 'concrete_k175_mix'
    | 'electrical_load_puil';
  title: string;
  description: string;
  parameters: CalculatorParam[];
  sniReference?: SNIStandardReference;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  schematicId?: string;
  proTip?: string;
  dangerWarning?: string;
  sniNote?: string;
  checkItems: string[];
}

export interface ProjectDiagram {
  id: string;
  title: string;
  description: string;
  type: 'svg_schematic';
}

export interface DIYProject {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryName: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  overview: string;
  tags: string[];
  sniStandards?: SNIStandardReference[];
  safetyHazards: string[];
  mandatorySafetyChecklist: MandatorySafetyCheckItem[];
  tools: ToolItem[];
  materials: MaterialItem[];
  calculatorConfig?: CalculatorConfig;
  steps: ProjectStep[];
  diagrams: ProjectDiagram[];
}

export interface MyProjectLog {
  id: string;
  projectId: string;
  projectTitle: string;
  category: ProjectCategory;
  status: 'in_progress' | 'completed' | 'need_repair';
  startDate: string;
  completedDate?: string;
  spentMinutes: number;
  totalCost: number; // in IDR
  userNotes: string;
  photoData?: string; // base64 string
  beforePhotoData?: string; // base64 foto sebelum perbaikan
  rating?: number;
  completedSteps: number[];
}

export interface UserChecklistState {
  projectId: string;
  checkedTools: string[];
  checkedMaterials: string[];
  safetyCompleted: boolean;
  currentStep: number;
  updatedAt: string;
}

export interface TroubleshooterResult {
  cause: string;
  dangerLevel: 'AMAN' | 'WASPADA' | 'BAHAYA';
  recommendations: string[];
  safetyInstruction: string;
  suggestedProjectSlug?: string;
}

export interface TroubleshooterNode {
  id: string;
  question?: string;
  options?: {
    text: string;
    nextNodeId: string;
  }[];
  result?: TroubleshooterResult;
}

export interface TroubleshooterTree {
  id: string;
  category: ProjectCategory;
  title: string;
  symptom: string;
  initialNodeId: string;
  nodes: Record<string, TroubleshooterNode>;
}
