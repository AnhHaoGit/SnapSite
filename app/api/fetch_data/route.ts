import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connectDB from "@/lib/connect_db";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    const db = await connectDB();
    const pagesCollection = db.collection("pages");

    const pages = await pagesCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { message: "Internal server error", error: message },
      { status: 500 }
    );
  }
}
