import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MyAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [npassword, setNpassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [user, setUser] = useState({ value: null });
  const handleChange = async (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "address") {
      setAddress(e.target.value);
    } else if (e.target.name === "phone") {
      setPhone(e.target.value);
    } else if (e.target.name === "pincode") {
      setPincode(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "cpassword") {
      setCpassword(e.target.value);
    } else if (e.target.name === "npassword") {
      setNpassword(e.target.value);
    }
  };
  const router = useRouter();

  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("myuser"));
    if (User && User.token) {
      setUser({ value: User.token, email: User.email });
      setEmail(User.email);
    }
    if (!User) {
      router.push("/");
    }
    fetchData(User.token);
  }, []);
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
      } catch (error) {
        console.error("Error:", error);
      }
    }
    const newData = { token: token };
    postJSON(newData);
  };
  const handleUserSubmit = async () => {
    async function postJSON(data) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/updateuser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        if (result) {
          toast.success("Details Updated Successfully!", {
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
    const newData = { token: user.value, phone, address, pincode };
    postJSON(newData);
  };
  const handlePasswordSubmit = async () => {
    setPassword("");
    setCpassword("");
    setNpassword("");
    async function postJSON(data) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const res = await response.json();
        console.log(res);
        if (res.success) {
          toast.success("Password Changed Successfully!", {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error("Error Updating Password!", {
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
    const newData = { token: user.value, password, npassword, cpassword };
    postJSON(newData);
  };
  return (
    <div className="container mx-auto">
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
      <h1 className="text-3xl text-center my-9">Update your Account</h1>
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
            Email(cannot be changed)
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
      <button
        onClick={handleUserSubmit}
        className="flex ml-3 mb-5 text-white text-md bg-pink-600 disabled:bg-pink-300 border-0 p-2 focus:outline-none hover:bg-pink-600 rounded "
      >
        Submit
      </button>
      <h2 className="font-xl font-semibold">2. Change Password</h2>
      <div className="mx-auto flex my-2">
        <div className="mb-2 w-1/2 mx-3">
          <label
            htmlFor="password"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            Password
          </label>
          <input
            value={password}
            onChange={handleChange}
            type="password"
            id="password"
            name="password"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="mb-2 w-1/2 mx-3">
          <label
            htmlFor="npassword"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            New Password
          </label>
          <input
            value={npassword}
            onChange={handleChange}
            type="password"
            id="npassword"
            name="npassword"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>

        <div className="mb-2 w-1/2 mx-3">
          <label
            htmlFor="cpassword"
            className="leading-7 font-semibold text-sm text-gray-600"
          >
            Confirm Password
          </label>
          <input
            value={cpassword}
            onChange={handleChange}
            type="password"
            id="cpassword"
            name="cpassword"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
      </div>
      <button
        onClick={handlePasswordSubmit}
        className="flex ml-3 mb-2 text-white text-md bg-pink-600 disabled:bg-pink-300 border-0 p-2 focus:outline-none hover:bg-pink-600 rounded "
      >
        Submit
      </button>
    </div>
  );
};

export default MyAccount;
