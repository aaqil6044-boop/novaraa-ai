import { notFound } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import ToolWorkspace from "@/components/tools/ToolWorkspace";
import { getTool } from "@/lib/tools";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  return (
    <AppLayout>
      <ToolWorkspace slug={tool.slug} />
    </AppLayout>
  );
}
