
import Aboutsection from "@/components/about";
import ScrollCanvas from "@/components/banner";
import Services from "@/components/services";
import Gallery from "@/components/gallery";
import Whychoose from "@/components/choose";
import Testimonials from "@/components/test";

export default function Home() {
  return (
    <main className="bg-zinc-950">
        <ScrollCanvas />
        <Aboutsection />
        <Gallery />
        <Services />
        <Whychoose />
        <Testimonials />
        <div className="bg-black p-4 text-center text-lg text-white">All Rights Reserved. Design by <a href="https://s3dwebsolutions.vercel.app/" className="text-amber-500 hover:underline">S3D Wedding</a></div>
    </main>
  );
}