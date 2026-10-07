import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Plantagotchi",
    short_name: "Plantagotchi",
    description:
      "Descubra e cuide das plantas com inteligência artificial. Projeto da Feira de Ciências do Colégio MAF.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2ede3",
    theme_color: "#f2ede3",
    categories: ["education", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Minhas plantas", url: "/history", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
