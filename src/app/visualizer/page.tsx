"use client";

import ClientOnly from "@/components/ClientOnly";
import VisualizerContent from "@/components/VisualizerContent";

export default function VisualizerPage() {
  return (
    <ClientOnly>
      <VisualizerContent />
    </ClientOnly>
  );
}
