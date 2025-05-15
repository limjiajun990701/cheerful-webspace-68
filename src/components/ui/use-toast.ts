
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };

// Custom toasts for API usage limits
export const showApiLimitToast = () => {
  toast({
    title: "API Limit Warning",
    description: "Monthly remove.bg API limit is close to being reached. Using local processing method instead.",
    variant: "default",
    duration: 7000,
  });
};

export const showApiLimitReachedToast = () => {
  toast({
    title: "API Limit Reached",
    description: "Monthly remove.bg API limit has been reached. Using local processing method until next month.",
    variant: "destructive",
    duration: 7000,
  });
};
