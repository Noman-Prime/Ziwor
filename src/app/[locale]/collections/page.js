import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const CollectionsPage = () => {
    return (
        <main className="min-h-screen bg-[#FCF8F6]">
            <Navbar />
            <Categories />
            <Footer />
        </main>
    );
};

export default CollectionsPage;