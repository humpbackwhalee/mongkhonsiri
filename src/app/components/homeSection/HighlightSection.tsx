import Link from 'next/link';
import Image from 'next/image';

const highlightItems = [
  {
    id: 1,
    title: 'สวดมนต์ตอนเช้า',
    imageSrc: '/images/banner-image.jpg', // Replace with your actual image path
    alt: 'ภาพสวดมนต์ตอนเช้า',
    href: '/prayer/morning', // Replace with your actual link
  },
  {
    id: 2,
    title: 'สวดมนต์ก่อนนอน',
    imageSrc: '/images/banner-image.jpg', // Replace with your actual image path
    alt: 'ภาพสวดมนต์ก่อนนอน',
    href: '/prayer/evening', // Replace with your actual link
  },
];

export default function HighlightSection() {
  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlightItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src={item.imageSrc}
                  alt={item.alt}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  คลิกเพื่อไปยังบทสวดมนต์{item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}