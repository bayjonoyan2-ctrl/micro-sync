'use strict';

const assert = require('assert');
const MicroSync = require('../src/index');

// Mock storage for Node testing
class MockStorage {
  constructor() { this.store = {}; }
  getItem(k) { return this.store[k] || null; }
  setItem(k, v) { this.store[k] = String(v); }
}

async function runTests() {
  console.log('Testing micro-sync...');
  
  const db = new MockStorage();
  const sync = new MicroSync({ db, retryDelay: 100 });

  // Test 1: Save adds to queue
  await sync.save('users', { id: 1, name: 'Jawad' });
  let queue = sync._getQueue();
  assert.strictEqual(queue.length, 1, 'Should have 1 item in queue');
  
  // Test 2: Conflict resolution (timestamp added)
  const saved = await sync.save('users', { id: 2, name: 'Alice' });
  assert.ok(saved._updatedAt, 'Should have _updatedAt timestamp');
  assert.strictEqual(saved._synced, false, 'Should be unsynced');

  // Wait for mock sync to clear the queue
  await new Promise(r => setTimeout(r, 600)); 
  
  queue = sync._getQueue();
  assert.strictEqual(queue.length, 0, 'Queue should be empty after sync');

  console.log('✅ All tests passed');
}

runTests().catch(console.error);