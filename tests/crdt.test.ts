import { describe, it, expect, beforeEach } from 'vitest';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';

globalThis.indexedDB = indexedDB as any;
globalThis.IDBKeyRange = IDBKeyRange as any;

import { CRDTMap } from '../packages/sdk/src';

describe('crdt convergence', () => {
  it('merges updates from multiple stores', async () => {
    const a = new CRDTMap('a');
    const b = new CRDTMap('b');
    await a.load();
    await b.load();
    a.map.set('x', 1);
    const update = a.getUpdate();
    b.applyUpdate(update);
    expect(b.map.get('x')).toBe(1);
  });
});
