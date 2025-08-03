"use client";
export default function TextAreaInput({
  label,
  name,
  register,
  errors,
  isRequired = true,
  className = "sm:col-span-2",
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-slate-50 mb-2"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          {...register(`${name}`, { required: isRequired })}
          name={name}
          id={name}
          rows={3}
          className="block w-full rounded-md border-0 py-3 text-gray-900 dark:text-slate-100  bg-slate-50 dark:bg-transparent shadow-sm ring-1 ring-inset dark:ring-gray-400 ring-gray-300 placeholder:text-gray-400 focus:ring focus:ring-inset focus:ring-customGreen dark:focus:ring-customGreen sm:text-lg sm:leading-6"
          // placeholder={`Type the ${label ? label.toLowerCase() : "field"}`}
          placeholder={`Type the ${label.toLowerCase()}`}
          defaultValue={""}
        />
        {errors[`${name}`] && (
          <span className="text-red-600 text-sm">{`${label} is required`}</span>
        )}
      </div>
    </div>
  );
}
