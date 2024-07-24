import Airport from "../../assets/airport.png";
import Support from "../../assets/support.png";
import Breakfast from "../../assets/english-breakfast.png";
import Guide from "../../assets/tour-guide.png";



const incentives = [
    {
        name: 'Free Airport Transfer',
        description: "Enjoy a free transfer from the airport to the riad to start your stay in complete tranquility.",
        imageSrc: Airport,
    },
    {
        name: '24/7 Customer Support',
        description: 'Our team is available at any time to answer your questions and assist you during your stay.',
        imageSrc: Support,
    },
    {
        name: 'Breakfast Included',
        description: "Start your day with a delicious breakfast included in your reservation.",
        imageSrc: Breakfast,
    },
    {
        name: 'Free Guided Tour',
        description: "Book with us and enjoy a free guided tour to discover the secrets of the medina.",
        imageSrc: Guide,
    },
];

export default function Incentive() {
    return (
    <div className="bg-gray-50" id="incentive">
        <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
                Our Services
            </h2>
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
                {incentives.map((incentive) => (
                    <div key={incentive.name}>
                        <img src={incentive.imageSrc} alt={incentive.name} className="h-24 w-auto"/>
                        <h3 className="mt-6 text-sm font-medium text-gray-900">{incentive.name}</h3>
                        <p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}
