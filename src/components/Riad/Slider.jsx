import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { FreeMode, Pagination } from "swiper/modules";

import { RxCrop, RxPencil2, RxDesktop, RxReader, RxRocket, RxAccessibility } from "react-icons/rx";
import { RxArrowTopRight } from "react-icons/rx";

import amenities from "../../assets/amenities.jpg";
import architecture from "../../assets/architecture.jpg";
import hospitality from "../../assets/hospitality.jpg";
import culture from "../../assets/culture.jpg";
import relaxation from "../../assets/relaxation.jpg";
import dining from "../../assets/dining.jpg";

const RiadData = [
    {
        icon: RxCrop,
        title: "Luxurious Amenities",
        content: "Experience top-notch amenities including pools, spas, and lounges.",
        backgroundImage: amenities,
    },
    {
        icon: RxPencil2,
        title: "Stunning Architecture",
        content: "Marvel at the intricate design and historical beauty of our Riads.",
        backgroundImage: architecture,
    },
    {
        icon: RxDesktop,
        title: "Exceptional Hospitality",
        content: "Enjoy warm and personalized service from our dedicated staff.",
        backgroundImage: hospitality,
    },
    {
        icon: RxReader,
        title: "Cultural Experiences",
        content: "Immerse yourself in local culture with unique activities and tours.",
        backgroundImage: culture,
    },
    {
        icon: RxAccessibility,
        title: "Relaxation Spots",
        content: "Find peace in our tranquil gardens, courtyards, and relaxation areas.",
        backgroundImage: relaxation,
    },
    {
        icon: RxRocket,
        title: "Gourmet Dining",
        content: "Savor exquisite Moroccan cuisine in our elegant dining areas.",
        backgroundImage: dining,
    },
];

export function Slider() {
    return (
        <div className="flex items-center justify-center flex-col h-screen" id="slider">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
                Discover and Book Your Stay
            </h2>
            <Swiper
                breakpoints={{
                    340: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    },
                    700: {
                        slidesPerView: 3,
                        spaceBetween: 15
                    }
                }}
                freeMode={true}
                pagination={{
                    clickable: true
                }}
                modules={[FreeMode, Pagination]}
                className="max-w-[90%] lg:max-w-[80%]"
            >
                {RiadData.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="flex flex-col gap-6 mb-20 group relative shadow-lg text-white rounded-xl px-6 py-8 h-[250px] w-[215px] lg:h-[400px] lg:w-[350px] overflow-hidden cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{backgroundImage: `url(${item.backgroundImage})`}}
                            />
                            <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-50"/>
                            <div className="relative flex flex-col gap-3">
                                <item.icon className="text-blue-600 group-hover:text-blue-400 w-[32px] h-[32px]"/>
                                <h1 className="text-xl lg:text-2xl">{item.title}</h1>
                                <p className="lg:text-[18px]">{item.content}</p>
                            </div>
                            <RxArrowTopRight
                                className="absolute bottom-5 left-5 w-[35px] h-[35px] text-white group-hover:text-blue-500 group-hover:rotate-45 duration-100"/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
