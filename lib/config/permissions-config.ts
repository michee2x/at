// Permission categories and their capabilities configuration
export interface PermissionItem {
  key: string;
  label: string;
}

export interface PermissionCategory {
  id: string;
  title: string;
  permissions: PermissionItem[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "overview",
    title: "Overview",
    permissions: [
      { key: "dokan_view_sales_overview", label: "View sales overview" },
      { key: "dokan_view_sales_report_chart", label: "View sales report chart" },
      { key: "dokan_view_order_report", label: "View order report" },
      { key: "dokan_view_review_reports", label: "View review reports" },
      { key: "dokan_view_product_status_report", label: "View product status report" },
    ],
  },
  {
    id: "report",
    title: "Report",
    permissions: [
      { key: "dokan_view_sales_overview", label: "View sales overview report" },
      { key: "dokan_view_sales_report_chart", label: "View sales report chart" },
      { key: "dokan_view_order_report", label: "View order report" },
    ],
  },
  {
    id: "order",
    title: "Order",
    permissions: [
      { key: "dokan_view_order", label: "View order" },
      { key: "dokan_manage_order", label: "Manage order" },
      { key: "dokan_manage_order_note", label: "Manage order note" },
      { key: "dokan_export_order", label: "Export order" },
    ],
  },
  {
    id: "coupon",
    title: "Coupon",
    permissions: [
      { key: "dokan_add_coupon", label: "Add coupon" },
      { key: "dokan_edit_coupon", label: "Edit coupon" },
      { key: "dokan_delete_coupon", label: "Delete coupon" },
    ],
  },
  {
    id: "review",
    title: "Review",
    permissions: [
      { key: "dokan_view_review_menu", label: "View reviews" },
      { key: "dokan_manage_reviews", label: "Manage reviews" },
    ],
  },
  {
    id: "withdraw",
    title: "Withdraw",
    permissions: [
      { key: "dokan_manage_withdraw", label: "Manage withdraw" },
    ],
  },
  {
    id: "product",
    title: "Product",
    permissions: [
      { key: "dokan_add_product", label: "Add product" },
      { key: "dokan_edit_product", label: "Edit product" },
      { key: "dokan_delete_product", label: "Delete product" },
      { key: "dokan_view_product", label: "View product" },
      { key: "dokan_duplicate_product", label: "Duplicate product" },
      { key: "dokan_import_product", label: "Import product" },
      { key: "dokan_export_product", label: "Export product" },
    ],
  },
  {
    id: "menu",
    title: "Menu",
    permissions: [
      { key: "dokan_view_overview_menu", label: "View overview menu" },
      { key: "dokan_view_product_menu", label: "View product menu" },
      { key: "dokan_view_order_menu", label: "View order menu" },
      { key: "dokan_view_review_menu", label: "View review menu" },
      { key: "dokan_view_store_settings_menu", label: "View store settings menu" },
      { key: "dokan_view_store_shipping_menu", label: "View store shipping menu" },
      { key: "dokan_view_store_social_menu", label: "View store social menu" },
      { key: "dokan_view_store_seo_menu", label: "View store SEO menu" },
    ],
  },
  {
    id: "store_support",
    title: "Store Support",
    permissions: [
      { key: "dokan_manage_support_tickets", label: "Manage support tickets" },
    ],
  },
];
