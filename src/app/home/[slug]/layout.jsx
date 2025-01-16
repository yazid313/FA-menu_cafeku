import Navbar from "./navbar";
import Footer from "./footer";

export default function RootLayout({ children }) {
  return (
    <div className=" min-w-[277px]">
      {children}
      <Footer />
    </div>
  );
}
