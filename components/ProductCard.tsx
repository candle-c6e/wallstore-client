import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";
import { TProduct } from "../lib/types";
import styles from "../styles/ProductCard.module.css";
import { fetchStar } from "../utils/fetchStar";

interface Props {
  product: TProduct;
}

const ProductCard: FunctionComponent<Props> = ({ product }) => {
  return (
    <div className={styles.productCardWrapper}>
      <Link
        href={`${process.env.NEXT_PUBLIC_BASEURL}/product/[slug]`}
        as={`${process.env.NEXT_PUBLIC_BASEURL}/product/${product.slug}`}
      >
        <a>
          <div className={styles.productCard}>
            <Image
              src={`/product/${product.attributes.images[0].small}`}
              width="300"
              height="300"
              alt={product.productName}
            />
            <p className={styles.productName}>{product.productName}</p>
            <div className={styles.ratingWrapper}>
              {fetchStar(product.rating, null, null, null, null)}
            </div>
            <div className={styles.productCardPrice}>
              <span>${product.salePrice}</span>
              <span>${product.price}</span>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ProductCard;
