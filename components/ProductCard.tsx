import { FunctionComponent } from "react";
import Link from "next/link";
import { TProduct } from "../lib/types";
import styles from "../styles/ProductCard.module.css";
import { fetchStar } from "../utils/fetchStar";

interface Props {
  product: TProduct;
}

const ProductCard: FunctionComponent<Props> = ({ product }) => {
  return (
    <div className={styles.productCardWrapper}>
      <Link href={`/wallstore/product/${product.slug}`}>
        <a>
          <img
            src={`https://jjams.co/api/wallstore/uploads/product/${product.attributes.images[0].small}`}
            alt={product.productName}
          />
          <p className={styles.productName}>{product.productName}</p>
          <div className={styles.ratingWrapper}>
            {fetchStar(product.rating)}
          </div>
          <div className={styles.productCardPrice}>
            <span>${product.salePrice}</span>
            <span>${product.price}</span>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default ProductCard;
