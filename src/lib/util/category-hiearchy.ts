export function getCategoryHierarchy(categories: any[]) {
  // Filter only parent categories
  const parents = categories
    .filter((cat) => !cat.parent_category_id)
    .sort((a, b) => a.rank - b.rank)

  return parents.map((parent) => ({
    ...parent,
    children: categories
      .filter((cat) => cat.parent_category_id === parent.id)
      .sort((a, b) => a.rank - b.rank),
  }))
}

export function getCategoryImage(category: any) {
  if (category.products?.length > 0) {
    return category.products[0].thumbnail
  }

  return "/placeholder-category.jpg"
}
