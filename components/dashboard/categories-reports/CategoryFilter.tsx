"use client";

import { useState } from "react";
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
}

export function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
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
            const newSelection = [...selectedCategories, category];
            setSelectedCategories(newSelection);
            onFilterChange("comparison", newSelection);
            setSearchQuery("");
        }
    };

    const handleRemoveCategory = (categoryId: number) => {
        const newSelection = selectedCategories.filter(cat => cat.category_id !== categoryId);
        setSelectedCategories(newSelection);
        onFilterChange(filterMode, newSelection);
    };

    return (
        <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Show:</label>
            <Select value={filterMode} onValueChange={handleModeChange}>
                <SelectTrigger className="w-64">
                    <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="single">Single category</SelectItem>
                    <SelectItem value="comparison">Comparison</SelectItem>
                </SelectContent>
            </Select>

            {filterMode === "single" && (
                <div className="mt-4">
                    {selectedCategories.length === 0 ? (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                            {searchQuery && filteredCategories.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredCategories.map(cat => (
                                        <button
                                            key={cat.category_id}
                                            onClick={() => handleCategorySelect(cat)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            {cat.extended_info.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 p-2 bg-purple-50 border border-purple-200 rounded">
                            <span className="text-sm">{selectedCategories[0].extended_info.name}</span>
                            <button
                                onClick={() => handleRemoveCategory(selectedCategories[0].category_id)}
                                className="ml-auto"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {filterMode === "comparison" && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Compare Categories</h3>
                    
                    {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedCategories.map(cat => (
                                <div
                                    key={cat.category_id}
                                    className="flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded"
                                >
                                    <span className="text-sm">{cat.extended_info.name}</span>
                                    <button onClick={() => handleRemoveCategory(cat.category_id)}>
                                        <X className="h-3 w-3 text-gray-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search categories to compare..."
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
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            {cat.extended_info.name}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
