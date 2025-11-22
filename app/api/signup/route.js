import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect_db";

// Sanitize
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Validate
function validateForm(username, email, password) {
  const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message:
        "Username must be 3-20 characters long and contain only letters, numbers, dots, or underscores",
    };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email address" };
  }

  if (!passwordRegex.test(password)) {
    return {
      valid: false,
      message:
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character",
    };
  }

  return { valid: true };
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Sanitize input
    const username = sanitize(body.username);
    const email = sanitize(body.email);
    const password = sanitize(body.password);

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Missing username or email or password" },
        { status: 400 }
      );
    }

    // Validate form
    const validation = validateForm(username, email, password);
    if (!validation.valid) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const usersCollection = db.collection("users");

    // Check email
    const existingEmailUser = await usersCollection.findOne({ email });
    if (existingEmailUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Check username
    const existingUsernameUser = await usersCollection.findOne({ username });
    if (existingUsernameUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
