import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

// 卡牌数据结构（简化版，用于存储）
export interface CardData {
  number: number;
  name: string;
  image: string;
  meaning: string;
}

// 历史记录数据结构
export interface HistoryRecord {
  id?: number;
  question: string;
  mode: 'three' | 'five' | 'nine';
  cards: CardData[];
  createdAt: number;
  querentGender?: string;
  queriedGender?: string;
  notes?: string;
}

// 数据库Schema定义
interface LenormandDB extends DBSchema {
  history: {
    key: number;
    value: HistoryRecord;
    indexes: {
      'by-date': number;
      'by-mode': string;
    };
  };
}

const DB_NAME = 'lenormand-db';
const DB_VERSION = 1;

let db: IDBPDatabase<LenormandDB> | null = null;

// 初始化数据库
export async function initDB(): Promise<IDBPDatabase<LenormandDB>> {
  if (db) return db;

  db = await openDB<LenormandDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const historyStore = db.createObjectStore('history', {
        keyPath: 'id',
        autoIncrement: true
      });

      historyStore.createIndex('by-date', 'createdAt', { unique: false });
      historyStore.createIndex('by-mode', 'mode', { unique: false });
    }
  });

  return db;
}

// 保存历史记录
export async function saveHistory(record: Omit<HistoryRecord, 'id' | 'createdAt'>): Promise<number> {
  const database = await initDB();
  const fullRecord: HistoryRecord = {
    ...record,
    createdAt: Date.now()
  };
  return database.add('history', fullRecord);
}

// 获取所有历史记录（按时间倒序）
export async function getAllHistory(): Promise<HistoryRecord[]> {
  const database = await initDB();
  const all = await database.getAllFromIndex('history', 'by-date');
  return all.reverse();
}

// 删除单条记录
export async function deleteHistory(id: number): Promise<void> {
  const database = await initDB();
  await database.delete('history', id);
}

// 清空所有记录
export async function clearAllHistory(): Promise<void> {
  const database = await initDB();
  await database.clear('history');
}

// 更新记录
export async function updateHistory(id: number, changes: Partial<HistoryRecord>): Promise<void> {
  const database = await initDB();
  const record = await database.get('history', id);
  if (record) {
    const updated = { ...record, ...changes, id };
    await database.put('history', updated);
  }
}

// 导出数据
export async function exportHistory(): Promise<string> {
  const all = await getAllHistory();
  return JSON.stringify(all, null, 2);
}

// 导入数据
export async function importHistory(jsonString: string): Promise<void> {
  const records: HistoryRecord[] = JSON.parse(jsonString);
  const database = await initDB();
  const tx = database.transaction('history', 'readwrite');

  for (const record of records) {
    const { id, ...data } = record;
    await tx.store.add(data as HistoryRecord);
  }

  await tx.done;
}
