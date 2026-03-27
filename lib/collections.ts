export interface Collection {
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  color: string;
  heroImage: string;
}

export const collections: Collection[] = [
  {
    slug: "abstracto-contemporaneo",
    title: "Abstracto Contemporáneo",
    category: "Abstracto",
    description: "Expresiones libres de color y forma que desafían la percepción",
    longDescription:
      "Una colección que celebra la libertad creativa sin límites. Cada obra es una exploración del color, la textura y la forma, donde las reglas tradicionales se rompen para dar paso a expresiones puras de emoción. Estas piezas invitan al espectador a interpretar libremente, creando su propia narrativa visual.",
    color: "from-purple-500 to-pink-500",
    heroImage:
      "https://images.unsplash.com/photo-1525434486320-567654c1f256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    slug: "retratos-expresivos",
    title: "Retratos Expresivos",
    category: "Retrato",
    description: "Capturando la esencia y emoción de la figura humana",
    longDescription:
      "Esta colección es un viaje íntimo a través del alma humana. Cada retrato no solo captura rasgos físicos, sino que busca revelar la personalidad, las emociones ocultas y las historias no contadas de cada sujeto. La técnica clásica se encuentra con la sensibilidad contemporánea.",
    color: "from-blue-500 to-cyan-500",
    heroImage:
      "https://images.unsplash.com/photo-1766169776548-56dad82f5bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    slug: "paisajes-oniricos",
    title: "Paisajes Oníricos",
    category: "Paisaje",
    description: "Naturaleza reimaginada con una paleta vibrante",
    longDescription:
      "Los paisajes de esta colección no son meras representaciones de lugares reales, sino visiones oníricas donde la naturaleza se transforma en poesía visual. Cada obra transporta al espectador a mundos donde los colores danzan y las formas naturales se reinventan.",
    color: "from-green-500 to-emerald-500",
    heroImage:
      "https://images.unsplash.com/photo-1763491905755-185326526e9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    slug: "floral-naturaleza",
    title: "Floral & Naturaleza",
    category: "Floral",
    description: "La belleza orgánica transformada en pintura",
    longDescription:
      "Una exploración sensorial de la naturaleza a través de flores, plantas y elementos orgánicos. Cada obra captura la fugacidad de la belleza natural con una paleta cálida y exuberante que llena de vida cualquier espacio.",
    color: "from-rose-400 to-orange-400",
    heroImage:
      "https://images.unsplash.com/photo-1490750967868-88df5691cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
