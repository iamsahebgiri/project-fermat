// src/pages/_app.tsx
import React from "react";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { NextPageWithAuthAndLayout } from "~/utils/types";
import "~/styles/globals.css";
import "katex/dist/katex.min.css";
import { trpc } from "~/utils/trpc";

type AppPropsWithAuthAndLayout = AppProps & {
  Component: NextPageWithAuthAndLayout;
  pageProps: {
    session: Session | null;
  };
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuthAndLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {Component.auth ? (
        <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
      ) : (
        getLayout(<Component {...pageProps} />)
      )}
      <Toaster />
    </SessionProvider>
  );
}

function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return null;
}

export default trpc.withTRPC(MyApp);
