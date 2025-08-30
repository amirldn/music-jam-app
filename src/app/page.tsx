import ClientOnly from "@/components/ClientOnly";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <ClientOnly>
      <HomeContent />
    </ClientOnly>
  );
}
