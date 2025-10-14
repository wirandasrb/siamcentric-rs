"use client";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

export default function EmotionRootProvider({ children }) {
    return (
        <CacheProvider value={clientSideEmotionCache}>
            {children}
        </CacheProvider>
    );
}
