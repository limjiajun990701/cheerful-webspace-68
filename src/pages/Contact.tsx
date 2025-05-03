
import React, { useEffect } from "react";
import ContactSection from "../components/ContactSection";
import emailjs from "emailjs-com";

const Contact = () => {
  useEffect(() => {
    // Initialize EmailJS with your user ID (public key)
    emailjs.init("VkiOxLOb6BI_EDOQ-"); // Updated with the actual public key
  }, []);

  return (
    <div className="min-h-screen pt-16">
      <ContactSection />
    </div>
  );
};

export default Contact;
