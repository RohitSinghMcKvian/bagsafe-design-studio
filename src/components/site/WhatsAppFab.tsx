import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

export function WhatsAppFab({
  message = "Hi BagSafe, I'd like to book a pickup.",
}: {
  message?: string;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground shadow-elegant transition-transform hover:scale-105 hover:bg-primary/92 active:scale-95 sm:h-auto sm:w-auto sm:px-4 sm:py-3 sm:text-sm sm:font-semibold md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
