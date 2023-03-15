export default class IndexedDB {
  constructor(databaseName, storeConfigs) {
    this.databaseName = databaseName;
    this.storeConfigs = storeConfigs;
    this.db = null;
    this.tables = {};
  }

  // Open a connection to the IndexedDB database
  async open() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.databaseName);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.storeConfigs.forEach((storeConfig) => {
          const { storeName, dataType } = storeConfig;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id" });
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.storeConfigs.forEach((storeConfig) => {
          this.tables[storeConfig.storeName] = new IndexedDBTable(
            this,
            storeConfig.storeName
          );
        });
        resolve();
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  // Close the connection to the IndexedDB database
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // Add a new item to the specified store
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const { dataType } = this.getStoreConfig(storeName);
    const id = crypto.randomUUID();
    let value;
    switch (dataType) {
      case "arrayBuffer":
        value = data;
        break;
      case "object":
        value = data;
        break;
      default:
        value = String(data);
    }
    const request = objectStore.add({ id, data: value });

    await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });

    return id;
  }

  async put(storeName, data, id) {
    const transaction = this.db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const { dataType } = this.getStoreConfig(storeName);
    const key = id;
    let value;
    switch (dataType) {
      case "arrayBuffer":
        value =
          data instanceof ArrayBuffer
            ? data
            : new TextEncoder().encode(data).buffer;
        break;
      case "object":
        value = data;
        break;
      default:
        value = String(data);
    }
    const request = objectStore.put({ id: key, data: value });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(key);
      transaction.onerror = (event) => reject(event.target.error);
    });
  }

  // Retrieve an item from the specified store by its ID
  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const { dataType } = this.getStoreConfig(storeName);
    const request = objectStore.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (!result) {
          resolve(null);
          return;
        }
        let data;
        switch (dataType) {
          case "arrayBuffer":
            data = result.data;
            break;
          case "object":
            data = result.data;
            break;
          default:
            data = String(result.data);
        }
        resolve(data);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const { dataType } = this.getStoreConfig(storeName);
    const request = objectStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        const allData = event.target.result.map((result) => {
          let data;
          switch (dataType) {
            case "arrayBuffer":
              data = result.data;
              break;
            case "object":
              data = result.data;
              break;
            default:
              data = result.data;
          }
          return data;
        });
        resolve(allData);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }

  // Get the store configuration object for the specified store name
  getStoreConfig(storeName) {
    return this.storeConfigs.find((config) => config.storeName === storeName);
  }
}

class IndexedDBTable {
  constructor(db, name) {
    this.db = db;
    this.name = name;
  }

  async add(data) {
    return await this.db.add(this.name, data);
  }

  async put(data, id) {
    return await this.db.put(this.name, data, id);
  }

  async get(id) {
    return await this.db.get(this.name, id);
  }

  async getAll() {
    return await this.db.add(this.name);
  }

  async delete(id) {
    return await this.db.delete(this.name, id);
  }

  getStoreConfig() {
    return this.db.getStoreConfig(this.name);
  }
}
