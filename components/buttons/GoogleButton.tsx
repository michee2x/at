import { signIn } from "next-auth/react";
const GoogleLoginButton = () => {
  return (
    <div className="relative flex flex-col">
      <button
        onClick={() => signIn("google")}
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
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="64"
            height="64"
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="w-6 h-6"
            focusable="false"
            style={{ fill: "currentColor" }}
          >
            <defs>
              <path
                id="google-logo_svg__a"
                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4"
              />
            </defs>

            <clipPath id="google-logo_svg__b">
              <use xlinkHref="#google-logo_svg__a" />
            </clipPath>

            <path
              fill="#fbbc05"
              d="M0 37V11l17 13z"
              clipPath="url(#google-logo_svg__b)"
              transform="matrix(.72727 0 0 .72727 -.955 -1.455)"
            />
            <path
              fill="#ea4335"
              d="m0 11 17 13 7-6.1L48 14V0H0z"
              clipPath="url(#google-logo_svg__b)"
              transform="matrix(.72727 0 0 .72727 -.955 -1.455)"
            />
            <path
              fill="#34a853"
              d="m0 37 30-23 7.9 1L48 0v48H0z"
              clipPath="url(#google-logo_svg__b)"
              transform="matrix(.72727 0 0 .72727 -.955 -1.455)"
            />
            <path
              fill="#4285f4"
              d="M48 48 17 24l-4-3 35-10z"
              clipPath="url(#google-logo_svg__b)"
              transform="matrix(.72727 0 0 .72727 -.955 -1.455)"
            />
          </svg>
        </span>

        {/* Text */}
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
