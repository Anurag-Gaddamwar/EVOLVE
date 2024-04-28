'use client';

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Intro from "./pages/Intro";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Intro/>
        <Footer/>
    </div>
  );
}
