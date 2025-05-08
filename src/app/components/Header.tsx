import Link from "next/link";

export default function Header() {
  const navItem = [
    {
      id: 1,
      title: "บทสวดมนต์",
      href: "/prayer",
    },
  ];

  return (
    <header className="bg-white text-black container mx-auto">
      <div className="mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-medium tracking-wide hover:text-gray-600 transition-colors duration-200">
          มงคลสิริ
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-6 text-sm font-medium">
            {navItem.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="hover:text-gray-600 transition-colors duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
