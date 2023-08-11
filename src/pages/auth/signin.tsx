import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/button";
import { SITE_NAME } from "~/utils/constants";

export default function SignIn() {
  const { query } = useRouter();
  const { callbackUrl } = query;

  return (
    <>
      <Head>
        <title>{`Create an account - ${SITE_NAME}`}</title>
      </Head>
      <div className="flex min-h-screen">
        <div className="hidden md:block flex-1">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-zinc-900" />
            <video
              className="h-full w-full object-cover absolute"
              src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"
              loop
              autoPlay
              muted
              controls={false}
              playsInline
            />
            <div className="absolute z-10 p-10 ">
              <div className="text-white font-semibold text-lg flex items-center gap-2">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.0925 1.05386L21.1595 0L17.8451 12.3696L14.8528 1.20224L10.9197 2.2561L14.1527 14.3216L6.10008 6.26898L3.22089 9.14817L12.0536 17.981L1.05386 15.0336L0 18.9666L12.0186 22.187C11.881 21.5935 11.8082 20.9751 11.8082 20.3397C11.8082 15.8421 15.4542 12.1961 19.9518 12.1961C24.4494 12.1961 28.0954 15.8421 28.0954 20.3397C28.0954 20.971 28.0235 21.5856 27.8876 22.1756L38.8103 25.1023L39.8641 21.1693L27.7977 17.9361L38.7982 14.9885L37.7443 11.0555L25.6784 14.2885L33.731 6.23592L30.8518 3.35673L22.1416 12.067L25.0925 1.05386Z"
                    fill="currentColor"
                  />
                  <path
                    d="M27.8769 22.2214C27.5397 23.647 26.8278 24.9277 25.851 25.9538L33.764 33.8669L36.6432 30.9877L27.8769 22.2214Z"
                    fill="currentColor"
                  />
                  <path
                    d="M25.771 26.0366C24.7824 27.0463 23.5331 27.7998 22.1321 28.1881L25.0115 38.9341L28.9445 37.8802L25.771 26.0366Z"
                    fill="currentColor"
                  />
                  <path
                    d="M21.9852 28.2274C21.3352 28.3945 20.6539 28.4833 19.9518 28.4833C19.1996 28.4833 18.4712 28.3813 17.7797 28.1904L14.8977 38.9462L18.8307 40L21.9852 28.2274Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.6407 28.1507C16.2611 27.7431 15.034 26.98 14.0656 25.9674L6.13313 33.8999L9.01232 36.7791L17.6407 28.1507Z"
                    fill="currentColor"
                  />
                  <path
                    d="M13.9994 25.8973C13.0476 24.8783 12.3543 23.6147 12.0243 22.2111L1.06596 25.1474L2.11981 29.0804L13.9994 25.8973Z"
                    fill="currentColor"
                  />
                </svg>
                {SITE_NAME}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-4 sm:px-0 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                We will create an account if doesn&apos;t exists.
              </p>
            </div>
            <Button
              onClick={() =>
                signIn("github", {
                  callbackUrl: callbackUrl as string,
                })
              }
            >
              Sign in with Github
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
