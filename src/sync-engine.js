'use strict';

/**
 * micro-sync core engine
 * Handles offline queuing, retries, and basic "Last-Write-Wins" conflict resolution.
 */
class MicroSync {
  constructor(options = {}) {
    this.db = options.db || this._defaultLocalStorage();
    this.apiEndpoint = options.apiEndpoint || '/api/sync';
    this.retryDelay = options.retryDelay || 5000;
    this.isSyncing = false;
    this.queueKey = 'micro-sync-queue';
  }

  _defaultLocalStorage() {
    return {
      getItem: (k) => (typeof localStorage !== 'undefined' ? localStorage.getItem(k) : null),
      setItem: (k, v) => { if (typeof localStorage !== 'undefined') localStorage.setItem(k, v); }
    };
  }

  _getQueue() {
    const data = this.db.getItem(this.queueKey);
    return data ? JSON.parse(data) : [];
  }

  _saveQueue(queue) {
    this.db.setItem(this.queueKey, JSON.stringify(queue));
  }

  // Save data locally and queue for sync
  async save(table, data) {
    const record = {
      ...data,
      _updatedAt: Date.now(), // Basic LWW (Last-Write-Wins) timestamp
      _synced: false
    };

    // In a real app, this would save to IndexedDB/SQLite
    this.db.setItem(`${table}_${record.id}`, JSON.stringify(record));

    // Add to offline queue
    const queue = this._getQueue();
    queue.push({ action: 'save', table, record });
    this._saveQueue(queue);

    // Try to sync immediately
    this.sync();
    return record;
  }

  // Sync the queue with the server
  async sync() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    let queue = this._getQueue();
    if (queue.length === 0) {
      this.isSyncing = false;
      return;
    }

    try {
      // In a real app, this would be a fetch() to your backend
      const response = await this._fakeServerCall(queue);
      
      if (response.success) {
        // Clear successfully synced items
        this._saveQueue([]);
        console.log(`✅ Synced ${queue.length} items.`);
      }
    } catch (err) {
      console.warn('⚠️ Sync failed. Will retry later.', err.message);
      // Keep in queue, retry later
      setTimeout(() => this.sync(), this.retryDelay);
    } finally {
      this.isSyncing = false;
    }
  }

  // Mock server call for testing
  async _fakeServerCall(queue) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  }
}

module.exports = MicroSync;