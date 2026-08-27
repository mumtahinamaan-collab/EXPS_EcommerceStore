import { Truck, ShieldCheck, Headphones } from "lucide-react";
export default function Benefits() {
  return (
    <div className="w-auto py-2 md:py-3 bg-white">
      <div className="grid grid-cols-3 gap-2 px-2 sm:gap-3 sm:px-4 md:gap-4">
        <div className="flex items-center justify-center gap-2 rounded-md border border-black p-2 md:gap-3 md:p-3">
          <div className="shrink-0 rounded-full bg-gray-200 p-1.5 md:p-2">
            <Truck className="h-5 w-5 text-red-500 md:h-6 md:w-6" />
          </div>{" "}
          <div>
            <div className="text-xs font-bold sm:text-sm md:text-base">
              Free Shipping
            </div>
            <div className="hidden text-sm text-gray-500 md:block">
              On orders over $50
            </div>{" "}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-md border border-black p-2 md:gap-3 md:p-3">
          <div className="shrink-0 rounded-full bg-gray-200 p-1.5 md:p-2 ">
            <ShieldCheck className="h-5 w-5 text-red-500 md:h-6 md:w-6" />
          </div>
          <div>
            <div className="text-xs font-bold sm:text-sm md:text-base">
              Secure Payment
            </div>
            <div className="hidden text-sm text-gray-500 md:block">
              100% secure payment
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-md border border-black p-2 md:gap-3 md:p-3">
          <div className="shrink-0 rounded-full bg-gray-200 p-1.5 md:p-2 ">
            <Headphones className="h-5 w-5 text-red-500 md:h-6 md:w-6" />
          </div>
          <div>
            <div className="text-xs font-bold sm:text-sm md:text-base">
              24/7 Support
            </div>
            <div className="hidden text-sm text-gray-500 md:block">
              Dedicated customer support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
