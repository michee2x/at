import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ 
  items, 
  className,
  showHome = true 
}: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-gray-500 mb-4", className)}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {showHome && (
          <li className="flex items-center gap-1.5">
            <Link 
              href="/" 
              className="flex gap-1 items-center hover:text-[#6a00f3] capitalize transition-colors"
              aria-label="Home"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </li>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {isLast ? (
                <span 
                  className="font-medium text-gray-900" 
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link 
                    href={item.href || "#"} 
                    className="hover:text-[#6a00f3] transition-colors"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
