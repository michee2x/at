"use client";

import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { CategoryReport } from "@/lib/actions/dashboard/categories-reports";

interface CategoryFilterProps {
    categories: CategoryReport[];
    onFilterChange: (mode: string, selectedCategories?: CategoryReport[]) => void;
    isLoading?: boolean;
}

export function CategoryFilter({ categories, onFilterChange, isLoading = false }: CategoryFilterProps) {
    const [filterMode, setFilterMode] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<CategoryReport[]>([]);

    const handleModeChange = (mode: string) => {
        setFilterMode(mode);
        setSearchQuery("");
        setSelectedCategories([]);
        onFilterChange(mode, []);
    };

    const filteredCategories = categories.filter(cat =>
        cat.extended_info.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategorySelect = (category: CategoryReport) => {
        if (filterMode === "single") {
            setSelectedCategories([category]);
            onFilterChange("single", [category]);
            setSearchQuery("");
        } else if (filterMode === "comparison") {
            if (!selectedCategories.find(c => c.category_id === category.category_id)) {
                setSelectedCategories([...selectedCategories, category]);
            }
            setSearchQuery("");
        }
    };

    const handleRemoveCategory = (categoryId: number) => {
        const newSelection = selectedCategories.filter(cat => cat.category_id !== categoryId);
        setSelectedCategories(newSelection);
        if (filterMode === "single") {
             onFilterChange(filterMode, newSelection);
        }
    };

    const handleCompare = () => {
        onFilterChange("comparison", selectedCategories);
    };

    const handleClearAll = () => {
        setSelectedCategories([]);
        onFilterChange("comparison", []);
    };

    return (
        <div className="mb-6">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-2">Show:</label>
                    <Select value={filterMode} onValueChange={handleModeChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            <SelectItem value="single">Single category</SelectItem>
                            <SelectItem value="comparison">Comparison</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filterMode !== "all" && (
                <div className="mt-4 p-4 border rounded-lg bg-white">
                    {filterMode === "comparison" && (
                       <h3 className="text-sm font-medium mb-3">Compare Categories</h3>
                    )}
                    
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={filterMode === "single" ? "Search categories..." : "Search categories to compare..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                        {searchQuery && filteredCategories.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredCategories
                                    .filter(cat => !selectedCategories.find(s => s.category_id === cat.category_id))
                                    .map(cat => (
                                        <button
                                            key={cat.category_id}
                                            onClick={() => handleCategorySelect(cat)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        >
                                            {cat.extended_info.name}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedCategories.map(cat => (
                                <div
                                    key={cat.category_id}
                                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                    <span>{cat.extended_info.name}</span>
                                    <button onClick={() => handleRemoveCategory(cat.category_id)} className="hover:text-red-500">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {filterMode === "comparison" && (
                        <div className="flex gap-4 mt-4">
                            <Button 
                                onClick={handleCompare} 
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                disabled={selectedCategories.length < 1 || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                        Comparing...
                                    </>
                                ) : (
                                    "Compare"
                                )}
                            </Button>
                            <Button 
                                variant="ghost" 
                                onClick={handleClearAll}
                                className="text-purple-600 hover:bg-purple-50"
                                disabled={isLoading}
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
