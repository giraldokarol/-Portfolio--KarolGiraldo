import './App.css'

// Images
import LogoImage from './assets/img/logo.png';
import LogoFooter from './assets/img/logo-footer.png';
import HeroImage from './assets/img/hero-image.png';
import CoverWebApp from './assets/img/cover-web-app.png';
import CoverDriverApp from './assets/img/cover-app-driver.png';
import CoverCMCIC from './assets/img/cover-cmcic.png';
import CoverTuLindero from './assets/img/cover-tulindero.png';
import Portrait from './assets/img/portrait_karol.png';

// Animations
import { Lottie } from "lottie-react";
import animationData from "@/assets/animations/scroll_down.json";
import { useEffect, useState } from "react";

// Icons
import { Download, ContactRound, Mail } from "lucide-react";

// Components
import Cards from './assets/components/Cards';


const CV_URL = "/CV_KarolGiraldo_FR.pdf";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
];

const socialMediaLinks = [
  { label: "Behance", href: "https://www.behance.net/karolGiraldoFrames" },
  { label: "Figma Community", href: "https://www.figma.com/@giraldokarol" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/karol-giraldo-escobar/" }
];


function App() {

  function Logo({ className = "" }: { className?: string }) {
    return (
      <div className={`logo-image ${className}`}>
        <img src={LogoImage} alt="Karol G"/>
      </div>
    );
  }

  function ScrollAnimation() {
    return (
      <Lottie
        src={animationData}
        loop
        autoplay
        className="w-15"
      />
    );
  }

  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="hero-section min-h-dvh relative overflow-x-hidden">
        <span aria-hidden="true" className='hero-background-text'> Designer </span>

        <header className={`main-header ${isScrolled ? "main-header--scrolled" : ""}`} >
          <nav className="mx-auto flex main-nav max-width-page items-center justify-between px-6" aria-label="Main navigation" >
            <a href="/" title='Karol G (Home)'>
              <Logo />
            </a>

            <div className="flex items-center gap-2 sm:gap-8">
              <ul className=" nav-links hidden items-center gap-8 md:flex">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`nav-link ${
                        activeSection === link.href.replace("#", "")
                          ? "nav-link--active"
                          : ""
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <a href={CV_URL} download className="btn-primary inline-flex items-center gap-2">
                <Download size={18} /> Download CV
              </a>
            </div>
          </nav>
        </header>

        <div className='absolute left-12 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 hidden lg:block'>
          <ul className='flex items-center gap-12 whitespace-nowrap'>
            {socialMediaLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors link-functions uppercase text-sm"
                  title={`${link.label} Profile`}
                  target='_blank'
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <section
          className="mx-auto flex h-screen mw-full flex-col px-6"
          id="home"
        >
          <div className='flex flex-1 flex-col items-center justify-center'>
            <img
              src={HeroImage}
              alt='Product Thinking'
              className='w-3xs mb-4'
            />

            <h1 className="max-w-5xl text-5xl leading-[1.02] font-extrabold tracking-tight text-balance sm:text-7xl lg:text-8xl text-center z-1">
              Hey! I’m Karol{" "}
              <span className="text-primary">
                Product Designer
              </span>
            </h1>

            <p className="mt-8 text-xl text-center max-w-2xl z-1">
              Curious about people and digital products, working across UX and UI to make them better to use.
            </p>
          </div>

          <div className='mb-8 flex justify-center hidden lg:flex'>
            <a
              className=''
              href='#projects'
              title='Go to projects'
            >
              <ScrollAnimation/>
            </a>
          </div>
        </section>

      </div>

      <main role='main'>

        <section
          id='projects'
          className=' pb-12 lg:pt-24 bg-white'
        >
          <div className='max-width-page mx-auto px-6 text-center xl:text-left'>
            <p className='pretitle'>
              portfolio
            </p>

            <h2 className='max-w-5xl mx-auto xl:mx-0 text-5xl font-extrabold tracking-tight text-balance sm:text-7xl mb-2 '>
              Case Studies
            </h2>

            <p className='mt-5 text-lg text-muted-foreground xl:max-w-2xl'>
              Behind the interface: the product thinking, trade-offs and design decisions that shaped each solution.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-10 max-width-page mx-auto px-6">

            <article className="col-span-12 md:col-span-7 card">
              <Cards
                href="#"
                title="Interface"
                categories={["UX/UI", "Product Design"]}
                description="Designing a clearer way for fleet managers to understand vehicle status and act on what matters."
                image={CoverWebApp}
                imageAlt="Fleet management product interface"
              />
            </article>

            <article className="col-span-12 md:col-span-5 card">
              <Cards
                href="#"
                title="Driver App"
                categories={["Mobile Product", "Driver Experience"]}
                description="Designing a mobile experience that gives drivers the right information at the right moment — without getting in the way of the job."
                image={CoverDriverApp}
                imageAlt="Fleet Driver application product interface"
              />
            </article>

            <article className="col-span-12 md:col-span-5 card">
              <Cards
                href="#"
                title="Crédit Mutuel & CIC"
                categories={["UX/UI Redesign", "Design System"]}
                description="Bringing clarity and consistency to complex banking experiences, while preserving what makes each brand recognizable"
                image={CoverCMCIC}
                imageAlt="Fleet management product interface"
              />
            </article>

            <article className="col-span-12 md:col-span-7 card">
              <Cards
                href="#"
                title="TuLindero.com"
                categories={["UX/UI", "Real Estate"]}
                description="Rethinking the property search experience to make finding and exploring homes more intuitive"
                image={CoverTuLindero}
                imageAlt="Real Estate Product Interface"
              />
            </article>

          </div>
        </section>

        <section
          id='about'
          className=' pb-12 lg:pt-32 bg-white'
        >
          <div className='max-width-page mx-auto px-6 flex flex-col xl:flex-row gap-12 items-center'>

            <div className="order-2 w-full lg:order-1 xl:w-1/2 text-center xl:text-left">

              <p className='pretitle'>
                a bit about me
              </p>

              <h2 className='max-w-5xl mx-auto xl:mx-0 text-5xl font-extrabold tracking-tight text-balance sm:text-7xl mb-2 '>
                From interfaces to products
              </h2>

              <img
                src={Portrait}
                alt="Portrait"
                className='block xl:hidden w-full max-h-[420px] object-contain mb-8 mt-8'
              />

              <p className='mt-5 text-lg text-muted-foreground xl:max-w-2xl mb-8'>
                I’m a Product Designer with <strong>8+ years of experience</strong> across mobility, banking and digital services, designing B2B platforms, web and mobile applications.
                <br></br>
                <br></br>
                My work spans <strong>UX/UI, user research and design systems,</strong> with a strong focus on accessibility, complex workflows and data-rich products.
                I bring together product thinking and strong UI craft to create experiences that are clear, consistent and built to scale.
              </p>

              <div className='flex gap-4 justify-center xl:justify-start'>
                <a href={CV_URL} download className="btn-primary inline-flex items-center gap-2">
                  <Download size={18} /> Download CV
                </a>

                <a
                  href="https://www.linkedin.com/in/karol-giraldo-escobar/"
                  target='_blank'
                  className="btn-secondary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-m font-semibold"
                >
                  <ContactRound size={18}/> Linkedin
                </a>
              </div>

            </div>

            <div className="order-1 w-full lg:order-2 xl:w-1/2 flex justify-center realative">
              <img
                src={Portrait}
                alt="Portrait Karol"
                className='w-full max-h-[420px] object-contain xl:max-h-none lg:object-fill hidden xl:block '
              />
            </div>

          </div>
        </section>

      </main>

      <footer className='bg-white'>
        <div className='max-width-page mx-auto footer pt-16 pb-16 px-6 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10'>

          <div className='flex lg:min-w-[200px] justify-center'>
            <img
              src={LogoFooter}
              alt="Karol G Short Logo"
              className='w-[70px] lg:w-[90px]'
            />
          </div>

          <div className='flex flex-col md:flex-row md:justify-center md:items-start gap-10 md:gap-16 lg:contents'>

            <div className='flex flex-col items-center text-center md:items-start md:text-left'>
              <p className='font-bold tracking-tight text-4xl lg:text-5xl text-primary mb-2'>
                Let's talk
              </p>

              <p className='info'>
                Have something in mind? I’d be happy to hear from you.
              </p>

              <p className='flex items-center gap-2 info'>
                <Mail size={18}/>
                <span>karol.giraldo9505@gmail.com</span>
              </p>
            </div>

            <div className='flex flex-col items-center text-center md:items-start md:text-left'>
              <p className='text-xl font-bold tracking-tight mb-2 text-primary'>
                Social Media
              </p>

              <ul className='flex flex-col gap-1'>
                {socialMediaLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="link-functions"
                      title={`${link.label} Profile`}
                      target='_blank'
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}

export default App