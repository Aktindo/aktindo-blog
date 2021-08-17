import React, { useState } from "react";

export interface BlogCategoriesProps {
  categories: string[];
  onTabClick?: (category: string) => void;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({
  categories,
  onTabClick,
}) => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="categories flex justify-center my-10">
      <div className="categories__tabs tabs tabs-boxed">
        <div
          className={`categories__tabs-tab tab tab-lg${
            activeCategory === 0 ? " tab-active" : ""
          }`}
          onClick={() => {
            onTabClick("all");
            setActiveCategory(0);
          }}
        >
          All
        </div>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`categories__tabs-tab tab tab-lg${
              activeCategory === index + 1 ? " tab-active" : ""
            }`}
            onClick={() => {
              onTabClick(category);
              setActiveCategory(index + 1);
            }}
          >
            {category[0].toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export { BlogCategories };
