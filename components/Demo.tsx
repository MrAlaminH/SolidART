import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Demo() {
  return (
    <section className="bg-transparent text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              AI Image Generation
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Image
              src="/demo1.png"
              alt="Generated Image"
              className="rounded-lg w-full h-auto"
              layout="responsive" // Add layout prop for responsiveness
              width={500} // Specify width
              height={300} // Specify height
            />
          </div>
          <div className="flex flex-col justify-between ">
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-4">
                <p>
                  Can you generate an image of Arboreal Titan, a
                  Transformers-style mech inspired by Groot, towering at 35
                  feet, deep wood-tone with metallic green accents, bark-covered
                  armor, flexible limbs, articulated joints, extendable
                  finger-like appendages, mechanical face with glowing green
                  eyes, bio-energy core visible through bark armor, standing
                  over a park in a futuristic city at dusk, gentle yet imposing
                  stance, long shadows, intricate wooden-metallic details,
                  guardian of nature and technology.
                </p>
              </div>
              <Button variant="outline" className="w-full">
                <a href="/auth/register">Generate more</a>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Image
                src="/demo2.png"
                alt="Generated Image 1"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo3.png"
                alt="Generated Image 2"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo4.jpg"
                alt="Generated Image 3"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo5.jpg"
                alt="Generated Image 3"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo6.png"
                alt="Generated Image 1"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo7.png"
                alt="Generated Image 2"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo8.png"
                alt="Generated Image 3"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
              <Image
                src="/demo9.jpg"
                alt="Generated Image 3"
                className="rounded-lg w-full h-auto"
                layout="responsive"
                width={500}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
