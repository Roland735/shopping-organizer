// app/api/lists/[id]/items/route.js
import { NextResponse } from 'next/server';
import { ShoppingList } from '../../../../../../models/models_shopping_organizer';
import { connectDB } from '../../../../../../configs/dbConfig';



export async function POST(req, { params }) {

    const { itemId, userId } = params;
    console.log(itemId, userId);

    const payload = await req.json();
    await connectDB();
    console.log(payload);

    // Ensure this list belongs to the user
    const list = await ShoppingList.findOne({ _id: itemId, user: userId });
    if (!list) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Push new item
    list.items.push({ ...payload, purchased: false });
    await list.save();

    // Return just the newly added item with its generated _id
    const newItem = list.items[list.items.length - 1];
    return NextResponse.json(newItem);
}
