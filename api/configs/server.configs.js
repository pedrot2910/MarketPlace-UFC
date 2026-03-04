
const originProcess = {
     allowedOriginPatterns : [
        /^http:\/\/localhost:5173$/,
        /^https:\/\/market-place-ufc\.vercel\.app$/,
        /^https:\/\/.*\.vercel\.app$/, // fallback seguro
    ],

     verifyOrigin (origin)  {
        if (!origin) return true; // Mobile/WebView
        return this.allowedOriginPatterns.some((pattern) => pattern.test(origin));
    }
};

export { originProcess };