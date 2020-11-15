import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";
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
            <Image
              src={`/category/${category.images[0].small}`}
              width="100"
              height="100"
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
