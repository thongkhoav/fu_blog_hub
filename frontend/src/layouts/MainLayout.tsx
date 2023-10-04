import { Outlet } from "react-router-dom";
import Header from "src/components/Header/Header";
import Footer from "~/components/footer/Footer";

export default function MainLayout() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="mx-auto max-w-[1200px]">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
