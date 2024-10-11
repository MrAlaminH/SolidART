import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';
import { initializeS3Client } from '@/utils/s3Client';

// Initialize S3 client for Cloudflare R2
const s3 = initializeS3Client();

// Define the type for images
type ImageObject = {
  key: string;
  url: string;
  prompt: string;
  timestamp: string;
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
    const pageObjects = objects.slice(startIndex, endIndex);
    
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