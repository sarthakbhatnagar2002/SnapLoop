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
                    await connectToDb();
                    
                    // Type assertion for GitHub profile
                    const githubProfile = profile as { login?: string } | undefined;
                    const githubUsername = githubProfile?.login || user.name || user.email?.split('@')[0] || 'user';
                    
                    // Check if user exists with this GitHub ID
                    let existingUser = await User.findOne({ githubId: account.providerAccountId });
                    
                    if (!existingUser) {
                        // Create new user from GitHub profile
                        existingUser = await User.create({
                            githubId: account.providerAccountId,
                            githubUsername: githubUsername,
                            username: githubUsername,
                            email: user.email,
                            avatar: user.image,
                        });
                    } else {
                        // Update existing user info
                        existingUser.avatar = user.image;
                        existingUser.email = user.email;
                        await existingUser.save();
                    }
                    
                    return true;
                } catch (error) {
                    console.error("GitHub sign in error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
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
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                if (token.picture) {
                    session.user.image = token.picture as string;
                }
            }
            
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};