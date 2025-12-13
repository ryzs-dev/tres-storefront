"use client"

import { useState, useEffect } from "react"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Label, Textarea, toast, Toaster, Select } from "@medusajs/ui"
import { Star, StarSolid } from "@medusajs/icons"
import { addProductReview } from "../../../../lib/data/products"

type BundleReviewsFormProps = {
  products: Array<{ id: string; title: string }>
}

export default function BundleReviewsForm({ products }: BundleReviewsFormProps) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (customer) {
      return
    }

    retrieveCustomer().then(setCustomer)
  }, [])

  if (!customer) {
    return <></>
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedProductId || !content || !rating) {
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
      product_id: selectedProductId,
    })
      .then(() => {
        setShowForm(false)
        setSelectedProductId("")
        setTitle("")
        setContent("")
        setRating(0)
        toast.success("Success", {
          description: "Your review has been submitted and is awaiting approval.",
        })
      })
      .catch(() => {
        toast.error("Error", {
          description: "An error occurred while submitting your review. Please try again later.",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="mt-12 pt-12 border-t border-ui-border-base">
      {!showForm && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Add a review
          </Button>
        </div>
      )}
      {showForm && (
        <div className="flex flex-col gap-y-4 max-w-2xl mx-auto">
          <div className="flex flex-col gap-y-2">
            <span className="text-xl-semi text-ui-fg-base">Add a review</span>
            <p className="text-sm-regular text-ui-fg-subtle">
              Share your experience with one of the products in this bundle.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="product">
                Product <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <Select.Trigger id="product">
                  <Select.Value placeholder="Select a product" />
                </Select.Trigger>
                <Select.Content>
                  {products.map((product) => (
                    <Select.Item key={product.id} value={product.id}>
                      {product.title}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

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
                  setSelectedProductId("")
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