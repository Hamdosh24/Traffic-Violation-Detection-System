import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="w-500 max-w-sm p-4 bg-customDarkGreenbg transparent/20 rounded-lg shadow-sm sm:p-6 md:p-8 ">
      <form className="space-y-6" action="#">
        <h5 className="text-xl items-center justify-center flex font-medium  text-white">
          Sign in
        </h5>
        <div>
          <label
            for="email"
            className="block mb-2 text-sm font-medium  text-white"
          >
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customDarkGreen focus:border-customDarkGreen block w-full p-2.5 "
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label
            for="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            Your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            required
          />
        </div>
        <Link
          href="/employeeDashboard"
          className="w-full"
          passHref
          legacyBehavior
        >
          <button
            className="w-full text-white bg-customDarkGreen hover:bg-blue-800
                  focus:outline-none font-medium rounded-lg
                  text-sm px-5 py-2.5 text-center transition-colors duration-200"
          >
            Login to your account
          </button>
        </Link>
      </form>
    </div>
  );
}
