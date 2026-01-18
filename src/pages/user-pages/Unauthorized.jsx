import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { ShieldX } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center px-6 py-12 max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldX className="w-24 h-24 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please contact an
          administrator if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={handleGoBack}>Go Back</Button>
          <Button onClick={handleGoHome}>Go to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
