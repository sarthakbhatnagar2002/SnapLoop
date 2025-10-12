import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { connectToDb } from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: 'read:user user:email'
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "github") {
                try {
                    console.log("=== GitHub Sign In Started ===");
                    console.log("User:", user);
                    console.log("Account:", account);
                    
                    await connectToDb();
                    
                    // Type assertion for GitHub profile
                    const githubProfile = profile as { login?: string } | undefined;
                    const githubUsername = githubProfile?.login || user.name || user.email?.split('@')[0] || 'user';
                    
                    console.log("GitHub Username:", githubUsername);
                    
                    // Check if user exists with this GitHub ID
                    let existingUser = await User.findOne({ githubId: account.providerAccountId });
                    
                    if (!existingUser) {
                        console.log("Creating new user...");
                        // Create new user from GitHub profile
                        existingUser = await User.create({
                            githubId: account.providerAccountId,
                            githubUsername: githubUsername,
                            username: githubUsername,
                            email: user.email,
                            avatar: user.image,
                        });
                        console.log("User created:", existingUser);
                    } else {
                        console.log("User exists, updating...");
                        // Update existing user info
                        existingUser.avatar = user.image;
                        existingUser.email = user.email;
                        await existingUser.save();
                        console.log("User updated");
                    }
                    
                    console.log("=== GitHub Sign In Success ===");
                    return true;
                } catch (error) {
                    console.error("=== GitHub sign in error ===", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            console.log("=== JWT Callback ===");
            console.log("Token:", token);
            console.log("User:", user);
            console.log("Account:", account);
            
            if (user) {
                token.id = user.id;
                token.username = user.name || undefined;
            }
            
            // For GitHub login, fetch user from DB to get the MongoDB _id
            if (account?.provider === "github" && account.providerAccountId) {
                await connectToDb();
                const dbUser = await User.findOne({ githubId: account.providerAccountId });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.username = dbUser.username;
                    token.picture = dbUser.avatar || undefined;
                    console.log("Set token from DB user:", token);
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            console.log("=== Session Callback ===");
            console.log("Session before:", session);
            console.log("Token:", token);
            
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                if (token.picture) {
                    session.user.image = token.picture as string;
                }
            }
            
            console.log("Session after:", session);
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};