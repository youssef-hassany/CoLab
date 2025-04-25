"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SubmitButton = (props: ButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className={`w-full flex justify-center gap-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-800 ${
        pending && "opacity-70"
      } ${props.className}`}
    >
      {props.children} {pending && <Spinner />}
    </button>
  );
};

export default SubmitButton;
