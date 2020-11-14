import { FunctionComponent, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { GrDeliver } from "react-icons/gr";
import { BsCheck } from "react-icons/bs";
import Layout from "../../components/Layout";
import { TProduct, ResponseServer, ProductImages } from "../../lib/types";
import { fetchStar } from "../../utils/fetchStar";
import styles from "../../styles/Product.module.css";
import Badges from "../../components/Badges";

interface Props {
  product: TProduct[];
}

const Product: FunctionComponent<Props> = ({ product }) => {
  const [isAddCart, setIsAddCart] = useState<boolean>(false);
  const [colorSelecter, setColorSelector] = useState<number>(0);
  const [sizeSelecter, setSizeSelector] = useState<string>("S");
  const [quantity, setQuantity] = useState<number>(1);

  if (!product.length) {
    return (
      <Layout>
        <div>Not found...</div>
      </Layout>
    );
  }

  const fetchOption = () => {
    const option = [];
    for (let i = 1; i <= 10; i++) {
      option.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return option;
  };

  const renderColors = (selected: number, items: ProductImages[]) => {
    const colors = [];
    items.map((imageAttribute, index) => {
      const backColor = {
        backgroundColor: imageAttribute.color ? imageAttribute.color : null,
      };

      if (imageAttribute.color) {
        return colors.push(
          <div
            key={imageAttribute.color}
            onClick={() => setColorSelector(index)}
            className={styles.colorWrapper}
            style={backColor ? backColor : null}
          >
            {selected === index ? (
              <span className={styles.color}>
                <BsCheck />
              </span>
            ) : null}
          </div>
        );
      } else {
        return null;
      }
    });

    return colors;
  };

  const addToCart = async () => {
    const color = productItem.attributes.images[colorSelecter].color;

    const response = await fetch("https://jjams.co/api/wallstore/add-to-cart", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productItem._id,
        color,
        size: sizeSelecter,
        quantity,
      }),
    });
    const result: ResponseServer = await response.json();

    if (!result.error) {
      setIsAddCart(true);

      setTimeout(() => {
        setIsAddCart(false);
      }, 3000);
    }
  };

  const renderSize = (items: string[]) => {
    const sizes = [];
    items.map((size) => {
      sizes.push(
        <div key={size} className={styles.sizeWrapper}>
          <input
            type="radio"
            id={size}
            name="size"
            checked={sizeSelecter === size ? true : false}
            onChange={() => {
              setSizeSelector(size);
            }}
            value={size}
          />
          <label htmlFor={size}>{size}</label>
        </div>
      );
    });

    return sizes;
  };

  const productItem = product[0];

  return (
    <Layout>
      <Badges isActive={isAddCart}>
        <span>Check your</span>
        <Link href="/wallstore/cart">
          <a className={styles.cartLink}>cart.</a>
        </Link>
      </Badges>
      <div className="wrapper">
        <div className={styles.productWrapper}>
          <div className={styles.productInfo}>
            <div
              className={styles.productImages}
              style={{
                backgroundImage: `url(${`https://jjams.co/api/wallstore/uploads/product/${productItem.attributes.images[colorSelecter].large}`})`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                objectFit: "contain",
              }}
            />
            <div className={styles.productDetail}>
              <div className={styles.productContentSection}>
                <Link href={`/category/${productItem.category}/1`}>
                  <a>
                    <h4>{productItem.category}</h4>
                  </a>
                </Link>
                <h2>{productItem.productName}</h2>
                <div className={styles.productRating}>
                  {fetchStar(productItem.rating)}
                  <span>({productItem.rating})</span>
                </div>
                <div className={styles.productPriceWrapper}>
                  <span>${productItem.salePrice}</span>
                  <span>${productItem.price}</span>
                </div>
              </div>
              <div
                className={`${styles.productAttributes} ${styles.productContentSection}`}
              >
                {productItem.attributes.images.length
                  ? productItem.attributes.images[0].color && (
                      <div className={styles.productColorsWrapper}>
                        <h4>Color:</h4>
                        <div className={styles.productColors}>
                          {renderColors(
                            colorSelecter,
                            productItem.attributes.images
                          )}
                        </div>
                      </div>
                    )
                  : null}
                {productItem.attributes.size.length ? (
                  <div className={styles.productSizeWrapper}>
                    <h4>Size:</h4>
                    <div className={styles.productSizes}>
                      {renderSize(productItem.attributes.size)}
                    </div>
                  </div>
                ) : null}
              </div>
              <div
                className={`${styles.productCart} ${styles.productContentSection}`}
              >
                <div className={styles.productQuantityWrapper}>
                  <div className={styles.quantity}>
                    <span>Qty:</span>
                    <select
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(parseInt(event.target.value))
                      }
                    >
                      {fetchOption()}
                    </select>
                  </div>
                  <button type="button" onClick={addToCart}>
                    Add to cart
                  </button>
                </div>
                <div className={styles.productDelivery}>
                  <GrDeliver />
                  <span>Free delivery</span>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.productDescription}>
            {productItem.description}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("https://jjams.co/api/wallstore/products");
  const result: ResponseServer = await response.json();

  const params = [];

  for (let product of result.result) {
    params.push({
      params: { slug: product.slug },
    });
  }

  return {
    paths: params,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `https://jjams.co/api/wallstore/product?slug=${params.slug}`
  );
  const result = await response.json();

  return {
    props: {
      product: result.result,
    },
  };
};

export default Product;
