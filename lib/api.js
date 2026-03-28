// Server-side (SSR): call backend directly. Client-side: use Next.js rewrite proxy (relative path).
const BASE = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || 'http://52.51.114.68:8082')
  : '';

async function request(path, options = {}) {
  const { headers: extraHeaders, ...restOptions } = options;
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...restOptions,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error || 'Error'), { status: res.status });
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── Paintings (público) ──────────────────────────────────────────────────────
export const getPaintings = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/api/v1/paintings${q ? `?${q}` : ''}`);
};

export const getPainting = (id) => request(`/api/v1/paintings/${id}`);

// ─── Offers (público) ─────────────────────────────────────────────────────────
export const submitOffer = (paintingId, data) =>
  request(`/api/v1/paintings/${paintingId}/offers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getOfferStatus = (token) =>
  request(`/api/v1/paintings/offers/${token}`);

// ─── Admin ────────────────────────────────────────────────────────────────────
function adminRequest(path, options = {}, apiKey) {
  return request(path, {
    ...options,
    headers: { 'x-admin-api-key': apiKey, ...options.headers },
  });
}

export const adminGetPaintings = (apiKey, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return adminRequest(`/admin/api/paintings${q ? `?${q}` : ''}`, {}, apiKey);
};

export const adminCreatePainting = (apiKey, data) =>
  adminRequest('/admin/api/paintings', { method: 'POST', body: JSON.stringify(data) }, apiKey);

export const adminUpdatePainting = (apiKey, id, data) =>
  adminRequest(`/admin/api/paintings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, apiKey);

export const adminDeletePainting = (apiKey, id) =>
  adminRequest(`/admin/api/paintings/${id}`, { method: 'DELETE' }, apiKey);

export const adminGetImageUploadUrl = (apiKey, id, contentType) =>
  adminRequest(`/admin/api/paintings/${id}/images/presign`, {
    method: 'POST',
    body: JSON.stringify({ contentType }),
  }, apiKey);

export const adminAddImageKey = (apiKey, id, key) =>
  adminRequest(`/admin/api/paintings/${id}/images`, {
    method: 'POST',
    body: JSON.stringify({ key }),
  }, apiKey);

export const adminRemoveImageKey = (apiKey, id, key) =>
  adminRequest(`/admin/api/paintings/${id}/images`, {
    method: 'DELETE',
    body: JSON.stringify({ key }),
  }, apiKey);

export const adminGetOffers = (apiKey, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return adminRequest(`/admin/api/offers${q ? `?${q}` : ''}`, {}, apiKey);
};

export const adminRespondOffer = (apiKey, id, data) =>
  adminRequest(`/admin/api/offers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, apiKey);

// ─── Collections (público) ────────────────────────────────────────────────────
export const getCollections = () => request('/api/v1/collections');
export const getCollection = (slug) => request(`/api/v1/collections/${slug}`);

// ─── Collections (admin) ─────────────────────────────────────────────────────
export const adminGetCollections = (apiKey) =>
  adminRequest('/admin/api/collections', {}, apiKey);

export const adminCreateCollection = (apiKey, data) =>
  adminRequest('/admin/api/collections', { method: 'POST', body: JSON.stringify(data) }, apiKey);

export const adminUpdateCollection = (apiKey, id, data) =>
  adminRequest(`/admin/api/collections/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, apiKey);

export const adminDeleteCollection = (apiKey, id) =>
  adminRequest(`/admin/api/collections/${id}`, { method: 'DELETE' }, apiKey);

export const adminGetCollectionImageUploadUrl = (apiKey, id, contentType) =>
  adminRequest(`/admin/api/collections/${id}/images/presign`, {
    method: 'POST', body: JSON.stringify({ contentType }),
  }, apiKey);

export const adminSetCollectionHeroImage = (apiKey, id, key) =>
  adminRequest(`/admin/api/collections/${id}/images`, {
    method: 'POST', body: JSON.stringify({ key }),
  }, apiKey);

export const adminGetCollectionPaintings = (apiKey, id) =>
  adminRequest(`/admin/api/collections/${id}/paintings`, {}, apiKey);

export const adminAddPaintingToCollection = (apiKey, id, paintingId) =>
  adminRequest(`/admin/api/collections/${id}/paintings`, {
    method: 'POST', body: JSON.stringify({ paintingId }),
  }, apiKey);

export const adminRemovePaintingFromCollection = (apiKey, id, paintingId) =>
  adminRequest(`/admin/api/collections/${id}/paintings/${paintingId}`, { method: 'DELETE' }, apiKey);
