import { NextResponse } from 'next/server';
// import TaxEntry from '@/models/TaxEntry';
// import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    return NextResponse.json([]);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     await connectDB();
//     const data = await request.json();
//     const newEntry = await TaxEntry.create(data);
//     return NextResponse.json(newEntry, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
//   }
// } 