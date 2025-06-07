import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 space-y-6 animate-pulse transition-all duration-300">
      {/* Image skeleton with spinner */}
      <div className="relative h-64 bg-gray-100 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#f3f4f6_0%,#e5e7eb_50%,#f3f4f6_100%)] bg-[length:200%_100%]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-[5px] border-t-transparent border-gray-300 rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Product name shimmer */}
      <div className="h-4 w-3/4 bg-gray-200 rounded-full relative overflow-hidden mx-auto">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#f3f4f6_0%,#e5e7eb_50%,#f3f4f6_100%)] bg-[length:200%_100%]" />
      </div>

      {/* Price shimmer */}
      <div className="h-4 w-1/3 bg-gray-200 rounded-full relative overflow-hidden mx-auto">
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,#f3f4f6_0%,#e5e7eb_50%,#f3f4f6_100%)] bg-[length:200%_100%]" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;