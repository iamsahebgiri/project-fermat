import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db/client";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization:
        "https://github.com/login/oauth/authorize?scope=read:user+user:email+read:org",
      userinfo: {
        url: "https://api.github.com/user",
        async request({ client, tokens }) {
          // Get base profile
          // @ts-ignore
          const profile = await client.userinfo(tokens);
          // console.log(profile);

          // If user has email hidden, get their primary email from the GitHub API
          if (!profile.email) {
            const emails = await (
              await fetch("https://api.github.com/user/emails", {
                headers: {
                  Authorization: `token ${tokens.access_token}`,
                },
              })
            ).json();

            if (emails?.length > 0) {
              // Get primary email
              profile.email = emails.find((email: any) => email.primary)?.email;
              // And if for some reason it doesn't exist, just use the first
              if (!profile.email) profile.email = emails[0].email;
            }
          }

          const userOrgs = await (
            await fetch("https://api.github.com/user/orgs", {
              headers: { Authorization: `token ${tokens.access_token}` },
            })
          ).json();

          // Set flag to deny signIn if allowed org is not found in the user organizations
          if (
            userOrgs.find((org: any) => org.login === process.env.ADMIN_ORG)
          ) {
            profile.role = "ADMIN";
          } else {
            profile.role = "USER";
          }

          return profile;
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          role: profile.role,
          image: profile.avatar_url,
          bio: profile.bio,
          githubUrl: profile.html_url,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);

type Role = "ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      bio?: string | null;
      githubUrl: string;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}
