
import Aboutsection from "@/components/about";
import ScrollCanvas from "@/components/banner";
import Services from "@/components/services";
import Gallery from "@/components/gallery";
import Whychoose from "@/components/choose";
import StickySection from "@/components/stickey";
import Testimonials from "@/components/test";

export default function Home() {
  return (
    <main className="bg-zinc-950">
        <ScrollCanvas />
        <Aboutsection />
        <Gallery />
        

        <Services />

        <Whychoose />
      <StickySection zIndex={10}>
        <Testimonials />
      </StickySection>
    </main>
  );
}