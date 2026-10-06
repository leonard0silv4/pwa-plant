import { redirect } from "next/navigation";

// Friendly URL; saved analyses are rendered by the offline-capable /analysis?id= shell.
export default async function AnalysisByIdPage({ params }: PageProps<"/analysis/[id]">) {
  const { id } = await params;
  redirect(`/analysis?id=${encodeURIComponent(id)}`);
}
