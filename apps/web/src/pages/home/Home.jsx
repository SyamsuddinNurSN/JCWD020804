
import { Navbarpage } from '../../components/navbar';
import { CarouselCustomArrows } from '../../components/carousel';
import { SimpleFooter } from '../../components/footer';
import { HotelCard } from '../../components/propertyList/propertyCard';

export default function Home() {
  return (
    <div className="bg-white">
      <div className="w-full mx-auto">
        <div className="w-[90%] mx-auto py-[20px]">
          <Navbarpage />
        </div>
        <div className="w-[90%] h-[500px] mx-auto py-[20px]">
          <CarouselCustomArrows />
        </div>

        <div className="w-[90%] mx-auto py-[20px]">
          {/* <BookingCard /> */}
          <HotelCard />
        </div>
        <div className="w-[90%] mx-auto py-[20px]">
          <SimpleFooter />
        </div>
      </div>
    </div>
  );
}
