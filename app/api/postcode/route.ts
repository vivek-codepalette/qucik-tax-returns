import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');

  if (!postcode) {
    return NextResponse.json({ error: 'Postcode is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const data = await response.json();

    if (!data.result) {
      return NextResponse.json({ error: 'Invalid postcode' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
} 