import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetch(`https://exps-ecommercestore.onrender.com/api/cart/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        const total = data.reduce(
          (sum, item) =>
            sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
          0,
        );
        setGrandTotal(total);
      });
  }, [userId]);

  const deleteCartItem = async(cartId)=>{
    const confirmDelete=window.confirm("Are you sure you want to remove this item")
    if(!confirmDelete) return;
    try {
          const response = await fetch(`https://exps-ecommercestore.onrender.com/api/cart/delete/${cartId}/`, {
            method: "DELETE",
    
            headers: {
              "Content-Type": "application/json",
            },
  
          });
        
          if (response.status==200) {
            const updated= await fetch (`https://exps-ecommercestore.onrender.com/api/cart/${userId}` )
            const data =await updated.json();
            setCartItems(data);
            const total = data.reduce(
                (sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
          0,
        );
        setGrandTotal(total);

              
          
            
          } else {
            toast.error( "Something went wrong");
          }
        } catch (error) {
          toast.error("Unable to add item to cart");
        }
      };
      const setQuantity = async(cartId,newQty)=>{
    if(newQty<1) return;
    try {
          const response = await fetch("https://exps-ecommercestore.onrender.com/api/cart/update_quantity/", {
            method: "PUT",
    
            headers: {
              "Content-Type": "application/json",
            },
    
            body: JSON.stringify({
              cart_id: cartId,
              quantity: newQty
            }),
          });
    
          const result = await response.json();
    
          if (response.status==200) {
            const updated= await fetch (`https://exps-ecommercestore.onrender.com/api/cart/${userId}/` )
            const data =await updated.json();
            setCartItems(data);
            const total = data.reduce(
                (sum, item) => sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
          0,
        );
        setGrandTotal(total);

              
          
            
          } else {
            toast.error( "Something went wrong");
          }
        } catch (error) {
          toast.error("Unable to DELETE item to cart");
        }
      };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-stone-100 px-4 py-8 pb-24 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <ShoppingCart className="text-red-500" />
              Shopping Cart
            </h1>
          </div>
        </div>

        {/* CONTENT */}

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 text-center shadow-md">
            <ShoppingCart size={60} className="mb-4 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart.
            </p>

            <Link
              to="/products"
              className="mt-6 flex items-center gap-2 rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* PRODUCTS */}

            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                
                <div  key={item.id} className="rounded-2xl bg-white p-4 shadow-md sm:p-5">
                  <div className="flex gap-4">
                    {/* IMAGE */}

                    <Link className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-32">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link className="line-clamp-2 text-sm font-bold text-gray-900 hover:text-red-500 sm:text-base">
                          {item.product.name}
                        </Link>

                        <button
                          type="button"
                          className="flex shrink-0 items-center gap-2 rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
                          aria-label="Remove product"
                          onClick={() => deleteCartItem(item.id)}
                        >
                          <Trash2 size={18} />
                          Remove product
                        </button>
                      </div>

                      {/* PRICE */}

                      <div className="mt-2">
                        <span className="text-lg font-bold text-red-500">
                          ${item.product.price}
                        </span>
                      </div>

                      {/* QUANTITY */}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center overflow-hidden rounded-md border">
                          <button
                            type="button"
                            disabled={item.quantity <= 1}
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center hover:bg-gray-100 "
                          >
                            <Minus size={12} />
                          </button>

                          <span className="flex h-9 min-w-10 items-center justify-center border-x">
                            {item.quantity}
                          </span>

                          <button
                            disabled={item.quantity >=5}
                            type="button"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="text-right">
                          <p className="text-xs text-gray-400">Item Total</p>

                          <p className="text-base font-bold text-gray-900">
                            ${(Number(item.product.price) * Number(item.quantity)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-md sm:p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items</span>

                    <span>
                      {cartItems.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>

                    <span>${grandTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>

                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-red-500">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CHECKOUT */}

                <Link
                  to="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  Proceed to Checkout
                </Link>

                {/* CONTINUE */}

                <Link
                  to="/products"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <ArrowLeft size={17} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
