// // pages/api/generate-image.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import  OpenAI  from 'openai';
// import { Storage } from '@google-cloud/storage';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAI(configuration);

// const storage = new Storage({
//   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   },
// });

// const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME || '');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { prompt, model } = req.body;
    
//     // Generate image using OpenAI
//     const response = await openai.createImage({
//       prompt: prompt,
//       n: 1,
//       size: "512x512",
//     });

//     const imageUrl = response.data.data[0].url;
    
//     if (!imageUrl) {
//       throw new Error('No image URL returned from OpenAI');
//     }

//     // Download the image
//     const imageResponse = await fetch(imageUrl);
//     const imageBuffer = await imageResponse.arrayBuffer();

//     // Upload to Google Cloud Storage
//     const fileName = `generated-images/${Date.now()}.png`;
//     const file = bucket.file(fileName);
//     await file.save(Buffer.from(imageBuffer), {
//       metadata: {
//         contentType: 'image/png',
//       },
//     });

//     // Make the file publicly accessible
//     await file.makePublic();

//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

//     res.status(200).json({ imageUrl: publicUrl });
//   } catch (error) {
//     console.error('Error generating or saving image:', error);
//     res.status(500).json({ message: 'Error generating or saving image' });
//   }
// }




// pages/api/generate-image.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import OpenAI from 'openai';
// import { Storage } from '@google-cloud/storage';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const storage = new Storage({
//   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   },
// });

// const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME || '');

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const { prompt, model } = req.body;
    
//     // Generate image using OpenAI
//     const response = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: prompt,
//       n: 1,
//       size: "1024x1024",
//     });

//     const imageUrl = response.data[0].url;
    
//     if (!imageUrl) {
//       throw new Error('No image URL returned from OpenAI');
//     }

//     // Download the image
//     const imageResponse = await fetch(imageUrl);
//     const imageBuffer = await imageResponse.arrayBuffer();

//     // Upload to Google Cloud Storage
//     const fileName = `generated-images/${Date.now()}.png`;
//     const file = bucket.file(fileName);
//     await file.save(Buffer.from(imageBuffer), {
//       metadata: {
//         contentType: 'image/png',
//       },
//     });

//     // Make the file publicly accessible
//     await file.makePublic();

//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

//     res.status(200).json({ imageUrl: publicUrl });
//   } catch (error) {
//     console.error('Error generating or saving image:', error);
//     res.status(500).json({ message: 'Error generating or saving image' });
//   }
// }


import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.naga.ac/v1',
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function POST(req: Request) {
  try {
    console.log('Received request in API route');
    const { prompt, model } = await req.json();
    console.log('Parsed request body:', { prompt, model });

    if (!prompt) {
      console.log('No prompt provided');
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        console.log(`Attempt ${retries + 1} to generate image`);
        const response = await openai.images.generate({
          model: model,
          prompt: prompt,
          n: 1,
          size: "512x512",
        });
        console.log('Received response from OpenAI:', response);

        const imageUrl = response.data[0].url;
        if (!imageUrl) {
          throw new Error('No image URL in the response');
        }

        console.log('Successfully generated image');
        return NextResponse.json({ imageUrl });
      } catch (error: any) {
        console.error('Error generating image:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        if (error.status === 500 || error.type === 'server_error') {
          retries++;
          if (retries < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            continue;
          }
        }

        throw error;
      }
    }

    throw new Error('Failed to generate image after multiple attempts');
  } catch (error: any) {
    console.error('Unhandled error in API route:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    let errorMessage = 'An error occurred while generating the image.';
    let statusCode = 500;

    if (error.status) {
      statusCode = error.status;
    }

    if (error.message) {
      errorMessage = error.message;
    }

    if (error.type === 'server_error') {
      errorMessage = 'The image generation service is currently unavailable. Please try again later.';
    }

    console.log('Returning error response:', { error: errorMessage, status: statusCode });
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}