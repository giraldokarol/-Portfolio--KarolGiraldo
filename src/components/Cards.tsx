import { ArrowRight } from "lucide-react";

type CardsProps = {
  title: string;
  categories: string[];
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  readMoreLabel: string;
  readMoreAriaLabel: string;
};

export default function Cards({
  title,
  categories,
  description,
  image,
  imageAlt,
  href,
  readMoreLabel,
  readMoreAriaLabel,
}: CardsProps) {
  return (
    <div className="group flex h-full flex-col">

      <div className="flex flex-col pt-8 pr-8 pl-8">
        <ul className="flex gap-2 mb-10">
          {categories.slice(0, 2).map((category) => (
            <li key={category} className="tag">
              {category}
            </li>
          ))}
        </ul>

        <h3 className="text-4xl font-extrabold mb-2">
          {title}
        </h3>

        <p className="mb-8">
          {description}
        </p>
      </div>

      <div className="relative mt-auto">

        <div className="h-[270px] overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <a
          href={href}
          aria-label={readMoreAriaLabel}
          className="group/button absolute bottom-8 left-8 flex items-center gap-3 rounded-full border border-white/30 bg-white/20 px-5 py-3 text-sm font-medium backdrop-blur-md transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
        >
          {readMoreLabel}

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover/button:bg-black group-hover/button:text-white group-hover/button:-rotate-45">
            <ArrowRight className="w-4" />
          </span>
        </a>

      </div>

    </div>
  );
}
