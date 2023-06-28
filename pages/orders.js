import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
const orders = () => {
  const [orders, setOrders] = useState();
  const router = useRouter();
  useEffect(() => {
    async function postJSON(data) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/myorders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        setOrders(result.orders);
        console.log(result);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const data = {
      token: JSON.parse(localStorage.getItem("myuser")).token,
    };
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      postJSON(data);
    }
  }, []);
  return (
    <div className="container m-auto  min-h-screen">
      <h1 className="text-center font-bold text-2xl p-3">My Orders</h1>
      <table className="table-auto border-2 shadow-lg mt-8 text-center ml-2 ">
        <thead>
          <tr>
            <th className="md:px-20 px-2 py-2"># OrderID</th>
            <th className="md:px-20 px-2 py-2">Email</th>
            <th className="md:px-20 px-2 py-2">Amount</th>
            <th className="md:px-20 px-2 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) &&
            orders.map((item) => {
              return (
                <tr key={item._id}>
                  <td className="md:px-20 px-2 py-2">{item.orderId}</td>
                  <td className="md:px-20 px-2 py-2">{item.email}</td>
                  <td className="md:px-20 px-2 py-2">{item.amount}</td>
                  <Link href={"/order?id=" + item._id}>
                    {" "}
                    <td className="px-20 py-2 cursor-pointer">Details</td>{" "}
                  </Link>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default orders;
