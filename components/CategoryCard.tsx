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
        href={`/category/${category._id}`}
        as={`/category/${category.categoryName}/1`}
      >
        <a>
          <div className={styles.categoryWrapper}>
            <img
              src={`https://jjams.co/api/wallstore/uploads/category/${category.images[0].small}`}
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
