import { NextResponse } from "next/server";
import { connectDB } from "../../../../../configs/dbConfig";
import { Expense } from "../../../../../models/models_shopping_organizer";

connectDB();

// PUT /api/expenses/:id
// body: { user, itemName?, amount?, … }
export async function PUT(request, { params }) {
    const data = await request.json();
    const { user, ...fields } = data;

    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` in request body" },
            { status: 400 }
        );
    }

    const updated = await Expense.findOneAndUpdate(
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

// DELETE /api/expenses/:id
// body: { user }
export async function DELETE(request, { params }) {
    const { user } = await request.json();
    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` in request body" },
            { status: 400 }
        );
    }

    const deleted = await Expense.findOneAndDelete({ _id: params.id, user });
    if (!deleted) {
        return NextResponse.json(
            { error: "Not found or not authorized" },
            { status: 404 }
        );
    }
    return NextResponse.json({ message: "Deleted" });
}
