import { GetStaticProps } from "next";
import { FunctionComponent } from "react";
import { NextSeo } from "next-seo";
import CategoryCard from "../components/CategoryCard";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { TProduct, ResponseServer, Category } from "../lib/types";
import styles from "../styles/Home.module.css";

interface Props {
  products: TProduct[];
  categories: Category[];
}

const Home: FunctionComponent<Props> = ({ products, categories }) => {
  return (
    <Layout>
      <NextSeo
        title="wallstore | ecommerce"
        description="wallstore ecommerce this site power by nextjs"
      />
      <div className="wrapper">
        <div className={styles.featureWrapper}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className={styles.categoriesWrapper}>
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const responseProducts = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL_API}/feature-products`
  );
  const { result: products }: ResponseServer = await responseProducts.json();

  const responseCategories = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL_API}/categories`
  );
  const {
    result: categories,
  }: ResponseServer = await responseCategories.json();

  return {
    props: {
      products,
      categories,
    },
  };
};

export default Home;
