import { Hero } from "./blocks/hero";


function HeroDemo() {
  return (
    <Hero
      title="Choose Your Plan. Ignite Possibilities."
subtitle="Unlock powerful AI features tailored for you. Whether you're starting out or scaling up, we’ve got a plan that fits."
actions={[
  {
    label: "Explore Plans",
    href: "#pricing", // or an id you define for pricing
    variant: "outline"
  },
  {
    label: "Start Free",
    href: "#",
    variant: "default"
  }
]}
titleClassName="text-5xl md:text-6xl font-extrabold"
subtitleClassName="text-lg md:text-xl max-w-[600px]"
actionsClassName="mt-8"

    />
  );
}

export { HeroDemo }