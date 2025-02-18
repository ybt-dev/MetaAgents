import { ComponentType } from 'react';

export interface CategoryListItemProps<CategoryId> {
  categoryId: CategoryId;
  categoryName: string;
  onSelect(category: CategoryId): void;
  isSelected: boolean;
  Icon: ComponentType<{ className: string }>;
}

const CategoryListItem = <CategoryId,>({
  categoryName,
  categoryId,
  onSelect,
  isSelected,
  Icon,
}: CategoryListItemProps<CategoryId>) => {
  return (
    <li
      onClick={() => onSelect(categoryId)}
      className={`group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon className="h-5 w-5" />
      {categoryName}
    </li>
  );
};

export default CategoryListItem;
