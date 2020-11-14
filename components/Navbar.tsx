import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { FiLogIn, FiBox } from "react-icons/fi";
import { BiLogOut, BiBox } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { BsFillInboxFill } from "react-icons/bs";
import styles from "../styles/Navbar.module.css";
import { UserContext } from "../context/userContext";
import { TUserContext, ResponseServer, Category } from "../lib/types";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext) as TUserContext;
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowCategory, setIsShowCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategory();
    if (!user) {
      fetchUser();
    }
  }, [user]);

  const fetchCategory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/categories`
    );
    const { result }: ResponseServer = await response.json();

    setCategories(result);
  };

  const fetchUser = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/me`, {
      credentials: "include",
    });
    const result: ResponseServer = await response.json();
    if (!result.error) {
      setUser(result.result);
    }
  };

  const handleLogout = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const result: ResponseServer = await response.json();
    if (!result.error) {
      window.location.href = process.env.NEXT_PUBLIC_BASEURL;
    }
  };

  const variants = {
    initial: { transition: { duration: 0.4 }, x: "100%" },
    animate: {
      transition: {
        duration: 0.4,
      },
      x: 0,
    },
  };

  const variantsCategory = {
    initial: { transition: { duration: 0.4 }, x: "-100%" },
    animate: {
      transition: {
        duration: 0.4,
      },
      x: 0,
    },
  };

  return (
    <>
      <nav className={`${styles.navbar} wrapper`}>
        <div className={styles.logoWrapper}>
          <span
            onClick={() => setIsShowCategory(true)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <GiHamburgerMenu size={20} />
          </span>
          <Link href={`${process.env.NEXT_PUBLIC_BASEURL}`}>
            <a>
              <span>logo</span>
            </a>
          </Link>
        </div>
        <div>search</div>
        <div
          className={styles.profileWrapper}
          onClick={() => setIsShowMenu(!isShowMenu)}
        >
          <AiOutlineUser />
          <span>{user ? user.name : "Account"}</span>
        </div>
      </nav>
      <div className={styles.navbarSecond}>{/* <p>WallStore</p> */}</div>
      <motion.div
        variants={variantsCategory}
        initial="initial"
        animate={isShowCategory ? "animate" : "initial"}
        className={styles.menuCategoryWrapper}
      >
        <div className={styles.menuCategoryHeader}>
          <h2>WallStore</h2>
          <span
            onClick={() => setIsShowCategory(false)}
            style={{ cursor: "pointer" }}
          >
            <FaTimes size={30} />
          </span>
        </div>
        <div>
          {categories &&
            categories.map((category) => (
              <div className={styles.menuCategoryItem}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_BASEURL}/category/${category.categoryName}/1`}
                >
                  <a>
                    <h3>{category.categoryName}</h3>
                  </a>
                </Link>
              </div>
            ))}
        </div>
      </motion.div>
      <motion.div
        variants={variants}
        initial="initial"
        animate={isShowMenu ? "animate" : "initial"}
        className={styles.accountWrapper}
      >
        <div className={styles.accountDetailWrapper}>
          <div className={styles.accountDetail}>
            <div className={styles.accountAvatar}>
              <AiOutlineUser />
            </div>
            <span>{user ? user.name : "Account"}</span>
          </div>
          <div
            onClick={() => setIsShowMenu(false)}
            style={{ cursor: "pointer" }}
          >
            <FaTimes size={30} />
          </div>
        </div>
        <ul>
          {user ? (
            <>
              {user.roles === "admin" && (
                <>
                  <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/category`}>
                    <a>
                      <li>
                        <FiBox />
                        <span>Category</span>
                      </li>
                    </a>
                  </Link>
                  <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/product`}>
                    <a>
                      <li>
                        <BiBox />
                        <span>Product</span>
                      </li>
                    </a>
                  </Link>
                </>
              )}
              <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/order`}>
                <a>
                  <li>
                    <BsFillInboxFill />
                    <span>Order</span>
                  </li>
                </a>
              </Link>
              <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/cart`}>
                <a>
                  <li>
                    <AiOutlineShoppingCart />
                    <span>Cart</span>
                  </li>
                </a>
              </Link>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                <BiLogOut />
                <span>Logout</span>
              </li>
            </>
          ) : (
            <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/login`}>
              <a>
                <li>
                  <FiLogIn />
                  <span>Login</span>
                </li>
              </a>
            </Link>
          )}
        </ul>
      </motion.div>
    </>
  );
};

export default Navbar;
