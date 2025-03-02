export async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tourdocs', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore('company', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('image', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result.slice(dataURL.indexOf(',') + 1);
      resolve(base64); // Return the base64 file content
    };

    reader.onerror = (error) => {
      reject(error); // Reject the promise if there was an error
    };

    // Start reading the file as a data URL
    reader.readAsDataURL(file);
  });
}

export async function saveImage(db, data) {
  await objectStoreClear(db, 'image');

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['image'], 'readwrite');
    const store = transaction.objectStore('image');
    const request = store.put(data);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function saveCompanyData(db, data) {
  await objectStoreClear(db, 'company');

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['company'], 'readwrite');
    const store = transaction.objectStore('company');
    const request = store.put(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function objectStoreClear(db, objectStoreName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const store = transaction.objectStore(objectStoreName);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (request) => {
      reject(request.error);
    };
  });

}

async function getImageById(db, id) {
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction(['image'], 'readonly');
    const store = transaction.objectStore('image');
    const request = store.get(id);

    request.onsuccess = async () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getCompanyData(db) {
  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction(['company'], 'readonly');
    const store = transaction.objectStore('company');
    const request = store.getAll();

    request.onsuccess = async () => {
      var company = request.result[0];

      resolve(company);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}