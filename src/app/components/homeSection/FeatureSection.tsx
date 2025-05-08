import { FaListUl, FaEye, FaVolumeUp } from 'react-icons/fa'; // Import Icon Libraries (Font Awesome)

const features = [
  {
    id: 1,
    icon: <FaListUl className="w-10 h-10 text-indigo-500" />,
    title: 'สร้างเพลย์ลิสต์ส่วนตัว',
    description: 'จัดเก็บและสวดบทมนต์ที่คุณชื่นชอบได้อย่างง่ายดาย',
  },
  {
    id: 2,
    icon: <FaEye className="w-10 h-10 text-green-500" />,
    title: 'แสดง/ซ่อน คำอ่าน',
    description: 'ช่วยให้คุณสวดบทมนต์ได้อย่างถูกต้อง แม้ไม่คุ้นเคย',
  },
  {
    id: 3,
    icon: <FaEye className="w-10 h-10 text-blue-500" />,
    title: 'แสดง/ซ่อน คำแปล',
    description: 'เข้าใจความหมายของบทสวด เพื่อการภาวนาที่ลึกซึ้งยิ่งขึ้น',
  },
  {
    id: 4,
    icon: <FaVolumeUp className="w-10 h-10 text-orange-500" />,
    title: 'เสียงสวดมนต์',
    description: 'รับฟังเสียงสวดมนต์เพื่อความสงบและเป็นแนวทางในการสวด',
  },
  // คุณสามารถเพิ่มคุณสมบัติอื่นๆ ได้ที่นี่
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          คุณสมบัติเด่น
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}