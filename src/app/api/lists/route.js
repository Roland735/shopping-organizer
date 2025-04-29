// app/api/lists/route.js
import { NextResponse } from 'next/server';
import { ShoppingList } from '../../../../models/models_shopping_organizer';
import { connectDB } from '../../../../configs/dbConfig';



// GET /api/lists
export async function GET() {
    await connectDB();
    const lists = await ShoppingList.find({}).sort({ updatedAt: -1 });
    return NextResponse.json(lists);
}

// POST /api/lists
export async function POST(req) {
    await connectDB();
    const data = await req.json();
    console.log(data);

    const list = new ShoppingList(data);
    await list.save();
    return NextResponse.json(list, { status: 201 });
}

