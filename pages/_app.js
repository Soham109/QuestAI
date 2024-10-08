import React from "react";
import { useRouter } from "next/router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../components/src/theme";
import { Analytics } from "@vercel/analytics/react"
import LandingPage from ".";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = router;

  return (
    <ThemeProvider theme={theme}>
      <Analytics />
      <CssBaseline />
      {pathname === '/' ? (
        <LandingPage /> // Only show LandingPage on root route
      ) : (
        <Component {...pageProps} /> // Show other components for other routes
      )}
    </ThemeProvider>
  );
}