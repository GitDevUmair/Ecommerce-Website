import React from "react";
import Link from "next/link";
import Product from "@/models/Product";
import mongoose from "mongoose";
const Hoodies = ({ products }) => {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap min-h-screen -m-4 justify-center mx-5">
            {Object.keys(products).length == 0 && (
              <p>
                All the hoods are out of stock currently.New stock coming soon.
                Stay tuned.Sorry for the inconvenience!
              </p>
            )}
            {Object.keys(products).map((item) => {
              return (
                <div
                  key={products[item]._id}
                  className="lg:w-1/5 md:w-1/2 p-4 w-full shadow-lg  mx-5"
                >
                  <Link href={`/product/${products[item].slug}`}>
                    {" "}
                    <span className="block relative rounded overflow-hidden">
                      {" "}
                      <img
                        alt="ecommerce"
                        className="h-[35vh] m-auto md:h-[45vh]   block"
                        src={products[item].img}
                      />
                    </span>
                  </Link>
                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                      Hoodies
                    </h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      {products[item].title}
                    </h2>
                    <p className="mt-1">${products[item].price}</p>
                    <div className="mt-1 flex space-x-2">
                      {products[item].size.includes("S") && (
                        <span className="border border-gray-300 px-1 py-1 text-sm">
                          S
                        </span>
                      )}
                      {products[item].size.includes("M") && (
                        <span className="border border-gray-300 px-1 py-1 text-sm">
                          M
                        </span>
                      )}
                      {products[item].size.includes("L") && (
                        <span className="border border-gray-300 px-1 py-1 text-sm">
                          L
                        </span>
                      )}
                      {products[item].size.includes("XL") && (
                        <span className="border border-gray-300 px-1 py-1 text-sm">
                          XL
                        </span>
                      )}
                      {products[item].size.includes("XXL") && (
                        <span className="border border-gray-300 px-1 py-1 text-sm">
                          XXL
                        </span>
                      )}
                    </div>
                    <div className="flex mt-2">
                      {products[item].color.includes("red") && (
                        <button className="border-2 mx-0.5 border-red-300 bg-red-700 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("blue") && (
                        <button className="border-2 mx-0.5 border-blue-300 bg-blue-700 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("yellow") && (
                        <button className="border-2 mx-0.5 border-yellow-300 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("green") && (
                        <button className="border-2 mx-0.5 border-green-300 bg-green-700 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                      {products[item].color.includes("purple") && (
                        <button className="border-2 mx-0.5 border-purple-300 bg-purple-700 rounded-full w-6 h-6 focus:outline-none"></button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  let products = await Product.find({ category: "hoodie" });
  let hoodies = {};
  for (let item of products) {
    if (item.title in hoodies) {
      if (
        !hoodies[item.title].color.includes(item.color) &&
        item.availableQty > 0
      ) {
        hoodies[item.title].color.push(item.color);
      }
      if (
        !hoodies[item.title].size.includes(item.size) &&
        item.availableQty > 0
      ) {
        hoodies[item.title].size.push(item.size);
      }
    } else {
      hoodies[item.title] = JSON.parse(JSON.stringify(item));
      if (item.availableQty > 0) {
        hoodies[item.title].size = [item.size];
        hoodies[item.title].color = [item.color];
      }
    }
  }
  return {
    props: { products: JSON.parse(JSON.stringify(hoodies)) },
  };
}

export default Hoodies;
