import { useEffect, useState } from "react";
// import { isEmpty } from "../../Register/Components/InputValidation";
function PasswordInput({
  value,
  setValue,
  label,
  placeholder,
  valid,
  error,
  errorMsg,
}) {
  const [empty, setempty] = useState(true);
  const [focused, setFocused] = useState(false);
  const OnFocus = () => setFocused(true);
  const OnBlur = () => setFocused(false);
  useEffect(() => {
    const isEmpty = (value) => {
      return value === "";
    };
    if (isEmpty(value)) {
      setempty(true);
    } else {
      setempty(false);
    }
  }, [value]);
  return (
    <div
      className="flex justify-center items-start box-content
     mb-5 flex-col relative w-72"
    >
      <input
        autoComplete="off"
        value={value}
        onFocus={OnFocus}
        onBlur={OnBlur}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        className={` shadow-sm peer block border  ${
          empty
            ? "shadow-gray-400"
            : valid
            ? "shadow-green-500"
            : "shadow-red-500"
        } text-xs
        box-content w-[264px] h-[20px] rounded-sm outline-none
         placeholder-transparent
         my-2 py-[6px] pr-2 pl-3 `}
        name="input"
        placeholder={placeholder}
        id={label}
      />
      <label
        htmlFor={label}
        className={` transition-all  bg-input-color text-gray-400 ${
          !empty
            ? "absolute -top-[10px] left-[6px] text-xs"
            : ` absolute top-[16px] left-[13.5px] text-sm cursor-text`
        }`}
      >
        {label}
      </label>
      <div className="absolute top-[48px] left-[6px]">
        {!empty && !focused && error && !valid && (
          <p className="text-xs text-red-600">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}

export default PasswordInput;
