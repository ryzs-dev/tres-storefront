import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 24

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  tags?: string[]
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
    ...(collectionId && { collection_id: [collectionId] }),
    ...(categoryId && { category_id: [categoryId] }),
    ...(productsIds && { id: productsIds }),
    ...(sortBy === "created_at" && { order: "created_at" }),
    // Do not include tags in queryParams
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  console.log("PaginatedProducts - products:", products)

  const filteredProducts = products.filter((p) =>
    p.tags?.some((tag) => tag.value === "sets")
  )

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <div>
        <ul
          className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
          data-testid="products-list"
        >
          {filteredProducts.length === 0 ? (
            <div data-testid="no-products">No products found</div>
          ) : (
            filteredProducts.map((p) => (
              <li key={p.id}>
                <ProductPreview product={p} region={region} />
              </li>
            ))
          )}
        </ul>
        {totalPages > 1 && (
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  )
}
