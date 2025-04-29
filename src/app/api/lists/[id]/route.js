
// app/api/lists/[id]/route.js
import { NextResponse } from 'next/server';

import { ShoppingList } from '../../../../../models/models_shopping_organizer';
import { connectDB } from '../../../../../configs/dbConfig';

// GET single list
export async function GET(req, { params }) {
    await connectDB();
    const { id } = params;
    const list = await ShoppingList.findById(id);
    return list ? NextResponse.json(list) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

// PATCH /api/lists/[id]
export async function PATCH(req, { params }) {
    await connectDB();
    const { id } = params;
    const updates = await req.json();
    const list = await ShoppingList.findByIdAndUpdate(id, updates, { new: true });
    return list ? NextResponse.json(list) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

// DELETE /api/lists/[id]
export async function DELETE(req, { params }) {
    await connectDB();
    const { id } = params;
    await ShoppingList.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}


export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: listId } = params;
    const payload = await req.json();
    await connectDB();

    // Ensure this list belongs to the user
    const list = await ShoppingList.findOne({ _id: listId, user: session.user.id });
    if (!list) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Push new item
    list.items.push({ ...payload, purchased: false });
    await list.save();

    // Return just the newly added item with its generated _id
    const newItem = list.items[list.items.length - 1];
    return NextResponse.json(newItem);
}