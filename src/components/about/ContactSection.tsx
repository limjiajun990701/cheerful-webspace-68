
import React from 'react';
import { Github, Mail, Linkedin, Phone, ExternalLink } from "lucide-react";

const ContactSection = () => {
  const contactMethods = [
    {
      title: "Email",
      value: "jiajunlim0701@gmail.com",
      href: "mailto:jiajunlim0701@gmail.com",
      icon: <Mail className="w-6 h-6 text-primary" />
    },
    {
      title: "Phone",
      value: "+60 1128797556",
      href: "tel:+60 1128797556",
      icon: <Phone className="w-6 h-6 text-primary" />
    },
    {
      title: "GitHub",
      value: "github.com/LIMJIAJUN",
      href: "https://github.com/LIMJIAJUN",
      icon: <Github className="w-6 h-6 text-primary" />
    },
    {
      title: "LinkedIn",
      value: "linkedin.com/in/LIMJIAJUN",
      href: "https://linkedin.com/in/LIMJIAJUN",
      icon: <Linkedin className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full mb-3">Contact</span>
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Have a project in mind or just want to chat? Feel free to reach out through any of
              the channels below. I'm always open to new opportunities and collaborations.
            </p>
            <div className="mt-3 h-1 w-20 bg-primary/30 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((contact) => (
              <a 
                key={contact.title}
                href={contact.href} 
                target={contact.href.startsWith('http') ? "_blank" : undefined}
                rel={contact.href.startsWith('http') ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 p-6 rounded-xl border border-border hover:bg-accent transition-colors overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors relative z-10">
                  {contact.icon}
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium">{contact.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors">{contact.value}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground ml-auto relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
