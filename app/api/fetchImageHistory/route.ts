import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client for Cloudflare R2
const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

// Define the type for images
type ImageObject = {
  key: string;
  url: string;
  prompt: string;
  timestamp: string; // Change this to string for easier sorting
};

// Fetch images and their metadata
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const bucketName = process.env.R2_BUCKET_NAME!;

    console.log(`Fetching image history from R2 - Page: ${page}, Limit: ${limit}`);

    // Fetch all objects and sort them by LastModified date
    const response = await s3.send(new ListObjectsV2Command({
      Bucket: bucketName,
    }));

    const objects = response.Contents || [];
    
    // Sort objects by LastModified date in descending order
    objects.sort((a, b) => {
      return (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0);
    });

    // Calculate the start and end indices for the requested page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice the sorted objects array to get the correct page
    const pageObjects = objects.slice(startIndex, endIndex + 1);
    
    // Fetch metadata and create image objects
    const images: (ImageObject | null)[] = await Promise.all(pageObjects.map(async (item) => {
      if (!item.Key) return null;
      try {
        const metadataResponse = await s3.send(new HeadObjectCommand({
          Bucket: bucketName,
          Key: item.Key,
        }));

        const prompt = metadataResponse.Metadata?.prompt || 'Default Prompt';
        const creationDate = metadataResponse.Metadata?.created || item.LastModified?.toISOString() || '';

        return {
          key: item.Key,
          url: `https://${process.env.R2_ACCOUNT_ID_2}.r2.dev/${item.Key}`,
          prompt,
          timestamp: creationDate,
        };
      } catch (metadataError) {
        console.error(`Error fetching metadata for ${item.Key}:`, metadataError);
        return null;
      }
    }));

    // Filter out null images
    const filteredImages: ImageObject[] = images.filter((img): img is ImageObject => img !== null);

    console.log(`Processed ${filteredImages.length} images`);

    // Determine if there are more images
    const hasMore = endIndex < objects.length;
    
    return NextResponse.json({ 
      images: filteredImages,
      hasMore,
      page,
      totalImages: objects.length,
    });
  } catch (error: any) {
    console.error('Error fetching image history:', error);
    return NextResponse.json({ error: 'Failed to fetch image history', details: error.message }, { status: 500 });
  }
}

// Upload new images with metadata
export async function uploadImageToR2(imageBuffer: Buffer, prompt: string) {
  const bucketName = process.env.R2_BUCKET_NAME!;
  const fileName = `${uuidv4()}.png`;

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: imageBuffer,
    ContentType: 'image/png',
    Metadata: {
      prompt: prompt,
      created: new Date().toISOString(),
    },
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    console.log('Uploaded image to Cloudflare R2:', fileName);

    const r2Url = `https://${process.env.R2_ACCOUNT_ID_2}.r2.dev/${fileName}`;
    return { url: r2Url, key: fileName, prompt, created: uploadParams.Metadata.created };
  } catch (error: any) {
    console.error('Failed to upload image to R2:', error);
    throw new Error('Failed to upload image to storage');
  }
}