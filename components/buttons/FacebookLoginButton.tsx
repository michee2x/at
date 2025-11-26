// components/FacebookLoginButton.tsx
import { signIn } from "next-auth/react";
import React from "react";

const FacebookLoginButton = ({
  type = "login",
}: {
  type?: "login" | "signup";
}) => {
  return (
    <div className="relative flex flex-col">
      <button
        onClick={() =>
          signIn("facebook", {
            callbackUrl: "http://localhost:3000/dashboard",
          })
        }
        type="button"
        className="relative isolate inline-flex shrink-0 items-center justify-center rounded-full border text-base focus:outline focus:outline-2 focus:outline-offset-2 data-[disabled]:opacity-75 [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:shrink-0 min-h-10 gap-x-3 px-4 py-2 sm:text-sm [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4 border-[--btn-border] bg-[--btn-bg] text-[--btn-text] hover:bg-[--btn-hover] focus:outline-[--btn-text] [--btn-bg:transparent] [--btn-border:hsl(var(--primary)/15%)] [--btn-hover:hsl(var(--bg-overlay-hover))] [--btn-text:hsl(var(--primary))]"
      >
        <span
          className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
          aria-hidden="true"
        />

        {/* Icon */}
        <span
          className="inline-flex items-center justify-center p-0 m-0 w-6 h-6"
          data-namespace="@xai/icons"
          data-slot="icon"
          aria-hidden="true"
        >
          {/* Facebook "f" logo in a rounded square. Uses currentColor so it can inherit. */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="w-6 h-6"
            focusable="false"
            aria-hidden="true"
            style={{ fill: "currentColor" }}
          >
            <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.45 9.91v-7.02h-2.54v-2.9h2.54V9.1c0-2.51 1.5-3.9 3.79-3.9 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.86h2.78l-.44 2.9h-2.34v7.02c4.79-.79 8.45-4.92 8.45-9.91z" />
          </svg>
        </span>

        {/* Text */}
        <span>{type === "login" ? "Login" : "Signup"} with Facebook</span>
      </button>
    </div>
  );
};

export default FacebookLoginButton;

//https://at-beryl.vercel.app/api/auth/callback/facebook
//http://localhost:3000/api/auth/callback/facebook
