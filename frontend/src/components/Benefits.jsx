
import { Truck, ShieldCheck, Headphones } from "lucide-react"
export default function Benefits() {
  return (
    <div className=" w-auto py-4 ">
        <div className="grid grid-cols-3 gap-4 px-4">
        <div className="border border-black rounded-md p-2 flex flex-col items-center justify-center">
        <div className="p-2 bg-gray-200 rounded-full "><Truck className="text-red-500" /></div>
        <div>
            <div className="font-bold">Free Shipping</div>
            <div className="text-sm text-gray-500">On orders over $50</div>
        </div>
        </div>
        <div className="border border-black rounded-md p-2 flex flex-col items-center justify-center">
        <div className="p-2 bg-gray-200 rounded-full "><ShieldCheck className="text-red-500" /></div>
        <div>
            <div className="font-bold">Secure Payment</div>
            <div className="text-sm text-gray-500">100% secure payment</div>
        </div>
        </div>
        <div className="border border-black rounded-md p-2 flex flex-col items-center justify-center">
        <div className="p-2 bg-gray-200 rounded-full "><Headphones  className="text-red-500" /></div>
        <div>
            <div className="font-bold">24/7 Support</div>
            <div className="text-sm text-gray-500">Dedicated customer support</div>
        </div>
        </div>

        </div>

    </div>
  )
}