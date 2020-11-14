import { FunctionComponent } from "react";
import Navbar from "./Navbar";

const Layout: FunctionComponent = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
