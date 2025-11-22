import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connect_db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await connectDB();
        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const db = await connectDB();
        const existingUser = await db
          .collection("users")
          .findOne({ email: user.email });

        if (!existingUser) {
          await db.collection("users").insertOne({
            email: user.email,
            image: user.image,
            username: user.name,
          });
        }
      }

      return true;
    },

    // Save user data into token
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const db = await connectDB();
          const existingUser = await db.collection("users").findOne({
            email: user.email,
          });

          if (existingUser) {
            token.id = existingUser._id.toString();
            token.username = existingUser.username;
          }
        } else {
          token.id = user.id;
          token.username = user.username;
        }
      }

      return token;
    },

    // Save token into session for client use
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
