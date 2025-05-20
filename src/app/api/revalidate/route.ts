// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string

  if (!tags) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 })
  }

  const tagsArray = tags.split(",")
  for (const tag of tagsArray) {
    revalidateTag(tag)
  }

  return NextResponse.json({
    revalidated: true,
    message: `Revalidated tags: ${tagsArray.join(", ")}`,
  })
}
