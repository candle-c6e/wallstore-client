import { GetStaticProps } from "next";
import { FunctionComponent } from "react";
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
    "https://jjams.co/api/wallstore/feature-products"
  );
  const { result: products }: ResponseServer = await responseProducts.json();

  const responseCategories = await fetch(
    "https://jjams.co/api/wallstore/categories"
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
