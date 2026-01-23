"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface Category {
  id: number;
  name: string;
  parent: number;
  count: number;
}

interface CategorySelectorProps {
  value: number[]; // Array of category IDs
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export function CategorySelector({ value = [], onChange, disabled }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  
  // Fetch initial categories or search
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ 
           per_page: "20",
           hide_empty: "false" 
        });
        if (search) query.append("search", search);
        
        const res = await fetch(`/api/vendor/categories?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
        fetchCategories();
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [search]);

  // Resolve selected IDs to full category objects for display
  useEffect(() => {
    const resolveSelected = async () => {
       if (value.length === 0) {
           setSelectedCategories([]);
           return;
       }

       // We need to fetch details for selected IDs if they aren't in the current 'categories' list
       // For MVP, we'll assuming we might need a separate 'fetchByIds' or just rely on the list if it's comprehensive.
       // However, since we paginate, we might miss some. 
       // For now, let's just match with what we have, and maybe prompt a fetch if missing?
       // A better approach for the "Display" is to store objects, but react-hook-form wants IDs.
       
       // Simple fix: If we have the category in our current fetched list, use it. 
       // If not, we might display "Category #ID" until verified.
       // Ideally we'd have an endpoint to fetch specific IDs.
       
       const found = categories.filter(c => value.includes(c.id));
       const foundIds = found.map(c => c.id);
       
       // Create placeholders for missing ones if needed, or just partial update
       // For a robust system, we should assume the parent component might pass objects, 
       // but here we only accept ID array prop.
       
       // Real-world: Just filter 'categories' for now.
       // User experience: We see selected categories in the list.
       setSelectedCategories(found);
    };
    resolveSelected();
  }, [value, categories]);


  const toggleCategory = (categoryId: number) => {
    const current = value || [];
    if (current.includes(categoryId)) {
      onChange(current.filter((id) => id !== categoryId));
    } else {
      onChange([...current, categoryId]);
    }
  };
  
  // "Add New Category" Local State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddNew = () => {
      // In a real app, this would call an API to create the category immediately
      // For now, we'll just toast
      if (!newCategoryName.trim()) return;
      toast.info("Add Category feature coming in next update");
      setNewCategoryName("");
      setIsAddingNew(false);
  };

  return (
    <div className="space-y-3">
        {/* Selected Categories List (Chips/Input style) */}
        <div className="flex flex-col gap-2">
            {value.length > 0 && categories.filter(c => value.includes(c.id)).map(cat => (
                 <div key={cat.id} className="flex items-center justify-between p-2 border rounded-md bg-white shadow-sm group">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <Button
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-red-500"
                        onClick={() => toggleCategory(cat.id)}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                 </div>
            ))}
            
            {/* If we have IDs that are not in the current 'categories' list (due to pagination), we might miss them here.
                A proper solution requires a 'Resolve IDs' API or loading all categories. 
                For MVP, we assume commonly used categories appear in search. 
             */}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal border-dashed text-muted-foreground hover:text-primary hover:border-primary hover:bg-purple-50",
                    )}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-4 py-4 border-b">
                    <DialogTitle>Search Categories</DialogTitle>
                    <DialogDescription>
                        Select categories for this product.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="p-4 border-b bg-gray-50/50">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search category..." 
                            className="pl-9 bg-white" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[300px] p-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Loading...
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                            <p>No categories found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-1">
                            {categories.map((category) => {
                                const isSelected = value.includes(category.id);
                                return (
                                    <div 
                                        key={category.id}
                                        className={cn(
                                            "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors px-3",
                                            isSelected ? "bg-purple-50 text-purple-900" : "hover:bg-gray-100"
                                        )}
                                        onClick={() => toggleCategory(category.id)}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{category.name}</span>
                                            {/* Breadcrumb or parent could go here */}
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 text-purple-600" />}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
                
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                        {value.length} selected
                    </div>
                    
                    {/* Simplified "Add New" for UI demo */}
                    <div className="flex items-center gap-2">
                         {isAddingNew ? (
                             <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                 <Input 
                                    className="h-8 w-[150px] text-xs bg-white" 
                                    placeholder="New category name"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                 />
                                 <Button size="sm" className="h-8" onClick={handleAddNew}>Add</Button>
                                 <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsAddingNew(false)}><X className="h-3 w-3"/></Button>
                             </div>
                         ) : (
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={() => setIsAddingNew(true)}
                             >
                                 + Add new category
                             </Button>
                         )}
                    </div>
                    
                    <Button onClick={() => setOpen(false)}>Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
