import { FunctionComponent } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ReactPaginate from "react-paginate";
import Layout from "../../../components/Layout";
import ProductCard from "../../../components/ProductCard";
import { ResponseServer, TProduct } from "../../../lib/types";
import styles from "../../../styles/Category.module.css";

interface Props {
  products: TProduct[];
  totalPages: number;
  currentPage: number;
  category: string;
}

const Category: FunctionComponent<Props> = ({
  products,
  totalPages,
  currentPage,
  category,
}) => {
  const router = useRouter();

  const handlePageClick = (data) => {
    router.push(
      `${process.env.NEXT_PUBLIC_BASEURL}/category/${category}/${
        data.selected + 1
      }`
    );
  };

  return (
    <Layout>
      <div className={styles.productCategoryWrapper}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div>
        <ReactPaginate
          previousLabel={<MdChevronLeft size={20} />}
          nextLabel={<MdChevronRight size={20} />}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(
    "https://jjams.co/api/wallstore/categories-list"
  );
  const { result }: ResponseServer = await response.json();

  const params = [];

  for (let category of result) {
    params.push({
      params: category,
    });
  }

  return {
    paths: params,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL_API}/product-category?categoryName=${
      params.category
    }&page=${params.page || 1}`
  );
  const { result }: ResponseServer = await response.json();

  return {
    props: {
      category: params.category,
      currentPage: params.page,
      products: result.products,
      totalPages: result.totalPages,
    },
  };
};

export default Category;
