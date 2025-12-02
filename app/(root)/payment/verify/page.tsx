import { Suspense } from "react";
import Client from "./client";

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center">
          <span className="loading loading-spinner text-blue-600 loading-xl"></span>
        </div>
      }
    >
      <Client />
    </Suspense>
  );
}
