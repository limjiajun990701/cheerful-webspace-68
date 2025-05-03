import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon, Loader2 } from "lucide-react";
import emailjs from "emailjs-com";

// Define the schema for form validation using zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Send the email using EmailJS
      const serviceId = "service_4wy5lg7";  // Replace with your valid EmailJS service ID
      const templateId = "template_ksmsmy9"; // Replace with your confirmed template ID
      
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_name: "Lim Jia Jun",         // The recipient's name (could be your name or your business name)
        reply_to: data.email,          // Reply-to address should be the sender's email
        name: data.name,               // Adding name parameter for template
        time: new Date().toLocaleString(),  // Adding the time of submission for template
      };
      
      // Send the email with the provided parameters
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        "VkiOxLOb6BI_EDOQ-" // Replace with your public key from EmailJS
      );

      console.log("Email sent successfully:", response);  // Log success response

      // Show a success toast notification
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      // Reset the form after submission
      form.reset();
    } catch (error) {
      // Log the error to the console for debugging
      console.error("Error sending message:", error);

      // Show an error toast notification
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      // Set isSubmitting to false when the process is complete
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What would you like to discuss?" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <SendIcon className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
