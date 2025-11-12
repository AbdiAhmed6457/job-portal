// client/src/components/Footer.jsx
import React from "react";

const Footer = () => (
  <footer className="bg-blue-600 text-white py-6 mt-10">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} MS Job Portal. All rights reserved.</p>
      <p>Designed with ❤️ using React and TailwindCSS</p>
    </div>
  </footer>
);

export default Footer;
