import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiDelete } from "react-icons/fi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Layout from "../components/Layout";
import { ResponseServer, TCart } from "../lib/types";
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<TCart[] | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCart();
    setLoading(false);
  }, []);

  const fetchCart = async () => {
    const response = await fetch("https://jjams.co/api/wallstore/cart", {
      credentials: "include",
    });
    const result: ResponseServer = await response.json();

    if (!result.error) {
      setCart(result.result);
    }
  };

  const handleDelete = async (cartProductId: string) => {
    const response = await fetch("https://jjams.co/api/wallstore/delete-cart", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartProductId }),
    });
    const result: ResponseServer = await response.json();

    if (!result.error) {
      fetchCart();
    }
  };

  const handleQuantity = async (cartProductId: string, quantity: number) => {
    if (quantity < 1) {
      const response = await fetch(
        "https://jjams.co/api/wallstore/delete-cart",
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartProductId }),
        }
      );
      await response.json();
    } else {
      const response = await fetch(
        "https://jjams.co/api/wallstore/update-cart",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartProductId, quantity }),
        }
      );
      await response.json();
    }

    fetchCart();
  };

  const calculateTotal = () => {
    if (cart && cart.length) {
      return cart.reduce((acc: number, cart: TCart) => {
        return acc + cart.price * cart.quantity;
      }, 0);
    }
  };

  if (loading) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    );
  }

  const handleCheckOut = async () => {
    if (window.confirm("Are you want to checkout?")) {
      const response = await fetch(
        "https://jjams.co/api/wallstore/create-order",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const { error }: ResponseServer = await response.json();

      if (!error) {
        router.push("/");
      }
    }
  };

  return (
    <Layout>
      <div className={`${styles.cartWrapper} wrapper`}>
        <h2>Cart</h2>
        {!cart || cart.length < 1 ? (
          <h4 style={{ marginTop: "5rem" }}>Cart is empty</h4>
        ) : (
          <div className="table-wrapper">
            <table className={styles.table}>
              <thead>
                <tr>
                  <td>Image</td>
                  <td>Product name</td>
                  <td>Attributes</td>
                  <td>Quantity</td>
                  <td>Price</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {cart && cart.length >= 1
                  ? cart.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <Link href={`/product/${product.slug}`}>
                            <a>
                              <img
                                src={`https://jjams.co/api/wallstore/uploads/product/${product.productImage}`}
                                alt={product.productImage}
                              />
                            </a>
                          </Link>
                        </td>
                        <td>{product.productName}</td>
                        <td>
                          <div className={styles.cartAttributes}>
                            <span>{product.size}</span>
                            <div
                              style={{
                                width: "3rem",
                                height: "3rem",
                                borderRadius: "50%",
                                backgroundColor: product.color,
                                border: "1px solid black",
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className={styles.quantityWrapper}>
                            <div
                              onClick={() =>
                                handleQuantity(
                                  product.cartProductId,
                                  product.quantity - 1
                                )
                              }
                            >
                              <MdChevronLeft />
                            </div>
                            <span>{product.quantity}</span>
                            <div
                              onClick={() =>
                                handleQuantity(
                                  product.cartProductId,
                                  product.quantity + 1
                                )
                              }
                            >
                              <MdChevronRight />
                            </div>
                          </div>
                        </td>
                        <td>${product.price}</td>
                        <td>
                          <div
                            className={styles.cartDelete}
                            onClick={() => handleDelete(product.cartProductId)}
                          >
                            <FiDelete />
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4}></td>
                  <td>
                    <span>Total: ${calculateTotal().toFixed(2)}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className={styles.checkOut}>
              <button type="button" onClick={handleCheckOut}>
                Check out
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
