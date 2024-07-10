// utils/lovedImages.ts
export interface LovedImage {
  id: number;
  url: string;
  timestamp: string;
}

export const saveLovedImage = (
  id: string,
  imageUrl: string,
  image: LovedImage
) => {
  const lovedImages = getLovedImages();
  const existingIndex = lovedImages.findIndex((img) => img.id === image.id);

  if (existingIndex === -1) {
    const updatedImages = [...lovedImages, image];
    localStorage.setItem("lovedImages", JSON.stringify(updatedImages));
  }
};

export const removeLovedImage = (id: number) => {
  const lovedImages = getLovedImages();
  const updatedImages = lovedImages.filter((img) => img.id !== id);
  localStorage.setItem("lovedImages", JSON.stringify(updatedImages));
};

export const getLovedImages = (): LovedImage[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const storedImages = localStorage.getItem("lovedImages");
  return storedImages ? JSON.parse(storedImages) : [];
};
