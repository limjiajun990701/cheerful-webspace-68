
import React, { useEffect } from "react";
import ContactSection from "../components/ContactSection";
import emailjs from "emailjs-com";

const Contact = () => {
  useEffect(() => {
    // Initialize EmailJS with your user ID (public key)
    emailjs.init("YOUR_USER_ID"); // Replace with your actual public key
  }, []);

  return (
    <div className="min-h-screen pt-16">
      <ContactSection />
    </div>
  );
};

export default Contact;
