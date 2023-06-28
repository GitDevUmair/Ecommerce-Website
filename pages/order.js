import React, { useEffect, useState } from "react";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { useRouter } from "next/router";
const MyOrder = ({ order, clearCart }) => {
  let router = useRouter();
  let products = order.products;
  const [date, setDate] = useState("");

  useEffect(() => {
    if (router.query.clearCart == 1) {
      clearCart();
    }
    const d = new Date(order.createdAt);
    setDate(d);
  }, []);

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-20 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              CODESWEAR.COM
            </h2>
            <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">
              Order Id: #{order.orderId}
            </h1>
            <p className="my-2">
              Yayy! Your Order has been placed Successfully!
            </p>
            <p className="my-2">
              Order placed on{" "}
              {date &&
                date.toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
            <p className="my-2">
              Your Order Status is{" "}
              <span className="text-slate-900">{order.status}</span>{" "}
            </p>
            <div className="flex mb-4">
              <a className="flex-grow text-center  py-2 text-lg px-1">
                Quantity
              </a>
              <a className="flex-grow text-center  py-2 text-lg px-1">
                Item Description
              </a>
              <a className="flex-grow text-center  py-2 text-lg px-1">
                Item Total
              </a>
            </div>

            {Object.keys(products).map((item) => {
              return (
                <div key={item} className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-500">
                    {products[item].name} ({products[item].size}/
                    {products[item].variant})
                  </span>
                  <span className="m-auto text-gray-900">
                    {products[item].qty}
                  </span>
                  <span className="m-auto text-gray-900">
                    {products[item].qty}x{products[item].price} = $
                    {products[item].price}
                  </span>
                </div>
              );
            })}

            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">
                Subtotal : ${order.amount}
              </span>
            </div>
            <div className="flex">
              <button className="flex  text-white bg-pink-500 border-0 my-3 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                Track Order
              </button>
            </div>
          </div>
          <img
            alt="ecommerce"
            className="lg:w-1/2 w-64 lg:h-auto h-64 object-cover object-center rounded"
            src="/tshirt.webp"
          />
        </div>
      </div>
    </section>
  );
};
export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect("mongodb://localhost:27017/codeswear");
  }
  console.log(context.query.id);
  let order = await Order.findById({ _id: context.query.id });

  return {
    props: {
      order: JSON.parse(JSON.stringify(order)),
    },
  };
}

export default MyOrder;
