import { Plus } from "lucide-react";
import React from "react";

export default function SubmitButton({
  isLoading = flase,
  buttonTitle,
  LoadingButtonTitle,
}) {
  return (
    <div className="sm:col-span-1">
      {isLoading ? (
        <button
          disabled
          type="button"
          className="mt-4 text-white bg-customGreen hover:bg-customGreen/80 focus:ring-4 focus:outline-none focus:ring-customGreen/30 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-customGreen/60 dark:hover:bg-customGreen/70 dark:focus:ring-customGreen/80 inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 mr-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100 591C22.3858 100.591 50 78.2051 50 22.9766 22.3858 50 50 100 22.9766 100 77.1895 73.1895 50 91.5094 50 91.5094 72.5987 91.5094 90.9186 73.1895 50 91.5094 90.9186 27.9921 72.5987 9.67226 50 9.67226 27.9921 9.08144 50.5908"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          {LoadingButtonTitle}
        </button>
      ) : (
        <button
          type="submit"
          className="inline-flex items-center px-5 py-3 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-slate-900 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-slate-800 dark:bg-customGreen dark:hover:bg-customGreen/70"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>{buttonTitle}</span>
        </button>
      )}
    </div>
  );
}
