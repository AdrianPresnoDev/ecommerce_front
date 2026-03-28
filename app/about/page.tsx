export const dynamic = 'force-dynamic';

import { getAbout } from "@/lib/api";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "Sobre Mí | Inma Álvarez",
  description: "Conoce la historia de Inma Álvarez, pintora contemporánea con más de 15 años transformando emociones en arte.",
};

export default async function AboutPage() {
  let content: any = null;
  try {
    content = await getAbout();
  } catch {
    // use defaults
  }
  return <AboutClient content={content} />;
}
