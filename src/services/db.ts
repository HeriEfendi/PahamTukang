import Dexie, { type EntityTable } from 'dexie';
import { DIYProject, MyProjectLog, UserChecklistState } from '../types';
import { INITIAL_PROJECTS } from '../data/projectsData';

export class PahamTukangDB extends Dexie {
  projects!: EntityTable<DIYProject, 'id'>;
  myLogs!: EntityTable<MyProjectLog, 'id'>;
  checklistStates!: EntityTable<UserChecklistState, 'projectId'>;

  constructor() {
    super('PahamTukangDB');
    this.version(1).stores({
      projects: 'id, slug, category, difficulty, title',
      myLogs: 'id, projectId, category, status, startDate',
      checklistStates: 'projectId, updatedAt',
    });
  }
}

export const db = new PahamTukangDB();

/**
 * Inisialisasi database Dexie & seeder proyek jika kosong
 */
export async function initDatabase(): Promise<void> {
  try {
    await db.open();
    const count = await db.projects.count();
    if (count === 0) {
      console.log('Seeding initial DIY projects into IndexedDB...');
      await db.projects.bulkAdd(INITIAL_PROJECTS);
      console.log('Seeding complete! Added', INITIAL_PROJECTS.length, 'projects.');
    } else {
      // Sinkronisasi proyek katalog terbaru ke database lokal
      for (const p of INITIAL_PROJECTS) {
        await db.projects.put(p);
      }
    }
  } catch (err) {
    console.error('Failed to initialize IndexedDB:', err);
  }
}

export async function getAllProjects(): Promise<DIYProject[]> {
  return await db.projects.toArray();
}

export async function getProjectBySlug(slug: string): Promise<DIYProject | undefined> {
  return await db.projects.where('slug').equals(slug).first();
}

export async function getProjectById(id: string): Promise<DIYProject | undefined> {
  return await db.projects.get(id);
}

export async function getChecklistState(projectId: string): Promise<UserChecklistState | null> {
  const item = await db.checklistStates.get(projectId);
  return item || null;
}

export async function saveChecklistState(state: UserChecklistState): Promise<void> {
  await db.checklistStates.put(state);
}

export async function getMyLogs(): Promise<MyProjectLog[]> {
  return await db.myLogs.orderBy('startDate').reverse().toArray();
}

export async function saveMyLog(log: MyProjectLog): Promise<string> {
  await db.myLogs.put(log);
  return log.id;
}

export async function deleteMyLog(id: string): Promise<void> {
  await db.myLogs.delete(id);
}

export async function exportAllData(): Promise<string> {
  const logs = await db.myLogs.toArray();
  const checklists = await db.checklistStates.toArray();
  const backup = {
    appName: 'PahamTukang',
    version: '1.0',
    exportDate: new Date().toISOString(),
    logs,
    checklists,
  };
  return JSON.stringify(backup, null, 2);
}

export async function importAllData(jsonStr: string): Promise<{ logsCount: number; checklistsCount: number }> {
  const data = JSON.parse(jsonStr);
  if (!data || data.appName !== 'PahamTukang') {
    throw new Error('Format berkas backup tidak valid untuk PahamTukang.');
  }

  let logsCount = 0;
  let checklistsCount = 0;

  if (Array.isArray(data.logs) && data.logs.length > 0) {
    await db.myLogs.bulkPut(data.logs);
    logsCount = data.logs.length;
  }

  if (Array.isArray(data.checklists) && data.checklists.length > 0) {
    await db.checklistStates.bulkPut(data.checklists);
    checklistsCount = data.checklists.length;
  }

  return { logsCount, checklistsCount };
}
