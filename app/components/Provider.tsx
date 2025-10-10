import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

const urlEndpt = process.env.NEXT_PUBLIC_URL_ENDPOINT

export default function({children}:{children:React.ReactNode}){
    return (
        <SessionProvider refetchInterval={5*60}>
            <ImageKitProvider>{children}</ImageKitProvider>
        </SessionProvider>
    )
}