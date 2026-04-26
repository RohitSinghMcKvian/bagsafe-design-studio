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
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[oklch(0.62_0.18_152)] px-4 py-3 text-sm font-semibold text-white shadow-elegant transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
