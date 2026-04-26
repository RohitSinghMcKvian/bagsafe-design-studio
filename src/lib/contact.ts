// Central place to update contact details. Replace these with your real ones.
export const BAGSAFE_CONTACT = {
  whatsappNumber: "919999999999", // E.164, no plus, no spaces
  phoneDisplay: "+91 99999 99999",
  email: "hello@bagsafe.in",
  address: "BagSafe HQ, 12 MG Road, Bengaluru 560001",
  hours: "Mon – Sun · 7am – 11pm IST",
};

export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${BAGSAFE_CONTACT.whatsappNumber}?text=${text}`;
}
