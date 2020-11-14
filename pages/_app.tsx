import Nprogress from "nprogress";
import Router from "next/router";
import { UserProvider } from "../context/userContext";
import "nprogress/nprogress.css";

import "../styles/globals.css";

Router.events.on("routeChangeStart", Nprogress.start);
Router.events.on("routeChangeComplete", Nprogress.done);
Router.events.on("routeChangeError", Nprogress.done);

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
