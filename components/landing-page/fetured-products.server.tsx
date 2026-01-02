import { getFeturedProducts } from "@/lib/products/product-select";
import FeturedProducts from "./fetured-products";

export default async function FeturedProductsServer() {
    const products = await getFeturedProducts();

    const featuredProjects = products.map((p) => ({
        id: p.id,
        title: p.name,
        description: p.tagline,
        image: p.webImage,
        url: p.webURL,
        tags: p.tags,
        vote: p.vote,
        slug: p.slug
    }));

    return <FeturedProducts featuredProjects={featuredProjects} />;
}
