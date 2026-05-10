import { whatsappLink } from "@/lib/contact";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.76-1.653-2.059-.173-.298-.018-.46.13-.61.134-.133.297-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.324-.025-.473-.075-.15-.67-1.612-.918-2.206-.242-.579-.486-.5-.67-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.075-.792.374-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.49 1.694.625.712.227 1.365.195 1.88.118.574-.085 1.758-.72 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.385 7.433c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6m0-13.714C9.896 1.714 7.147 4 7.147 7s2.75 7 6 7c3.143 0 6-3.143 6-5.286 0-3.143-2.857-5.429-5.857-5.429" />
    </svg>
  );
}

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
      className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-elegant transition-transform hover:scale-105 hover:bg-[#128C7E] active:scale-95 sm:h-auto sm:w-auto sm:px-4 sm:py-3 sm:text-sm sm:font-semibold md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
