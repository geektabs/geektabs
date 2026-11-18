// Client-Side IndexedDB Storage for User Wallpapers
// 100% saved in the visitor's browser with 0 server storage cost

export interface CustomWallpaper {
  id: string;
  url: string;
  category: string;
  title?: string;
  mediaType?: 'image' | 'video';
  createdAt?: number;
}

export function isGifWallpaperUrl(url?: string | null): boolean {
  const lower = (url || '').trim().toLowerCase();
  return (
    lower.startsWith('data:image/gif') ||
    /\.gif(\?|#|$)/i.test(lower) ||
    lower.includes('#gif')
  );
}

export function detectWallpaperMediaType(
  url: string,
  explicitType?: 'image' | 'video' | string
): 'image' | 'video' {
  if (explicitType === 'video') return 'video';
  const lower = (url || '').trim().toLowerCase();
  if (
    lower.startsWith('data:video/') ||
    /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|#|$)/i.test(lower) ||
    lower.includes('#video')
  ) {
    return 'video';
  }
  return 'image';
}

/**
 * Upgrade supported external image CDN URLs (e.g. Unsplash, Pexels) to 8K Ultra-HD (7680px, q=100).
 * Leaves videos, data URLs, and local assets untouched.
 */
export function upgradeWallpaperUrlTo8K(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/') ||
    detectWallpaperMediaType(trimmed) !== 'image'
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes('images.unsplash.com')) {
      parsed.searchParams.set('w', '7680');
      parsed.searchParams.set('q', '100');
      parsed.searchParams.delete('h');
      parsed.searchParams.delete('dpr');
      return parsed.toString();
    }
    if (parsed.hostname.includes('images.pexels.com')) {
      parsed.searchParams.set('w', '7680');
      parsed.searchParams.set('cs', 'srgb');
      parsed.searchParams.delete('h');
      parsed.searchParams.delete('dpr');
      return parsed.toString();
    }
  } catch {
    // Fallback string replacement for partial URLs
    if (trimmed.includes('images.unsplash.com')) {
      return trimmed
        .replace(/q=\d+/g, 'q=100')
        .replace(/w=\d+/g, 'w=7680');
    }
  }
  return trimmed;
}

/**
 * Automatically upscales uploaded static photos (e.g. 1080p / 2K / 4K) to 8K Ultra-HD (7680x4320 max)
 * using progressive multi-pass high-quality resampling and subtle clarity enhancement.
 * Note: GIFs and videos must bypass canvas re-encoding to preserve animation frames.
 */
export async function upscaleImageTo8K(
  base64Str: string
): Promise<{ dataUrl: string; width: number; height: number; upscaled: boolean }> {
  const MAX_8K_W = 7680;
  const MAX_8K_H = 4320;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      if (!origW || !origH) {
        resolve({ dataUrl: base64Str, width: origW, height: origH, upscaled: false });
        return;
      }

      // Already 8K or higher: keep native full resolution without re-encoding loss
      if (origW >= MAX_8K_W || origH >= MAX_8K_H) {
        resolve({ dataUrl: base64Str, width: origW, height: origH, upscaled: false });
        return;
      }

      const rawScale = Math.min(MAX_8K_W / origW, MAX_8K_H / origH);
      const scale = Math.min(rawScale, 6);
      const targetW = Math.round(origW * scale);
      const targetH = Math.round(origH * scale);

      const renderProgressive = (destW: number, destH: number): string | null => {
        try {
          let currentSource: CanvasImageSource = img;
          let curW = origW;
          let curH = origH;

          // Multi-step progressive 1.75x upscaling passes prevent softness/blockiness
          while (curW * 1.75 < destW && curH * 1.75 < destH) {
            const nextW = Math.round(curW * 1.75);
            const nextH = Math.round(curH * 1.75);
            const stepCanvas = document.createElement('canvas');
            stepCanvas.width = nextW;
            stepCanvas.height = nextH;
            const stepCtx = stepCanvas.getContext('2d');
            if (!stepCtx) return null;
            stepCtx.imageSmoothingEnabled = true;
            stepCtx.imageSmoothingQuality = 'high';
            stepCtx.drawImage(currentSource, 0, 0, nextW, nextH);
            currentSource = stepCanvas;
            curW = nextW;
            curH = nextH;
          }

          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = destW;
          finalCanvas.height = destH;
          const finalCtx = finalCanvas.getContext('2d');
          if (!finalCtx) return null;

          finalCtx.imageSmoothingEnabled = true;
          finalCtx.imageSmoothingQuality = 'high';
          finalCtx.filter = 'contrast(1.03) saturate(1.04)';
          finalCtx.drawImage(currentSource, 0, 0, destW, destH);
          finalCtx.filter = 'none';

          const webpUrl = finalCanvas.toDataURL('image/webp', 0.94);
          if (webpUrl && webpUrl.startsWith('data:image/webp')) {
            return webpUrl;
          }
          const jpegUrl = finalCanvas.toDataURL('image/jpeg', 0.95);
          if (jpegUrl && jpegUrl.startsWith('data:image/jpeg')) {
            return jpegUrl;
          }
          return null;
        } catch {
          return null;
        }
      };

      // Try full 8K first, fall back to 4K if browser memory/canvas limit is exceeded
      const result8K = renderProgressive(targetW, targetH);
      if (result8K) {
        resolve({ dataUrl: result8K, width: targetW, height: targetH, upscaled: true });
        return;
      }

      const scale4K = Math.min(3840 / origW, 2160 / origH, 4);
      const w4K = Math.round(origW * Math.max(1, scale4K));
      const h4K = Math.round(origH * Math.max(1, scale4K));
      const result4K = renderProgressive(w4K, h4K);
      if (result4K) {
        resolve({ dataUrl: result4K, width: w4K, height: h4K, upscaled: true });
        return;
      }

      resolve({ dataUrl: base64Str, width: origW, height: origH, upscaled: false });
    };

    img.onerror = () => {
      resolve({ dataUrl: base64Str, width: 0, height: 0, upscaled: false });
    };

    img.src = base64Str;
  });
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
 * Retrieve a single user-uploaded wallpaper by ID from IndexedDB.
 */
export async function getUserWallpaperById(id: string): Promise<CustomWallpaper | null> {
  try {
    const db = await openWallpaperDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve((request.result as CustomWallpaper) || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('Could not read wallpaper by id from IndexedDB', err);
    return null;
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
      const isDefault = url && ((url.includes('images.unsplash.com') || url.includes('images.pexels.com')) && item.id?.startsWith('def-'));
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
