import { ArrowRight } from "lucide-react";

// Tarjeta de caso de estudio. Estilos: styles/components/_project-card.scss
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
    <div className="project-card">

      <div className="project-card__body">
        <ul className="project-card__tags">
          {categories.slice(0, 2).map((category) => (
            <li key={category} className="project-card__tag">
              {category}
            </li>
          ))}
        </ul>

        <h3 className="project-card__title">
          {title}
        </h3>

        <p className="project-card__description">
          {description}
        </p>
      </div>

      <div className="project-card__media">

        <div className="project-card__image-frame">
          <img src={image} alt={imageAlt} className="project-card__image" />
        </div>

        <a href={href} aria-label={readMoreAriaLabel} className="project-card__link">
          {readMoreLabel}

          <span className="project-card__link-icon">
            <ArrowRight aria-hidden="true" />
          </span>
        </a>

      </div>

    </div>
  );
}
