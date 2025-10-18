import { useCategory } from "@/contexts/category-context";
import { WooCategory } from "@/types";

export const useCatWithIimage = () => {
    const {categories} = useCategory()
    const catsWithImage = categories.filter(cat => cat.image?.src)
    return {catsWithImage}
}