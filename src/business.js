export const business = {
  name: 'Vishwa IT Solutions',
  phone: '+917666704188',
  phoneText: '+91 76667 04188',
  email: (import.meta.env.VITE_BUSINESS_EMAIL || '').trim(),
  streetAddress: 'Room no. 2, Chauhan Chawl, Hans Vijay Nagar, Hawai Pada',
  addressLocality: 'Nalasopara East',
  addressRegion: 'Maharashtra',
  postalCode: '401209',
  placeId: (import.meta.env.VITE_GOOGLE_PLACE_ID || '').trim(),
};
business.address = `${business.streetAddress}, ${business.addressLocality}, Vasai-Virar, ${business.addressRegion} ${business.postalCode}`;

export function whatsapp(message = 'Hi Vishwa IT Solutions, I’d like to make an enquiry.') {
  return `https://wa.me/${business.phone.slice(1)}?text=${encodeURIComponent(message)}`;
}

export const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`;
const mapsQuery = new URLSearchParams({
  api: '1',
  query: business.placeId ? business.name : `${business.name}, Nalasopara East, Vasai-Virar`,
});
if (business.placeId) mapsQuery.set('query_place_id', business.placeId);
export const mapsListing = `https://www.google.com/maps/search/?${mapsQuery}`;
export const justdialListing = 'https://www.justdial.com/Palghar/Vishwa-It-Solutions-Near-Rambharose-Hotel-Santosh-Bhavan-Nalasopara-East/022PXX22-XX22-211220161254-E5C8_BZDET';

export const money = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 2,
});

export const base = import.meta.env.BASE_URL;
