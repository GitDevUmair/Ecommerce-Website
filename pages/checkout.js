import React, { useEffect, useState } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
const Checkout = ({ cart, addToCart, removeFromCart, clearCart, subTotal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [oid, setOid] = useState("");
  const [user, setUser] = useState({ value: null });
  const router = useRouter();
  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("myuser"));
    if (User && User.token) {
      setUser({ value: User.token, email: User.email });
      setEmail(User.email);
      fetchData(User.token);
    }
  }, []);
  useEffect(() => {
    if (
      name.length > 3 &&
      email.length > 3 &&
      address.length > 3 &&
      phone.length > 3 &&
      pincode.length > 3
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [phone, name, email, address, pincode]);
  const checkPincode = async (pin) => {
    let Pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    let pinsJson = await Pins.json();

    if (Object.keys(pinsJson).includes(pin)) {
      setCity(pinsJson[pin][0]);
      setProvince(pinsJson[pin][1]);
    } else {
      setCity("");
      setProvince("");
    }
  };
  const fetchData = async (token) => {
    async function postJSON(data) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        setName(result.name);
        setAddress(result.address);
        setPincode(result.pincode);
        setPhone(result.phone);
        checkPincode(result.pincode);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const newData = { token: token };
    postJSON(newData);
  };
  const handleConfirmation = async () => {
    setConfirm(false);
    setName("");
    setPhone("");
    setAddress("");
    setPincode("");
    setCity("");
    setProvince("");
    async function postJSON(data) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        if (result.success) {
          router.push(`/order?id=${result.id}&clearCart=1`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const data = { oid };
    postJSON(data);
  };
  const handlePayment = () => {
    const newOid = Math.ceil(Math.random() * Date.now());
    setOid(newOid);
    async function postJSON(data) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        if (result.success) {
          setConfirm(true);
        } else {
          console.error(result.error);
          if (result.cartClear) {
            clearCart();
          }

          toast.error(result.error, {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const data = {
      cart,
      subTotal,
      oid: newOid,
      name,
      province,
      email,
      address,
      phone,
      pincode,
      city,
    };
    postJSON(data);
  };

  const handleChange = async (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "address") {
      setAddress(e.target.value);
    } else if (e.target.name === "phone") {
      setPhone(e.target.value);
    } else if (e.target.name === "pincode") {
      setPincode(e.target.value);
      if (e.target.value.length === 5) {
        checkPincode(e.target.value);
      }
    }
  };

  return (
    <div className="container px-2 sm:m-auto">
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Head>
        <title>Checkout - Codeswear.com</title>
      </Head>
      <h1 className="font-bold text-center my-4 text-3xl">Checkout</h1>
      <h2 className="font-xl font-semibold">1. Delivery Details</h2>
      <div className="mx-auto flex my-2">
        <div className="mb-2 w-1/2 mx-3">
          <label
            htmlFor="name"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            Name
          </label>
          <input
            value={name}
            onChange={handleChange}
            type="text"
            id="name"
            name="name"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="mb-2 w-1/2">
          <label
            htmlFor="email"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            Email
          </label>
          {user && user.email ? (
            <input
              value={email}
              type="text"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              readOnly
            />
          ) : (
            <input
              value={email}
              onChange={handleChange}
              type="text"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          )}
        </div>
      </div>
      <div className="mb-2 w-full mx-3">
        <label
          htmlFor="address"
          className="leading-7 font-semibold text-sm text-gray-600"
        >
          Address
        </label>
        <textarea
          value={address}
          onChange={handleChange}
          type="text"
          id="address"
          name="address"
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        />
      </div>
      <div className="mx-auto flex my-2">
        <div className="mb-2 w-1/2 mx-3">
          <label
            htmlFor="phone"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            Your Phone
          </label>
          <input
            placeholder="Your 10 digit phone number"
            value={phone}
            onChange={handleChange}
            type="text"
            id="phone"
            name="phone"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="mb-2 w-1/2">
          <label
            htmlFor="pincode"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            PinCode
          </label>
          <input
            placeholder="Your 5 digit pincode"
            value={pincode}
            onChange={handleChange}
            type="text"
            id="pincode"
            name="pincode"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <div className="mx-auto flex my-2">
        <div className="mb-2 w-1/2 mx-3">
          <label
            htmlFor="province"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            Province
          </label>
          <input
            value={province}
            onChange={handleChange}
            type="text"
            id="province"
            name="province"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="mb-2 w-1/2">
          <label
            htmlFor="city"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            City
          </label>
          <input
            value={city}
            onChange={handleChange}
            type="text"
            id="city"
            name="city"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <h2 className="font-xl font-semibold">2. Review Cart Items</h2>
      <div className="sideCart py-6  px-8 bg-pink-100 ">
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && (
            <div className="my-2 text-center">No items in the Cart !</div>
          )}

          {Object.keys(cart).map((k) => {
            return (
              <li key={k}>
                <div className="item flex my-5 ">
                  <div className="font-semibold ">
                    {cart[k].name}({cart[k].size}/{cart[k].variant})
                  </div>
                  <div className="font-semibold w-1/3 flex items-center justify-center">
                    {" "}
                    <AiFillMinusCircle
                      className="text-xl text-pink-500 cursor-pointer"
                      onClick={() => {
                        removeFromCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant
                        );
                      }}
                    />
                    <span className="font-bold mx-1">{cart[k].qty}</span>
                    <AiFillPlusCircle
                      className="text-xl text-pink-500 cursor-pointer"
                      onClick={() => {
                        addToCart(
                          k,
                          1,
                          cart[k].price,
                          cart[k].name,
                          cart[k].size,
                          cart[k].variant
                        );
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="font-bold my-4 ">Subtotal : {subTotal}</div>
      </div>
      <div className="my-2 mx-2">
        <button
          onClick={handlePayment}
          disabled={disabled}
          className="flex text-white text-md bg-pink-600 disabled:bg-pink-300 border-0 py-2 px-3 focus:outline-none hover:bg-pink-600 rounded "
        >
          <BsFillBagCheckFill className="mr-1 mt-1" /> Pay ${subTotal}
        </button>
      </div>
      {confirm && (
        <div className="confirmation p-5 mx-40 rounded-md absolute top-80 left-80 border-2 shadow-lg border-gray-100 bg-white  w-80 h-40">
          <p className="text-xl font-semibold">Please Confirm your Payment!</p>
          <div className="flex mt-5">
            <button
              onClick={handleConfirmation}
              className=" text-white text-md bg-pink-600 disabled:bg-pink-300 border-0 py-2 px-3 focus:outline-none hover:bg-pink-600 rounded "
            >
              Confirm Payment
            </button>
            <button
              onClick={() => {
                setConfirm(false);
                setName("");
                setPhone("");
                setAddress("");
                setPincode("");
                setCity("");
                setProvince("");
              }}
              className="ml-8 text-white text-md bg-pink-600 disabled:bg-pink-300 border-0 py-2 px-3 focus:outline-none hover:bg-pink-600 rounded "
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Checkout;
