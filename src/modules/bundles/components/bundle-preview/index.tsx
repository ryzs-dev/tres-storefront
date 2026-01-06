"use client"

import { getProductReviews } from "../../../../lib/data/products"
import { Star, StarSolid } from "@medusajs/icons"
import { StoreProductReview } from "../../../../types/global"
import { useState, useEffect } from "react"
import BundleReviewsForm from "@modules/products/components/product-reviews/form"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

// Import Swiper styles
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const reviewsPerProduct = 3

  // Flatten all reviews into a single array
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
          } catch (error) {
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
      setProductReviews(reviewsData.filter((data) => data.reviews.length > 0))
      setLoading(false)
    }

    fetchAllReviews()
  }, [products])

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.realIndex)
  }

  if (loading) {
    return (
      <div className="content-container my-16">
        <div className="flex justify-center items-center py-12">
          <p className="text-base-regular text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (allReviews.length === 0) {
    return null
  }

  return (
    <div className="content-container my-4">
      <div className="relative max-w-4xl mx-auto">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            el: ".swiper-pagination-custom",
            clickable: true,
            renderBullet: (index: number, className: string) => {
              return `<span class="${className}"></span>`
            },
          }}
          onSlideChange={handleSlideChange}
          className="reviews-swiper"
        >
          {allReviews.map((review, index) => (
            <SwiperSlide key={`${review.id}-${index}`}>
              <ReviewCard review={review} productTitle={review.productTitle} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-ui-border-base flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Previous review"
        >
          <svg
            className="w-6 h-6"
            style={{ color: "#99B2DD" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-ui-border-base flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Next review"
        >
          <svg
            className="w-6 h-6"
            style={{ color: "#99B2DD" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Custom Pagination Dots */}
        {/* <div className="swiper-pagination-custom flex justify-center gap-x-2 mt-8"></div> */}
      </div>

      <BundleReviewsForm products={products} />

      <style jsx global>{`
        .reviews-swiper {
          padding-bottom: 50px;
        }

        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
          border-radius: 9999px;
        }

        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 4px;
          background-color: #99b2dd;
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

function ReviewCard({
  review,
  productTitle,
}: {
  review: StoreProductReview
  productTitle: string
}) {
  return (
    <div className="flex flex-col gap-4 text-sm text-ui-fg-base p-4 border border-ui-border-base rounded-xl bg-white shadow-sm max-w-md mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-tres-secondary bg-tres-primary">
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
        <h3 className="text-sm font-semibold text-ui-fg-base">
          {review.title}
        </h3>
      )}

      <p className="text-sm text-ui-fg-subtle leading-snug">{review.content}</p>

      <div className="border-t border-ui-border-base pt-2 mt-2">
        <p className="text-xs font-semibold text-ui-fg-base">
          {review.first_name} {review.last_name}
        </p>
      </div>
    </div>
  )
}
