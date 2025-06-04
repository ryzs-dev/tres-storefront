// pages/api/categories.ts
import { listCategories } from "@lib/data/categories"
import { NextResponse } from "next/server"

export default async function handler(res: NextResponse) {
  try {
    const categories = await listCategories()
    return NextResponse.json(categories, { status: 200 })
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
