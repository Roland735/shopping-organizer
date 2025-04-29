import { NextResponse } from "next/server";
import { connectDB } from "../../../../configs/dbConfig";
import { Reminder } from "../../../../models/models_shopping_organizer";

connectDB();

// GET /api/reminders?user=<userId>
export async function GET(request) {
    const url = new URL(request.url);
    const user = url.searchParams.get("user");

    if (!user) {
        return NextResponse.json(
            { error: "Missing `user` query parameter" },
            { status: 400 }
        );
    }

    console.log(user);

    const reminders = await Reminder.find({ user }).sort({ date: 1 });
    return NextResponse.json(reminders);
}

// POST /api/reminders
// body: { user, title, date, description?, recurring?, location?, … }
export async function POST(request) {
    const data = await request.json();
    console.log(data);


    if (!data.user) {
        return NextResponse.json(
            { error: "Missing `user` in request body" },
            { status: 400 }
        );
    }


    // Strip out invalid geo docs:
    if (data.location && !Array.isArray(data.location.coordinates)) {
        delete data.location;
    }

    const reminder = await Reminder.create(data);
    return NextResponse.json(reminder, { status: 201 });
}
