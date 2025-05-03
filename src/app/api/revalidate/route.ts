// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { getCacheTag } from "../../../lib/data/cookies"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string

  if (!tags) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 })
  }

  const tagsArray = tags.split(",")
  await Promise.all(
    tagsArray.map(async (tag) => {
      const cacheTag = await getCacheTag(tag)
      // revalidate cache for the tag
      revalidateTag(cacheTag)
    })
  )

  return NextResponse.json({ message: "Revalidated" }, { status: 200 })
}
