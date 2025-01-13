import { Inter } from "next/font/google";
import "../../globals.css";
import Header from "./header";
import Navbar from "./navbar";
import Footer from "@/app/home/[slug]/footer";
// import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Menu cafeku",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" min-w-[277px]">
          <Navbar />
          {/* <Header /> */}
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
