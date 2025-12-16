// Loader.js
// import { useLoader } from "../contexts/LoaderContext.jsx";
export default function Loader() {
  // const { loading } = useLoader();

  // if (!loading) return null;
  return (
    <div
      style={{ textAlign: "center", padding: "20px" }}
      className="loaderPage"
    >
      <p>Loading...</p>
      <div className="custom-loader"></div>
    </div>
  );
}
