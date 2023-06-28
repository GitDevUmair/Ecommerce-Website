import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  AiOutlineShoppingCart,
  AiFillCloseCircle,
  AiFillPlusCircle,
  AiFillMinusCircle,
} from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { useRouter } from "next/router";
const Navbar = ({
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  user,
  handleLogout,
}) => {
  const router = useRouter();
  const ref = useRef();
  const [dropdown, setDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  useEffect(() => {
    let exempted = ["/checkout", "/order", "/orders"];
    Object.keys(cart).length !== 0 && setSidebar(true);
    if (exempted.includes(router.pathname)) {
      setSidebar(false);
    }
  }, []);
  const toggleCart = () => {
    // if (ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-full");
    //   ref.current.classList.add("translate-x-0");
    // } else if (!ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-0");
    //   ref.current.classList.add("translate-x-full");
    // }
    setSidebar(!sidebar);
  };

  return (
    <>
      {!sidebar && (
        <span
          className="cart z-30 account flex fixed right-5 top-4 text-xl md:text-3xl"
          onMouseOver={() => {
            setDropdown(true);
          }}
          onMouseLeave={() => {
            setDropdown(false);
          }}
        >
          {dropdown && (
            <div
              className="options rounded-md absolute right-7 top-6 bg-white border shadow-lg w-32 px-4 py-5"
              onMouseOver={() => {
                setDropdown(true);
              }}
              onMouseLeave={() => {
                setDropdown(false);
              }}
            >
              <ul>
                <Link href={"/myaccount"}>
                  <li className="text-sm hover:text-pink-700 py-1 font-bold">
                    My Account
                  </li>
                </Link>
                <li
                  className="text-sm hover:text-pink-700 py-1 font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </li>
                <Link href={"/orders"}>
                  <li className="text-sm hover:text-pink-700 py-1 font-bold">
                    Orders
                  </li>
                </Link>
              </ul>
            </div>
          )}
          {user.value && (
            <MdAccountCircle className="mx-3 mt-1 md:mt-0 cursor-pointer" />
          )}
        </span>
      )}
      <div
        className={`flex sticky top-0 bg-white z-10 flex-col  md:flex-row  md:justify-start  justify-center items-center py-2 shadow-md ${
          !sidebar && "overflow-hidden"
        }`}
      >
        <div className="logos">
          <Link href={"/"}>
            {" "}
            <Image
              src={"/logo.png"}
              width={200}
              height={40}
              className="mx-3 cursor-pointer"
            ></Image>{" "}
          </Link>
        </div>
        <div className="nav">
          <ul className="flex space-x-4 font-bold md:text-xl cursor-pointer">
            <Link href={"/tshirts"}>
              <li className=" hover:text-pink-600">Tshirts</li>
            </Link>
            <Link href={"/hoodies"}>
              <li className=" hover:text-pink-600">Hoodies</li>
            </Link>
            <Link href={"/stickers"}>
              <li className=" hover:text-pink-600">Stickers</li>
            </Link>
            <Link href={"/mugs"}>
              <li className=" hover:text-pink-600">Mugs</li>
            </Link>
          </ul>
        </div>

        <div className="cart account flex absolute right-0 top-4 text-xl md:text-3xl">
          {user.value && (
            <Link href={"/login"} legacyBehavior>
              <a
                onMouseOver={() => {
                  setDropdown(true);
                }}
                onMouseLeave={() => {
                  setDropdown(false);
                }}
              ></a>
            </Link>
          )}
          {!user.value && (
            <Link href={"/login"}>
              <button
                type="button"
                className="bg-pink-600 flex text-sm text-white rounded-md mx-2 px-2 py-1"
              >
                Login
              </button>
            </Link>
          )}
          <AiOutlineShoppingCart
            className="cursor-pointer mt-1 md:mt-0"
            onClick={toggleCart}
          />
        </div>
        <div
          ref={ref}
          className={`sideCart absolute ${
            sidebar ? "right-0" : "-right-96"
          }  overflow-y-scroll  top-0 py-10 transform transition-transform"
        } px-8 bg-pink-100 w-72`}
        >
          <h2 className="font-bold text-center text-xl">Shopping Cart</h2>
          <span className="absolute top-5 right-2 cursor-pointer">
            <AiFillCloseCircle
              className="text-xl text-pink-600"
              onClick={toggleCart}
            />
          </span>
          <ol className="list-decimal font-semibold">
            {Object.keys(cart).length === 0 && (
              <div className="my-2 text-center">No items in the Cart !</div>
            )}

            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-5 ">
                    <div className="font-semibold w-2/3">
                      {cart[k].name} ({cart[k].size} / {cart[k].variant})
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
          <div className="checkout flex space-x-2">
            <Link href={"/checkout"}>
              <button
                disabled={Object.keys(cart).length === 0}
                className="flex disabled:bg-pink-300 text-white text-md bg-pink-500 border-0 py-2 px-3 focus:outline-none hover:bg-pink-600 rounded "
              >
                <BsFillBagCheckFill className="mr-1 mt-1" /> Checkout
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length === 0}
              className="flex disabled:bg-pink-300 text-white text-md bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded "
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
          <div className="font-bold my-4 text-center">
            Your subTotal : ${subTotal}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
