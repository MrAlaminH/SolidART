import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export function initializeS3Client() {
  return new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
}

const s3 = initializeS3Client();

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