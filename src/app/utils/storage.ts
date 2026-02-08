/**
 * Robust local storage wrapper with versioning and error handling
 */
const STORAGE_KEY = 'krishiniti_v1';

export const saveGame = <T>(data: T): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (e) {
    console.error("Storage Save Error:", e);
    return false;
  }
};

export const loadGame = <T>(): T | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as T;
  } catch (e) {
    console.error("Storage Load Error:", e);
    // Return null on corruption to force clean state
    return null;
  }
};

export const clearGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Storage Clear Error:", e);
  }
};