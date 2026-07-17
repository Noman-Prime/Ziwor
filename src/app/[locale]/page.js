import TopBar from "@/components/topbar";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import Features from "@/components/features";
import BestSellers from "@/components/bestseller";
import WhatsAppBanner from "@/components/whatsappcontact";
import Footer from "@/components/footer";
import { getHeroSliders } from "@/lib/hero-slider";

const Home = async ({ params }) => {
  const { locale } = await params;
  const sliders = (await getHeroSliders(locale)) ?? [];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FCF8F6]">
      <TopBar />
      <Navbar />
      <Hero slides={sliders} />
      <Categories />
      <Features />
      <BestSellers />
      <WhatsAppBanner />
      <Footer />
    </main>
  );
};

export default Home;