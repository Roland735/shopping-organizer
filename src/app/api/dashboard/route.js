// app/api/dashboard/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../../configs/dbConfig";
import { Expense, Reminder, ShoppingList } from "../../../../models/models_shopping_organizer";

connectDB();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");
    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` query parameter" },
            { status: 400 }
        );
    }

    // fetch all three in parallel
    const [lists, expenses, reminders] = await Promise.all([
        ShoppingList.find({ user }).sort({ updatedAt: -1 }),
        Expense.find({ user }).sort({ date: -1 }),
        Reminder.find({ user }).sort({ date: 1 }),
    ]);

    return NextResponse.json({ lists, expenses, reminders });
}
