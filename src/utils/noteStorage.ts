/**
 * 笔记数据存储管理
 * 基于 IndexedDB 的笔记持久化
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  isPinned: boolean;
  wordCount: number;
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const NOTE_DB_NAME = 'MediaHub-Notes';
const NOTE_DB_VERSION = 1;

class NoteStorageManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(NOTE_DB_NAME, NOTE_DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('notes')) {
          const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
          noteStore.createIndex('createdAt', 'createdAt', { unique: false });
          noteStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          noteStore.createIndex('category', 'category', { unique: false });
          noteStore.createIndex('isFavorite', 'isFavorite', { unique: false });
          noteStore.createIndex('isPinned', 'isPinned', { unique: false });
        }

        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
      };
    });
  }

  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    if (!this.db) await this.init();

    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.add(newNote);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(newNote);
    });
  }

  async updateNote(note: Note): Promise<Note> {
    if (!this.db) await this.init();

    const updatedNote = {
      ...note,
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.put(updatedNote);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(updatedNote);
    });
  }

  async deleteNote(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getNote(id: string): Promise<Note | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAllNotes(): Promise<Note[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const notes = request.result as Note[];
        // 按修改时间倒序排列
        resolve(notes.sort((a, b) => b.updatedAt - a.updatedAt));
      };
    });
  }

  async getNotesByCategory(category: string): Promise<Note[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const index = store.index('category');
      const request = index.getAll(category);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const notes = request.result as Note[];
        resolve(notes.sort((a, b) => b.updatedAt - a.updatedAt));
      };
    });
  }

  async searchNotes(query: string): Promise<Note[]> {
    if (!this.db) await this.init();

    const notes = await this.getAllNotes();
    const lowerQuery = query.toLowerCase();

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getFavoriteNotes(): Promise<Note[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const index = store.index('isFavorite');
      const request = index.getAll(true);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const notes = request.result as Note[];
        resolve(notes.sort((a, b) => b.updatedAt - a.updatedAt));
      };
    });
  }

  async getPinnedNotes(): Promise<Note[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readonly');
      const store = transaction.objectStore('notes');
      const index = store.index('isPinned');
      const request = index.getAll(true);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const notes = request.result as Note[];
        resolve(notes.sort((a, b) => b.updatedAt - a.updatedAt));
      };
    });
  }

  async toggleFavorite(id: string): Promise<Note> {
    const note = await this.getNote(id);
    if (!note) throw new Error('Note not found');

    return this.updateNote({
      ...note,
      isFavorite: !note.isFavorite,
    });
  }

  async togglePin(id: string): Promise<Note> {
    const note = await this.getNote(id);
    if (!note) throw new Error('Note not found');

    return this.updateNote({
      ...note,
      isPinned: !note.isPinned,
    });
  }

  async getStatistics(): Promise<{
    totalNotes: number;
    favoriteCount: number;
    todayCount: number;
    categoryCount: Record<string, number>;
  }> {
    const notes = await this.getAllNotes();
    const now = Date.now();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const categoryCount: Record<string, number> = {};
    let todayCount = 0;

    notes.forEach((note) => {
      categoryCount[note.category] = (categoryCount[note.category] || 0) + 1;

      if (note.createdAt >= todayStart.getTime()) {
        todayCount++;
      }
    });

    const favoriteCount = notes.filter((n) => n.isFavorite).length;

    return {
      totalNotes: notes.length,
      favoriteCount,
      todayCount,
      categoryCount,
    };
  }

  async clearAllNotes(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const noteStorage = new NoteStorageManager();
