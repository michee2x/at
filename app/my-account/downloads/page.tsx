import { Suspense } from "react";
import { getDownloads, type Download } from "@/lib/actions/dashboard/downloads";
import AtlazeLoader from "@/components/lottie/AtlazeLoader";
import Link from "next/link";

function DownloadsSkeleton() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-28 h-28">
        <AtlazeLoader />
      </div>
    </div>
  );
}

function formatExpires(dateStr: string) {
  if (!dateStr || dateStr === "never" || dateStr === "N/A") return "Never";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DownloadsTable({ downloads }: { downloads: Download[] }) {
  if (!downloads.length) {
    return (
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-base font-medium text-gray-900 mb-2">
          You have no available downloads yet
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Once you purchase a digital product, your active download links will
          appear here.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-[#6a00f3] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a00d0] transition"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                File
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Downloads left
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Expires
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {downloads.map((item) => {
              const remaining =
                item.downloads_remaining === "" ||
                item.downloads_remaining === "0"
                  ? "0"
                  : item.downloads_remaining === "∞"
                  ? "Unlimited"
                  : item.downloads_remaining;

              const isExpired =
                !!item.access_expires &&
                item.access_expires !== "never" &&
                new Date(item.access_expires).getTime() < Date.now();

              return (
                <tr key={item.download_id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">
                        {item.product_name || item.download_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{item.product_id}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="text-sm text-gray-700">
                      {item.download_name}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {remaining}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span className="text-sm text-gray-700">
                      {formatExpires(item.access_expires)}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-right">
                    <a
                      href={item.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        isExpired
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-[#6a00f3] text-white hover:bg-[#5a00d0]"
                      }`}
                      aria-disabled={isExpired}
                      onClick={(e) => {
                        if (isExpired) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {isExpired ? "Expired" : "Download"}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function DownloadsContent() {
  const downloads = await getDownloads();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Downloads</h1>
        <p className="mt-1 text-sm text-gray-600">
          Any digital products you&apos;ve purchased will be available to
          download here.
        </p>
      </div>

      <DownloadsTable downloads={downloads} />
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <Suspense fallback={<DownloadsSkeleton />}>
      <DownloadsContent />
    </Suspense>
  );
}
