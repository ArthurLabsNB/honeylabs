import Dexie from 'dexie';

// allow providing indexedDB in non-browser environments
if (typeof indexedDB === 'undefined') {
  // @ts-ignore
  const { indexedDB, IDBKeyRange } = require('fake-indexeddb');
  Dexie.dependencies.indexedDB = indexedDB;
  Dexie.dependencies.IDBKeyRange = IDBKeyRange;
}
import * as Y from 'yjs';

export class CRDTMap {
  private ydoc: Y.Doc;
  private db: Dexie;
  private updates: Dexie.Table<{id?: number; update: Uint8Array}, number>;
  readonly map: Y.Map<any>;

  constructor(dbName = 'crdt-db') {
    this.ydoc = new Y.Doc();
    this.map = this.ydoc.getMap('data');
    this.db = new Dexie(dbName);
    this.db.version(1).stores({ updates: '++id' });
    this.updates = this.db.table('updates');
  }

  async load() {
    const rows = await this.updates.toArray();
    rows.forEach(r => Y.applyUpdate(this.ydoc, r.update));
    this.ydoc.on('update', (update: Uint8Array) => {
      this.updates.add({ update }).catch(() => {});
    });
  }

  getUpdate() {
    return Y.encodeStateAsUpdate(this.ydoc);
  }

  applyUpdate(update: Uint8Array) {
    Y.applyUpdate(this.ydoc, update);
  }
}
