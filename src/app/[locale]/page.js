"use client"
import TopBar from "@/components/topbar";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import Features from "@/components/features";
import BestSellers from "@/components/bestseller";
import WhatsAppBanner from "@/components/whatsappcontact";
import Footer from "@/components/footer";

const Home = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FCF8F6]">
      <TopBar />
      <Navbar />
      <Hero />
      <Categories />
      <Features />
      <BestSellers />
      <WhatsAppBanner />
      <Footer />
    </main>
  );
};

export default Home;