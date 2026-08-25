import '../src/styles.css'

export const metadata = {
  title: 'BASE4 SYSTEMS | Do hardware ao software',
  description: 'Da manutenção de computadores ao desenvolvimento de sites, sistemas e automações. Tecnologia completa em Bilac e para todo o Brasil.',
  keywords: ['manutenção de computadores em Bilac', 'assistência técnica em Bilac', 'desenvolvimento de sites', 'sistemas sob medida', 'automações empresariais', 'BASE4 SYSTEMS'],
  alternates: { canonical: 'https://base4systems.com.br/' },
  openGraph: { title: 'BASE4 SYSTEMS — Do hardware ao software', description: 'Infraestrutura física e soluções digitais em uma única base tecnológica.', type: 'website', locale: 'pt_BR', url: 'https://base4systems.com.br/', images: ['/assets/brand/base4-social.jpg'] },
  icons: { icon: '/assets/brand/base4-favicon.png', apple: '/assets/brand/base4-symbol-512.png' },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#05070a' }

const localBusiness = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'BASE4 SYSTEMS', url: 'https://base4systems.com.br/',
  description: 'Manutenção de computadores, desenvolvimento de sites, sistemas e automações.',
  address: { '@type': 'PostalAddress', streetAddress: 'Rua XV de Novembro, 283', addressLocality: 'Bilac', addressRegion: 'SP', addressCountry: 'BR' },
  geo: { '@type': 'GeoCoordinates', latitude: -21.4055942, longitude: -50.4757713 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '12:00' },
  ],
  areaServed: ['Bilac', 'Brasil'],
}

export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />{children}</body></html>
}
