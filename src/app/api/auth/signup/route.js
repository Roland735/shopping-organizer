import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { connectDB } from "../../../../../configs/dbConfig";
import User from "../../../../../models/User";

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        await connectDB();
        console.log("Received data:", { name, email, password });


        const existingUser = await User.findOne({ email });
        console.log("Existing user:", existingUser);

        if (existingUser)
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        console.log("Existing user:", existingUser);

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log("Hashed password:", hashedPassword);
        const user = new User({ name, email, password: hashedPassword });
        console.log("User object:", user);
        await user.save();
        console.log("User saved:", user);

        return NextResponse.json({ message: "User created successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Error creating user" }, { status: 500 });
    }
}
