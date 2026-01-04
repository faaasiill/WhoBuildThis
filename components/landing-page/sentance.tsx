import { MagicText } from "../ui/magic-text";

const Sentnce = () => {
  return (
    <section className="hidden md:flex relative z-20 md:-mt-24 h-dvh rounded-[50px] overflow-hidden items-center justify-center bg-[radial-gradient(circle_at_center,_#fc5e03_0%,_#fc5e03_22%,_#fc4903_55%,_#fc4903_100%)]">
      <MagicText
        text={
          "'WhoBuildThis'  is a curated platform where developers, designers, and founders showcase real websites and the people behind them. Discover inspiring projects, explore modern web craftsmanship, and share your own work with a growing community that values clean design, solid technology, and thoughtful execution."
        }
      />
    </section>
  );
};

export default Sentnce;
