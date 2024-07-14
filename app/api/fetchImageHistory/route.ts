import { NextResponse } from 'next/server';
import axios from 'axios';
import { NextRequest } from 'next/server';

interface PinataResponse {
  rows: Array<{
    ipfs_pin_hash: string;
    metadata: {
      keyvalues: {
        prompt: string;
      };
    };
    date_pinned: string;
  }>;
  count: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 24);

    console.log(`Fetching image history from Pinata - Page: ${page}, Limit: ${limit}`);
    
    const url = `https://api.pinata.cloud/data/pinList?status=pinned&pageLimit=${limit}&pageOffset=${(page - 1) * limit}`;

    const response = await axios.get<PinataResponse>(url, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_AUTH_TOKEN}`,
      },
    });

    console.log('Received response from Pinata:', response.data);

    if (!response.data.rows) {
      throw new Error('Unexpected response format from Pinata');
    }

    const images = response.data.rows.map((item) => {
      const prompt = item.metadata?.keyvalues?.prompt || 'Default Prompt';
    
      return {
        ipfsHash: item.ipfs_pin_hash,
        prompt: prompt,
        timestamp: item.date_pinned,
        url: `https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`,
      };
    });
    
    console.log(`Processed ${images.length} images`);

    const totalCount = response.data.count;
    const hasMore = totalCount > page * limit;

    return NextResponse.json({ 
      images,
      hasMore,
      totalCount
    });
  } catch (error: any) {
    console.error('Error fetching image history:', error);
    if (error.response) {
      console.error('Pinata API response:', error.response.data);
    }
    return NextResponse.json({ error: 'Failed to fetch image history', details: error.message }, { status: 500 });
  }
}