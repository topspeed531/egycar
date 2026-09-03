export const FAVORITES_KEY = 'egycar-favorites';

export function getFavoriteIds(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const value = JSON.parse(
      localStorage.getItem(FAVORITES_KEY) || '[]'
    );

    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map(Number)
      .filter(Number.isFinite);

  } catch {
    return [];
  }
}

export function isFavorite(id: number): boolean {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(id: number): boolean {
  const ids = getFavoriteIds();

  const exists = ids.includes(id);

  const newIds = exists
    ? ids.filter(item => item !== id)
    : [...ids, id];

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(newIds)
  );

  window.dispatchEvent(
    new Event('egycar-favorites-change')
  );

  return !exists;
}