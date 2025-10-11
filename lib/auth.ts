import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Changed: only check for username and password
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing values")
                }
                try {
                    await connectToDb()
                    const user = await User.findOne({ username: credentials.username })

                    if (!user) {
                        throw new Error("No user found with this username");
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password, user.password
                    )
                    if (!isValid) {
                        throw new Error("Invalid Password");
                    }
                    return {
                        id: user._id.toString(),
                        username: user.username
                    }

                } catch (error) {
                    console.error("Auth Error: ", error)
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};