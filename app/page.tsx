import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Feature } from "@/components/Feature";
import { Demo } from "@/components/Demo";

export default function Home() {
  return (
    <main className="h-full w-full">
      <div className="flex flex-col">
        <Header />
        <Hero />
        <Feature />
        <Demo />
        <Footer />
      </div>
    </main>
  );
}
