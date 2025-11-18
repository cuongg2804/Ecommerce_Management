export function categoryBlogTree (categories: any, parentId: String = "") {
  const currentLevelCategory = categories.filter((category: any) => category.parent == parentId);
  
  const tree = currentLevelCategory.map((category: any) => {
    const children = categoryBlogTree(categories, category.id);

    return {
      id : category.id,
      name: category.name,
      children: children
    }
  })

  return tree;
}