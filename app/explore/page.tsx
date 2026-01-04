import SectionHeader from "@/components/common/section-header";
import ProductSection from "@/components/explore/productSection";

const ExplorePage = async () => {
  return (
    <div className="py-20 sm:py-28">
      <div className="wrapper">
        <SectionHeader
          title="Explore All Products"
          subtitle="Browse and discover amazing projects from out community"
          actionLabel=""
        />
        <div className="sm:mt-10 mb-80">
          <ProductSection />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
