// Client-Side IndexedDB Storage for User Wallpapers
// 100% saved in the visitor's browser with 0 server storage cost

export interface CustomWallpaper {
  id: string;
  url: string;
  category: string;
  title?: string;
  createdAt?: number;
}

const DB_NAME = 'GeekTabs_WallpaperDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_wallpapers';

function openWallpaperDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Retrieve all user-uploaded wallpapers from the visitor's local IndexedDB.
 */
export async function getAllUserWallpapers(): Promise<CustomWallpaper[]> {
  try {
    const db = await openWallpaperDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve((request.result as CustomWallpaper[]) || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Could not read from IndexedDB, returning empty array', err);
    return [];
  }
}

/**
 * Save an uploaded wallpaper into the visitor's local IndexedDB.
 */
export async function saveUserWallpaper(wallpaper: CustomWallpaper): Promise<void> {
  try {
    const db = await openWallpaperDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({
        ...wallpaper,
        createdAt: wallpaper.createdAt || Date.now(),
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to save wallpaper to IndexedDB', err);
    throw err;
  }
}

/**
 * Delete an uploaded wallpaper from the visitor's local IndexedDB.
 */
export async function deleteUserWallpaper(id: string): Promise<void> {
  try {
    const db = await openWallpaperDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to delete wallpaper from IndexedDB', err);
    throw err;
  }
}

/**
 * One-time smooth migration from old localStorage wallpapers to IndexedDB
 * to preserve any user wallpapers without consuming localStorage quota.
 */
export async function migrateFromLocalStorage(): Promise<CustomWallpaper[]> {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('GeekTabs-custom-wallpapers');
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];

    const migrated: CustomWallpaper[] = [];
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      // Skip default items or strings that match defaults
      const url = typeof item === 'string' ? item : item.url;
      const isDefault = url && (url.includes('images.unsplash.com') && item.id?.startsWith('def-'));
      if (isDefault) continue;

      const wp: CustomWallpaper = {
        id: item.id || `migrated-${Date.now()}-${i}`,
        url: url,
        category: item.category || 'Favorites',
        createdAt: Date.now(),
      };
      await saveUserWallpaper(wp);
      migrated.push(wp);
    }

    // Clean up large items from localStorage to free up browser quota
    localStorage.removeItem('GeekTabs-custom-wallpapers');
    return migrated;
  } catch (err) {
    console.warn('Migration from localStorage skipped or failed', err);
    return [];
  }
}
