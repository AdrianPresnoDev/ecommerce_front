/** Construye la URL de detalle usando el slug del backend */
export function paintingUrl(painting: { slug?: string; id: string; title: string }): string {
  return `/paintings/${painting.slug || painting.id}`;
}
