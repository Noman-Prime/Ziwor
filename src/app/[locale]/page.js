import TopBar from "@/components/topbar";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import Features from "@/components/features";
import BestSellers from "@/components/bestseller";
import HomepagePromotions from "@/components/homepage-promotions";
import WhatsAppBanner from "@/components/whatsappcontact";
import Footer from "@/components/footer";

import { getHeroSliders } from "@/lib/hero-slider";
import { getHomepagePromotions } from "@/lib/homepage-promotions";
import { getWhatsAppBanner } from "@/lib/whatsapp-banner";

const Home = async ({ params }) => {
    const { locale } = await params;

    const [sliders, promotions, whatsappBanner] = await Promise.all([
        getHeroSliders(locale),
        getHomepagePromotions(locale),
        getWhatsAppBanner(locale),
    ]);

    return (
        <main className="min-h-screen">
            <TopBar />

            <Navbar />

            <HomepagePromotions
                promotions={promotions}
                location="after_navbar"
                locale={locale}
            />

            <Hero slides={sliders ?? []} />

            <HomepagePromotions
                promotions={promotions}
                location="after_hero"
                locale={locale}
            />

            <Categories />

            <HomepagePromotions
                promotions={promotions}
                location="after_categories"
                locale={locale}
            />

            <Features />

            <HomepagePromotions
                promotions={promotions}
                location="after_features"
                locale={locale}
            />

            <BestSellers />

            <HomepagePromotions
                promotions={promotions}
                location="after_bestsellers"
                locale={locale}
            />

            <WhatsAppBanner
                banner={whatsappBanner}
                locale={locale}
            />

            <Footer />
        </main>
    );
};

export default Home;