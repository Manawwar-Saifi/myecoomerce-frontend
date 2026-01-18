import { Outlet } from "react-router-dom";
import Header from "./user-components/inlucdes/Header";
import Footer from "./user-components/inlucdes/Footer";
import ScrollToTop from "../utils/ScrollToTop";

export default function UserLayout() {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
