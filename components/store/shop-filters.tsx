"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { storePanelClass, storeTextMutedClass } from "@/components/store/store-ui";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    parent: { name: string } | null;
  }>;
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function applyFilters(newCategory: string, newSort: string, newSearch: string) {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newCategory && newCategory !== "all") params.set("category", newCategory);
    if (newSort && newSort !== "newest") params.set("sort", newSort);
    router.push(`/shop?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters(category, sort, search);
  }

  function handleCategoryChange(val: string) {
    setCategory(val);
    applyFilters(val, sort, search);
  }

  function handleSortChange(val: string) {
    setSort(val);
    applyFilters(category, val, search);
  }

  function clearFilters() {
    setCategory("all");
    setSort("newest");
    setSearch("");
    router.push("/shop");
  }

  const hasActiveFilters = category !== "all" || sort !== "newest" || search !== "";

  // Group categories by parent
  const groupedCategories = categories.reduce((acc, cat) => {
    const parentName = cat.parent?.name || "Other";
    if (!acc[parentName]) acc[parentName] = [];
    acc[parentName].push(cat);
    return acc;
  }, {} as Record<string, typeof categories>);

  return (
    <div className={`${storePanelClass} space-y-8`}>
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Input
          placeholder="Search dresses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background"
        />
        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", storeTextMutedClass)} />
      </form>

      {/* Sort */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-foreground uppercase tracking-wider">Sort By</h3>
        <RadioGroup value={sort} onValueChange={handleSortChange} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="sort-newest" />
            <Label htmlFor="sort-newest" className="text-sm font-normal cursor-pointer">Newest Arrivals</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-asc" id="sort-price-asc" />
            <Label htmlFor="sort-price-asc" className="text-sm font-normal cursor-pointer">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-desc" id="sort-price-desc" />
            <Label htmlFor="sort-price-desc" className="text-sm font-normal cursor-pointer">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="name" id="sort-name" />
            <Label htmlFor="sort-name" className="text-sm font-normal cursor-pointer">Name (A-Z)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-foreground uppercase tracking-wider">Categories</h3>
          <button 
            onClick={() => handleCategoryChange("all")}
            className={cn("text-xs font-medium transition-colors", category === "all" ? "text-primary" : cn(storeTextMutedClass, "hover:text-foreground"))}
          >
            All
          </button>
        </div>
        
        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([parentName, cats]) => (
            <div key={parentName} className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground">{parentName}</h4>
              <RadioGroup value={category} onValueChange={handleCategoryChange} className="space-y-2 pl-2">
                {cats.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={cat.slug} id={`cat-${cat.slug}`} />
                    <Label htmlFor={`cat-${cat.slug}`} className="text-sm font-normal cursor-pointer">
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="outline" 
          className="w-full text-muted-foreground" 
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
