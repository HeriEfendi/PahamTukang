export type ProjectCategory = 'LST' | 'SAN' | 'KAY';

export type DifficultyLevel = 'Pemula' | 'Menengah' | 'Mahir';

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
  formulaType: 'electrical_cable' | 'plumbing_pipe' | 'floating_shelf' | 'door_repair';
  title: string;
  description: string;
  parameters: CalculatorParam[];
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  description: string;
  schematicId?: string;
  proTip?: string;
  dangerWarning?: string;
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
