import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Catalogo() {
    return (
        <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-grow">
                <Sidebar role="user" />
                <div className="flex flex-col flex-grow">
                <Header role="Usuario" initials="US" showBackButton />

                    <main className="flex-grow">
                        {/* Main content goes here */}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}
