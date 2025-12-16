import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-6 md:px-10 lg:px-16 rounded-t-lg mt-8">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-5 md:text-left">
                {/* Company Info */}
                <div className="companyInfo">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-300">
                    ShopCentral
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your one-stop shop for high-quality products. We are
                    committed to providing the best shopping experience.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="quickLinks">
                  <h3 className="text-sm font-semibold mb-4 text-indigo-300">
                    Quick Links
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Categories */}
                <div className="category">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-300">
                    Categories
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Electronics
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Apparel
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Books
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Home & Kitchen
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div className="suppor">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-300">
                    Support
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        FAQs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Shipping & Returns
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Order Tracking
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Help Center
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
                <div className="flex gap-8 justify-center space-x-4 mt-4">
                  <Link to="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </div>
                <p className="text-center copyright">
                  &copy; {new Date().getFullYear()} ShopCentral. All rights
                  reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
