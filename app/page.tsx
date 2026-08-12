
import Aboutsection from "@/components/about";
import ScrollCanvas from "@/components/banner";
import Services from "@/components/services";
import Gallery from "@/components/gallery";
import Whychoose from "@/components/choose";
import StickySection from "@/components/stickey";

export default function Home() {
  return (
    <main className="bg-zinc-950">
        <ScrollCanvas />

        <Aboutsection />
{/* <Gallery /> */}
        {/* 

        <Services />

      <StickySection zIndex={10}>
        <Whychoose />
      </StickySection> */}
    </main>
  );
}