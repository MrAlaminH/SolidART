
// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: 'https://api.naga.ac/v1',
// });

// const MAX_RETRIES = 3;
// const RETRY_DELAY = 1000; // 1 second

// export async function POST(req: Request) {
//   try {
//     console.log('Received request in API route');
//     const { prompt, model } = await req.json();
//     console.log('Parsed request body:', { prompt, model });

//     if (!prompt) {
//       console.log('No prompt provided');
//       return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
//     }

//     let retries = 0;
//     while (retries < MAX_RETRIES) {
//       try {
//         console.log(`Attempt ${retries + 1} to generate image`);
//         const response = await openai.images.generate({
//           model: model,
//           prompt: prompt,
//           n: 1,
//           size: "512x512",
//         });
//         console.log('Received response from OpenAI:', response);

//         const imageUrl = response.data[0].url;
//         if (!imageUrl) {
//           throw new Error('No image URL in the response');
//         }

//         console.log('Successfully generated image');
//         return NextResponse.json({ imageUrl });
//       } catch (error: any) {
//         console.error('Error generating image:', error);
//         console.error('Error details:', JSON.stringify(error, null, 2));

//         if (error.status === 500 || error.type === 'server_error') {
//           retries++;
//           if (retries < MAX_RETRIES) {
//             console.log(`Retrying in ${RETRY_DELAY}ms...`);
//             await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
//             continue;
//           }
//         }

//         throw error;
//       }
//     }

//     throw new Error('Failed to generate image after multiple attempts');
//   } catch (error: any) {
//     console.error('Unhandled error in API route:', error);
//     console.error('Error details:', JSON.stringify(error, null, 2));

//     let errorMessage = 'An error occurred while generating the image.';
//     let statusCode = 500;

//     if (error.status) {
//       statusCode = error.status;
//     }

//     if (error.message) {
//       errorMessage = error.message;
//     }

//     if (error.type === 'server_error') {
//       errorMessage = 'The image generation service is currently unavailable. Please try again later.';
//     }

//     console.log('Returning error response:', { error: errorMessage, status: statusCode });
//     return new NextResponse(JSON.stringify({ error: errorMessage }), {
//       status: statusCode,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }


import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import FormData from 'form-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
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

        // Fetch the image as a buffer
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        // Prepare the metadata for Pinata
        const metadata = {
          name: 'Generated Image',
          keyvalues: {
            prompt: prompt,
            model: model,
            timestamp: new Date().toISOString()
          }
        };

        // Create a form data object to upload the image to Pinata
        const formData = new FormData();
        formData.append('file', imageBuffer, {
          filename: 'image.png',
          contentType: 'image/png'
        });
        formData.append('pinataMetadata', JSON.stringify(metadata));

        // Upload image to Pinata
        const pinataResponse = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            headers: {
              'pinata_api_key': process.env.PINATA_API_KEY?.trim(),
              'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY?.trim(),
              ...formData.getHeaders()
            }
          }
        );

        console.log('Received response from Pinata:', pinataResponse.data);

        const pinataImageUrl = `https://gateway.pinata.cloud/ipfs/${pinataResponse.data.IpfsHash}`;
        console.log('Pinata image URL:', pinataImageUrl);

        return NextResponse.json({ imageUrl: pinataImageUrl });
      } catch (error: any) {
        console.error(`Error on attempt ${retries + 1}:`, error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }

        retries++;
        if (retries < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          throw error;
        }
      }
    }

    throw new Error('Failed to generate image after multiple attempts');
  } catch (error: any) {
    console.error('Unhandled error in API route:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));

    let errorMessage = 'An error occurred while generating the image.';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status || 500;
      errorMessage = error.response.data?.error?.message || errorMessage;
    }

    if (error.message) {
      errorMessage = error.message;
    }

    console.log('Returning error response:', { error: errorMessage, status: statusCode });
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}