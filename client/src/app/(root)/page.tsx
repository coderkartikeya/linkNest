import Image from "next/image";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import LocalNetworkSection from "../components/LocalNetwork";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="">
      <Header/>
      <HeroSection/>
      <LocalNetworkSection/>
      <Footer/>
      {/* <Middle/> */}
      {/* <First/> */}
      {/* <Second/> */}
    </div>
  );
}
