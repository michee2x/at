export default function OrderSummarySkeleton() {
  return (
    <div className="lg:w-[463px] w-full border-[1.28px] rounded-[10.23px] p-[12.79px] border-[#F5F5F5] h-[481px] animate-pulse">
      <div className="h-6 w-40 bg-gray-300 rounded"></div>

      <div className="flex flex-col gap-4 mt-6">
        {/* 4 summary rows */}
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="flex justify-between items-center h-[55px] border-y-[1.28px] border-[#EFEFEF] py-[15.35px]"
          >
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-between items-center h-[55px] border-y-[1.28px] border-[#EFEFEF] py-[15.35px]">
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="h-4 w-56 bg-gray-300 rounded mx-auto"></div>
        <div className="h-3 w-full bg-gray-300 rounded"></div>
        <div className="h-12 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
