import { createNextRouteHandler } from "uploadthing/next";
import { utapi } from "uploadthing/server"
import { ourFileRouter } from "./core";
import { NextRequest, NextResponse } from "next/server";

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});

export const DELETE = async (request: NextRequest) => {
  try {
    const body = await request.json();
    if (!body) return NextResponse.json({ message: "Invalid body!" }, { status: 400 });

    const res = await utapi.deleteFiles(body.fileName);

    return NextResponse.json({
      message: res.success ? "File deleted." : "Failed to delete file.",
      success: res.success
    }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}