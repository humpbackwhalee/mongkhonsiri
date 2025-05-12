import Link from "next/link";
import Image from "next/image";

const content = {
    mainText: "สงบจิตใจไปกับการสวดมนต์",
    subText: "เข้าถึงบทสวดมนต์ต่างๆ ได้ง่าย สะดวก ทุกที่ทุกเวลา",
    CTAText: "ดูบทสวดมนต์",
    bannerImage: "/images/banner-image.jpg",
    bannerAlt: "ภาพแบนเนอร์",
};

export default function BannerSection() {
    return (
        <section className="h-[50vh] container mx-auto flex flex-row justify-center items-center bg-white text-black">
            <div className="px-6 md:px-0">
                <div className="flex flex-row justify-center items-center gap-20">
                    {/* ข้อความ */}
                    <div className="flex flex-col items-left gap-4 md:text-left">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
                            {content.mainText}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8">
                            {content.subText}
                        </p>
                        <Link
                            href="/prayer"
                            className="w-fit border border-black text-black font-medium py-3 px-8 rounded-full hover:bg-black hover:text-white transition-colors duration-300"
                        >
                            {content.CTAText}
                        </Link>
                    </div>

                    {/* รูปภาพ */}
                    <div className="flex justify-center">
                        <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden border border-gray-300">
                            <Image
                                src={content.bannerImage}
                                alt={content.bannerAlt}
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}