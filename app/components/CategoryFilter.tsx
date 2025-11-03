"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Filter, X } from "lucide-react";

const CATEGORIES = ["Web Dev", "Mobile", "ML/AI", "DevOps", "Game Dev", "Other"];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get("category");

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryClick = (category: string) => {
    const isSelected = currentCategory === category;
    const queryString = createQueryString(
      "category",
      isSelected ? null : category
    );
    router.push(`${pathname}?${queryString}`);
  };

  const clearFilter = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#58a6ff]" />
        <h3 className="text-lg font-semibold text-[#c9d1d9]">Filter by Category</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-md transition-colors font-medium text-sm ${
              currentCategory === category
                ? "bg-[#238636] text-white shadow-lg"
                : "bg-[#21262d] text-[#8b949e] hover:bg-[#30363d] hover:text-[#c9d1d9]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {currentCategory && (
        <button
          onClick={clearFilter}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
        >
          <X className="w-4 h-4" />
          Clear filter
        </button>
      )}
    </div>
  );
}