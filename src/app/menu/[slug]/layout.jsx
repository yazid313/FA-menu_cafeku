import Navbar from "./navbar";
import Footer from "@/app/home/[slug]/footer";

export default function RootLayout({ children }) {
  return (
    <div className=" min-w-[277px]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
