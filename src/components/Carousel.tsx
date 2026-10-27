import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

type CarouselProps = {
  children: React.ReactNode;
  onApiReady?: (api: ReturnType<typeof useEmblaCarousel>[1]) => void;
};

export default function Carousel({ children, onApiReady }: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: false,
    });

    useEffect(() => {
        if (emblaApi && onApiReady) {
            onApiReady(emblaApi);
        }
    }, [emblaApi, onApiReady]);

    return (
        <div>
            <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6">
                {children}
            </div>
            </div>
        </div>
    );
}