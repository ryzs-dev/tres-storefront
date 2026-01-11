"use client"

import { getProductReviews } from "../../../../lib/data/products"
import { Star, StarSolid } from "@medusajs/icons"
import { StoreProductReview } from "../../../../types/global"
import { useState, useEffect } from "react"
import BundleReviewsForm from "@modules/products/components/product-reviews/form"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

type BundleProductReviewsProps = {
  products: Array<{ id: string; title: string }>
}

type ProductReviewsData = {
  productId: string
  productTitle: string
  reviews: StoreProductReview[]
  averageRating: number
  totalCount: number
}

type ReviewWithProduct = StoreProductReview & {
  productTitle: string
}

export default function BundleProductReviews({
  products,
}: BundleProductReviewsProps) {
  const [productReviews, setProductReviews] = useState<ProductReviewsData[]>([])
  const [loading, setLoading] = useState(true)
  const reviewsPerProduct = 3

  const allReviews: ReviewWithProduct[] = productReviews.flatMap(
    (productData) =>
      productData.reviews.map((review) => ({
        ...review,
        productTitle: productData.productTitle,
      }))
  )

  useEffect(() => {
    const fetchAllReviews = async () => {
      const reviewsData = await Promise.all(
        products.map(async (product) => {
          try {
            const { reviews, average_rating, count } = await getProductReviews({
              productId: product.id,
              limit: reviewsPerProduct,
              offset: 0,
            })

            return {
              productId: product.id,
              productTitle: product.title,
              reviews: reviews.slice(0, reviewsPerProduct),
              averageRating: Math.round(average_rating),
              totalCount: count,
            }
          } catch {
            return {
              productId: product.id,
              productTitle: product.title,
              reviews: [],
              averageRating: 0,
              totalCount: 0,
            }
          }
        })
      )

      setProductReviews(reviewsData.filter((d) => d.reviews.length > 0))
      setLoading(false)
    }

    fetchAllReviews()
  }, [products])

  if (loading) {
    return (
      <div className="content-container py-16 text-center text-ui-fg-subtle">
        Loading reviews…
      </div>
    )
  }

  const hasReviews = allReviews.length > 0

  return (
    <div className="content-container my-12 space-y-16">
      {/* ================= Reviews Section ================= */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold text-ui-fg-base">
            Customer Reviews
          </h2>
          <p className="text-sm text-ui-fg-subtle">
            What customers say about this bundle
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {hasReviews ? (
            <>
              <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={1}
                spaceBetween={30}
                loop
                navigation={{
                  prevEl: ".swiper-button-prev-custom",
                  nextEl: ".swiper-button-next-custom",
                }}
                className="reviews-swiper"
              >
                {allReviews.map((review, index) => (
                  <SwiperSlide key={`${review.id}-${index}`}>
                    <ReviewCard
                      review={review}
                      productTitle={review.productTitle}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <NavButton direction="prev" />
              <NavButton direction="next" />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {/* ================= Divider ================= */}
      <div className="border-t border-ui-border-base max-w-3xl mx-auto" />

      {/* ================= Review Form Section ================= */}
      <section className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-ui-fg-base">
            Write a Review
          </h2>
          <p className="text-sm text-ui-fg-subtle">
            Share your experience with this bundle
          </p>
        </div>

        <BundleReviewsForm products={products} />
      </section>

      <style jsx global>{`
        .reviews-swiper {
          padding-bottom: 40px;
        }

        @media (max-width: 640px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

/* ================= Subcomponents ================= */

function ReviewCard({
  review,
  productTitle,
}: {
  review: StoreProductReview
  productTitle: string
}) {
  return (
    <div className="mx-auto max-w-md bg-white border border-ui-border-base rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-tres-primary text-tres-secondary">
          {productTitle}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) =>
            i < review.rating ? (
              <StarSolid key={i} className="w-4 h-4 text-tres-primary" />
            ) : (
              <Star key={i} className="w-4 h-4 text-tres-primary" />
            )
          )}
        </div>
      </div>

      {review.title && (
        <h3 className="font-semibold text-ui-fg-base">{review.title}</h3>
      )}

      <p className="text-sm text-ui-fg-subtle">{review.content}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-ui-border-base rounded-xl bg-ui-bg-subtle">
      <p className="text-sm text-ui-fg-subtle">
        No reviews yet. Be the first to share your experience!
      </p>
    </div>
  )
}

function NavButton({ direction }: { direction: "prev" | "next" }) {
  const isPrev = direction === "prev"

  return (
    <button
      className={`swiper-button-${direction}-custom absolute top-1/2 -translate-y-1/2 ${
        isPrev ? "-left-4" : "-right-4"
      } z-10 w-8 h-8 rounded-full bg-white shadow border border-ui-border-base flex items-center justify-center`}
    >
      <svg
        className="w-5 h-5 text-tres-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isPrev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  )
}
