import { Outlet } from "react-router-dom";
import Header from "./user-components/inlucdes/Header";
import Footer from "./user-components/inlucdes/Footer";

export default function UserLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
