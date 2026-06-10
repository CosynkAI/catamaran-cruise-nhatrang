export const BUSINESS = {
  name: 'Catamaran Cruises · Nha Trang',
  streetAddress: '388 Võ Thị Sáu, Bến Tàu Du Lịch Nha Trang',
  addressLocality: 'Nha Trang',
  addressRegion: 'Khanh Hoa',
  addressCountry: 'VN',
};

/** @param {{ whatsapp: string, email: string, telegram: string, instagram: string }} contacts @param {{ url: string, ogImage: string }} site */
export function buildTravelAgencyProvider(contacts, site) {
  return {
    '@type': 'TravelAgency',
    name: BUSINESS.name,
    url: site.url,
    telephone: `+${contacts.whatsapp}`,
    email: contacts.email,
    image: site.ogImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    sameAs: [`https://t.me/${contacts.telegram}`, contacts.instagram],
  };
}
