import "../styles/globals.scss";
import type { AppProps } from "next/app";
import PopulatedNavBar from "../components/PopulatedNavBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <PopulatedNavBar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
