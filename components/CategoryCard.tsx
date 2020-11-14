import { FunctionComponent } from "react";
import Link from "next/link";
import { Category } from "../lib/types";
import styles from "../styles/CategoryCard.module.css";

interface Props {
  category: Category;
}

const CategoryCard: FunctionComponent<Props> = ({ category }) => {
  return (
    <div className={styles.categoryContainer}>
      <Link
        href={`${process.env.NEXT_PUBLIC_BASEURL}/category/${category._id}`}
        as={`${process.env.NEXT_PUBLIC_BASEURL}/category/${category.categoryName}/1`}
      >
        <a>
          <div className={styles.categoryWrapper}>
            <img
              src={`${process.env.NEXT_PUBLIC_BASEURL_API}/uploads/category/${category.images[0].small}`}
              alt={category.categoryName}
            />
            <p>{category.categoryName}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default CategoryCard;
