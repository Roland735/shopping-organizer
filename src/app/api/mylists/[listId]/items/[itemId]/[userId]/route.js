// app/api/lists/[listId]/items/[itemId]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../../../configs/dbConfig';
import { ShoppingList } from '../../../../../../../../models/models_shopping_organizer';


export async function PATCH(req, { params }) {

    const { listId, itemId, userId } = params;
    const updates = await req.json();
    await connectDB();

    // Find & update nested item using positional operator
    const updatedList = await ShoppingList.findOneAndUpdate(
        { _id: listId, user: userId, 'items._id': itemId },
        {
            $set: Object.fromEntries(
                Object.entries(updates).map(([k, v]) => ([`items.$.${k}`, v]))
            )
        },
        { new: true }
    );
    console.log('updatedList:', updatedList);
    if (!updatedList) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Return the updated item
    const updatedItem = updatedList.items.id(itemId);
    return NextResponse.json(updatedItem);
}

export async function DELETE(req, { params }) {


    const { listId, itemId, userId } = params;
    await connectDB();

    console.log('listId:', listId);

    // Pull the item out of the array
    const updatedList = await ShoppingList.findOneAndUpdate(
        { _id: listId, user: userId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
    );
    console.log('updatedList:', updatedList);

    if (!updatedList) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
}
