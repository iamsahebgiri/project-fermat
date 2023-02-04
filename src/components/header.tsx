import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import dismiss24Regular from "@iconify/icons-fluent/dismiss-24-regular";
import navigation24Regular from "@iconify/icons-fluent/navigation-24-regular";
import { Icon } from "@iconify/react";
import { classNames } from "~/utils/classnames";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";
import siteTextLogo from "../../public/site-logo-text.svg";
import siteLogo from "../../public/site-logo.svg";
import { ButtonLink } from "./button-link";
import { useRouter } from "next/router";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/">
                    <a>
                      <div className="flex items-center h-full lg:hidden">
                        <Image
                          className="h-8 w-auto"
                          src={siteLogo}
                          alt="Garbaze"
                        />
                      </div>
                    </a>
                  </Link>
                  <Link href="/">
                    <a>
                      <div className="hidden lg:flex items-center h-full">
                        <Image
                          className="h-8 w-auto"
                          src={siteTextLogo}
                          alt="Garbaze"
                        />
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-sky-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link href="/">
                    <a className="border-sky-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Problems
                    </a>
                  </Link>
                  <Link href="/leaderboard">
                    <a className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Leaderboard
                    </a>
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div className="flex items-center">
                    {session?.user.role === "ADMIN" && (
                      <ButtonLink href="/problem/create" className="mr-4">
                        Create Problem
                      </ButtonLink>
                    )}
                    {session ? (
                      <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        <span className="sr-only">Open user menu</span>
                        <Image
                          height={32}
                          width={32}
                          className="h-8 w-8 rounded-full"
                          src={session.user.image ?? ""}
                          alt={session?.user.name}
                        />
                      </Menu.Button>
                    ) : (
                      <Button onClick={() => signIn("github")}>Sign in</Button>
                    )}
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              router.push(`/profile/${session?.user.id}`);
                            }}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your profile
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "w-full text-left px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <Icon
                      icon={dismiss24Regular}
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <Icon
                      icon={navigation24Regular}
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {/* Current: "bg-sky-50 border-sky-500 text-sky-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button as={Link} href="/">
                <a className="bg-sky-50 border-sky-500 text-sky-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Problems
                </a>
              </Disclosure.Button>
              <Disclosure.Button as={Link} href="/leaderboard">
                <a className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                  Leaderboard
                </a>
              </Disclosure.Button>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {session ? (
                  <>
                    <div className="flex-shrink-0">
                      <div className="flex">
                        <Image
                          height={40}
                          width={40}
                          className="h-10 w-10 rounded-full"
                          src={session.user.image ?? ""}
                          alt={session.user.name}
                        />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {session.user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {session.user.email}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="mt-3 space-y-1">
                {session ? (
                  <>
                    <Disclosure.Button
                      as={Link}
                      href={`/profile/${session.user.id}`}
                    >
                      <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                        Your Profile
                      </a>
                    </Disclosure.Button>
                    <Disclosure.Button
                      onClick={() => signOut()}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Sign out
                    </Disclosure.Button>
                  </>
                ) : (
                  <Disclosure.Button
                    onClick={() => signIn()}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign in
                  </Disclosure.Button>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
