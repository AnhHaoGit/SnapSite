import { NextResponse } from "next/server";
import connectDB from "@/lib/connect_db";
import { ObjectId } from "mongodb";

interface PageBody {
  title: string;
  userId: string;
}

export async function POST(req: Request) {
  try {
    const body: PageBody = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { message: "Missing title or userId" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const pagesCollection = db.collection("pages");

    const result = await pagesCollection.insertOne({
      title: "",
      userId: new ObjectId(body.userId),
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Page created", pageId: result.insertedId },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
