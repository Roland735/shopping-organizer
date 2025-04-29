import { NextResponse } from "next/server";
import { connectDB } from "../../../../configs/dbConfig";
import { Expense } from "../../../../models/models_shopping_organizer";

connectDB();

// GET /api/expenses?user=<userId>
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user");
    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` query parameter" },
            { status: 400 }
        );
    }

    const expenses = await Expense.find({ user }).sort({ date: -1 });
    return NextResponse.json(expenses);
}

// POST /api/expenses
// body: { user, itemName, amount, … }
export async function POST(request) {
    const data = await request.json();
    const {
        user,
        itemName,
        amount,
        currency = "USD",
        date = new Date(),
        category = "",
        list,
        paymentMethod = "",
        notes = "",
    } = data;

    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` in request body" },
            { status: 400 }
        );
    }
    if (!itemName) {
        return NextResponse.json(
            { error: "Missing `itemName`" },
            { status: 400 }
        );
    }
    if (amount == null) {
        return NextResponse.json(
            { error: "Missing or invalid `amount`" },
            { status: 400 }
        );
    }

    const doc = {
        user,
        itemName,
        amount,
        currency,
        date,
        category,
        list,
        paymentMethod,
        notes,
    };

    const expense = await Expense.create(doc);
    return NextResponse.json(expense, { status: 201 });
}
