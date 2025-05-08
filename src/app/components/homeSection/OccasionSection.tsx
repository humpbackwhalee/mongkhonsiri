import Link from 'next/link';
import Image from 'next/image';

const occasionPrayers = [
  {
    id: 1,
    title: 'บทสวดมนต์วันเกิด',
    imageSrc: '/images/banner-image.jpg', // Replace with your actual image path
    alt: 'ภาพบทสวดมนต์วันเกิด',
    href: '/prayer/birthday', // Replace with your actual link
  },
  {
    id: 2,
    title: 'บทสวดมนต์ทำบุญ',
    imageSrc: '/images/banner-image.jpg', // Replace with your actual image path
    alt: 'ภาพบทสวดมนต์ทำบุญ',
    href: '/prayer/merit', // Replace with your actual link
  },
  {
    id: 3,
    title: 'บทสวดมนต์ขอพร',
    imageSrc: '/images/banner-image.jpg', // Replace with your actual image path
    alt: 'ภาพบทสวดมนต์ขอพร',
    href: '/prayer/wish', // Replace with your actual link
  },
  {
    id: 4,
    title: 'บทสวดมนต์ให้หายป่วย',
    imageSrc: '/images/banner-image.jpg', // Replace with your actual image path
    alt: 'ภาพบทสวดมนต์ให้หายป่วย',
    href: '/prayer/healing', // Replace with your actual link
  },
  // เพิ่มบทสวดมนต์ตามโอกาสอื่นๆ ได้ที่นี่
];

export default function OccasionSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          บทสวดมนต์ตามโอกาสต่างๆ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {occasionPrayers.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-48 sm:h-56">
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