"use client"

import { useState, useEffect } from "react"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Label, Textarea, toast, Toaster } from "@medusajs/ui"
import { Star, StarSolid } from "@medusajs/icons"
import { addProductReview } from "../../../../lib/data/products"

type ProductReviewsFormProps = {
  productId: string
}

export default function ProductReviewsForm({
  productId,
}: ProductReviewsFormProps) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (customer) {
      return
    }

    retrieveCustomer().then(setCustomer)
  }, [customer])

  if (!customer) {
    return <></>
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!content || !rating) {
      toast.error("Error", {
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsLoading(true)
    addProductReview({
      title,
      content,
      rating,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      product_id: productId,
    })
      .then(() => {
        setShowForm(false)
        setTitle("")
        setContent("")
        setRating(0)
        toast.success("Success", {
          description:
            "Your review has been submitted and is awaiting approval.",
        })
      })
      .catch(() => {
        toast.error("Error", {
          description:
            "An error occurred while submitting your review. Please try again later.",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div>
      {!showForm && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        </div>
      )}
      {showForm && (
        <div className="flex flex-col gap-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="rating">
                Rating <span className="text-rose-500">*</span>
              </Label>
              <div className="flex gap-x-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="transparent"
                    onClick={() => setRating(index + 1)}
                    className="p-0 hover:scale-110 transition-transform"
                  >
                    {rating >= index + 1 ? (
                      <StarSolid className="text-ui-tag-orange-icon w-6 h-6" />
                    ) : (
                      <Star className="w-6 h-6" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label htmlFor="content">
                Review <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={5}
              />
            </div>

            <div className="flex gap-x-3">
              <Button
                type="submit"
                disabled={isLoading}
                variant="primary"
                className="flex-1"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false)
                  setTitle("")
                  setContent("")
                  setRating(0)
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      <Toaster />
    </div>
  )
}
