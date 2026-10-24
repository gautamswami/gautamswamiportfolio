import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Stage from "@/components/Stage";
import Reel from "@/components/Reel";
import SeoCopy from "@/components/SeoCopy";
import CalendlyModal from "@/components/CalendlyModal";

const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Stage />
        <Reel />
        <SeoCopy />
        <Footer />
      </main>
      <CalendlyModal />
    </SmoothScroll>
  );
}
