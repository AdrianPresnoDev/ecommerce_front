export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Construye la URL de detalle: /paintings/paisaje-de-otono--<uuid> */
export function paintingUrl(painting: { id: string; title: string }): string {
  return `/paintings/${slugify(painting.title)}--${painting.id}`;
}

/** Extrae el UUID del parámetro de ruta (acepta UUID puro o slug--uuid) */
export function extractPaintingId(param: string): string {
  const parts = param.split('--');
  return parts[parts.length - 1];
}
