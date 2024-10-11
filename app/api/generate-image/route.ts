import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
import { auth } from '@/auth';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI and S3 Clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_API_BASE || '',
});

const s3 = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasAvailableApiCalls = await checkApiLimit();
    if (!hasAvailableApiCalls) {
      return NextResponse.json({ error: 'API limit exceeded', upgradeRequired: true }, { status: 403 });
    }

    const { prompt, model } = await req.json();
    if (!prompt || !model) {
      return NextResponse.json({ error: 'Prompt and model are required' }, { status: 400 });
    }

    const imageUrl = await generateImage(prompt, model);
    const r2ImageUrl = await uploadImageToR2(imageUrl, prompt);

    await incrementApiLimit();
    return NextResponse.json({ imageUrl: r2ImageUrl });
  } catch (error: any) {
    console.error('Unhandled error in API route:', error);
    const { message, status } = handleError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

async function generateImage(prompt: string, model: string): Promise<string> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // Initial retry delay
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const response = await openai.images.generate({
        model,
        prompt,
        n: 1,
        size: '512x512',
      });

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned by OpenAI');
      }

      return imageUrl;  // Ensure return on success
    } catch (error: any) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt >= MAX_RETRIES) {
        throw new Error(`Failed to generate image after ${MAX_RETRIES} attempts`);
      }

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt)); // Exponential backoff
    }
  }

  throw new Error('Image generation failed'); // Ensure return/failure case if loop ends
}

async function uploadImageToR2(imageUrl: string, prompt: string): Promise<string> {
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    const fileName = `${uuidv4()}.png`;
    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: imageBuffer,
      ContentType: 'image/png',
      Metadata: {
        prompt: prompt, // Store the prompt as metadata
        created: new Date().toISOString(), // Add a timestamp to metadata
      },
    };

    // Ensure the upload succeeds
    await s3.send(new PutObjectCommand(uploadParams));
    console.log(`Uploaded image to Cloudflare R2: ${fileName}`);

    // Ensure the image is available
    const r2Url = `https://${process.env.R2_ACCOUNT_ID_2}.r2.dev/${fileName}`;
    await axios.head(r2Url);

    return r2Url;
  } catch (error: any) {
    console.error('Failed to upload image to R2:', error.message);
    throw new Error('Failed to upload image to storage');
  }
}

function handleError(error: any): { message: string; status: number } {
  let message = 'An unexpected error occurred.';
  let status = 500;

  if (error.response) {
    status = error.response.status || 500;
    message = error.response.data?.error?.message || message;
  }

  if (error.message) {
    message = error.message;
  }

  return { message, status };
}
