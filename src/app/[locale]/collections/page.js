import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const CollectionsPage = () => {
    return (
        <main className="min-h-screen bg-[#FCF8F6]">
            <Navbar />

            <section className="py-8 sm:py-10 lg:py-12">
                <Categories />
            </section>

            <Footer />
        </main>
    );
};

export default CollectionsPage;