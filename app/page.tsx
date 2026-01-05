import ContactUs from "@/components/landing-page/ContactUs";
import FeturedProductsServer from "@/components/landing-page/fetured-products.server";
import Hero from "@/components/landing-page/hero-section";
import Sentnce from "@/components/landing-page/sentance";
import FeaturedCardSkeleton from "@/components/ui/fetured-card-skeleton";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedCardSkeleton count={6} header={true} />}>
        <FeturedProductsServer />
      </Suspense>
      <Sentnce />
      <ContactUs />
    </>
  );
}

// export default Home;
