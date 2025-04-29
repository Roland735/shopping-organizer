import { NextResponse } from "next/server";
import { connectDB } from "../../../../../configs/dbConfig";
import { Reminder } from "../../../../../models/models_shopping_organizer";

connectDB();

// PUT /api/reminders/:id
// body: { user, ...fieldsToUpdate }
export async function PUT(request, { params }) {
    const updates = await request.json();
    const { user, location, ...fields } = updates;
    console.log(user);


    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` in request body" },
            { status: 400 }
        );
    }

    // If they sent a location, but no coords array, drop it:
    if (location && !Array.isArray(location.coordinates)) {
        // nothing: we simply never set fields.location
    } else if (location) {
        fields.location = location;
    }

    const updated = await Reminder.findOneAndUpdate(
        { _id: params.id, user },
        fields,
        { new: true }
    );

    if (!updated) {
        return NextResponse.json(
            { error: "Not found or not authorized" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated);
}

// DELETE /api/reminders/:id
// body: { user }
export async function DELETE(request, { params }) {
    const { user } = await request.json();

    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` in request body" },
            { status: 400 }
        );
    }

    const deleted = await Reminder.findOneAndDelete({
        _id: params.id,
        user,
    });

    if (!deleted) {
        return NextResponse.json(
            { error: "Not found or not authorized" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Deleted" });
}
