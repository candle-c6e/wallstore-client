import { useState, useEffect, SyntheticEvent } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { OptionTypeBase } from "react-select";
import CreatableSelect from "react-select/creatable";
import { TiDeleteOutline } from "react-icons/ti";
import { Category, ResponseServer, TProduct } from "../../lib/types";
import Layout from "../../components/Layout";
import Badges from "../../components/Badges";
import styles from "../../styles/manage/product/add.module.css";

interface Input {
  productName: string;
  category: string;
  description: string;
  price: string;
  salePrice: string;
  color: string[] | null;
  size: string[] | null;
}

const AddProduct = () => {
  const router = useRouter();
  const [category, setCategory] = useState<Category[]>(null);
  const [colorGroup, setColorGroup] = useState<string[] | null>([]);
  const [imageColorGroup, setImageColorGroup] = useState<any[] | null>([]);
  const [size, setSize] = useState<OptionTypeBase[] | null>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const { register, errors, handleSubmit, reset, watch } = useForm<Input>();

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/categories`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const { error, result }: ResponseServer = await response.json();

    if (!error) {
      setCategory(result);
    }
  };

  const handleSize = (value: any) => {
    setSize(value);
  };

  const handleColor = (event: any, index: number) => {
    const duplicateGroup = [...colorGroup];
    duplicateGroup[index] = event.target.value;
    setColorGroup(duplicateGroup);
  };

  const handleImageColor = (event: any, index: number) => {
    const duplicateImage = [...imageColorGroup];
    duplicateImage[index] = event.target.files[0];
    setImageColorGroup(duplicateImage);
  };

  const addColorGroup = () => {
    const duplicateColoGroup = [...colorGroup, null];
    setColorGroup(duplicateColoGroup);
  };

  const onSubmit = async (data: Input) => {
    if (!colorGroup.length) {
      setError(true);
      setErrorMessage("Attribute is required.");
      return;
    }

    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("categoryId", data.category);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("salePrice", data.salePrice);

    if (size && size.length) {
      for (let item of size) {
        formData.append("size", item.value);
      }
    }

    if (colorGroup.length) {
      for (let color of colorGroup) {
        formData.append("color", color ? color : null);
      }
    }

    if (imageColorGroup.length) {
      for (let image of imageColorGroup) {
        formData.append("productImage", image);
      }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/product`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );
    const { error, msg }: ResponseServer = await response.json();
    if (error) {
      setError(error);
      setErrorMessage(msg);
      reset();
    } else {
      router.push("/product");
    }
  };

  const handleDeleteGroup = (index: number) => {
    const duplicateGroup = [...colorGroup];
    duplicateGroup.splice(index, 1);
    setColorGroup(duplicateGroup);
  };

  return (
    <Layout>
      <Badges isActive={error} type="danger">
        <span>{errorMessage}</span>
      </Badges>
      <div className="wrapper">
        <div className="form-manage__header">
          <h3>Add Product</h3>
        </div>
        <div className="content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="productName">Product name</label>
              <input
                type="text"
                name="productName"
                id="productName"
                ref={register({ required: true })}
              />
              {errors.productName && (
                <p className="error-text">Product Name is required</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select name="category" id="category" ref={register()}>
                {category &&
                  category.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.categoryName}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <p className="error-text">Category is required</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                style={{ height: "100%" }}
                name="description"
                id="description"
                ref={register({ required: true })}
                rows={5}
              ></textarea>
              {errors.description && (
                <p className="error-text">description is required</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                name="price"
                id="price"
                placeholder="example: 10.99"
                ref={register({
                  required: true,
                  pattern: /^[0-9]{1,4}.[0-9]{2}$/,
                })}
              />
              {errors.price && errors.price.type === "required" && (
                <p className="error-text">Price is required</p>
              )}
              {errors.price && errors.price.type === "pattern" && (
                <p className="error-text">Price is invalid</p>
              )}
              {errors.price && errors.price.type === "validate" && (
                <p className="error-text">Price is less price</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="salePrice">Sale price</label>
              <input
                type="text"
                name="salePrice"
                id="salePrice"
                placeholder="example: 10.99"
                ref={register({
                  required: true,
                  pattern: /^[0-9]{1,4}.[0-9]{2}$/,
                  validate: (value: any) =>
                    parseFloat(value) <= parseFloat(watch("price")),
                })}
              />
              {errors.salePrice && errors.salePrice.type === "required" && (
                <p className="error-text">Sale Price is required</p>
              )}
              {errors.salePrice && errors.salePrice.type === "pattern" && (
                <p className="error-text">Sale Price is invalid</p>
              )}
              {errors.salePrice && errors.salePrice.type === "validate" && (
                <p className="error-text">Sale Price is less price</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="color">Color</label>
              {colorGroup &&
                colorGroup.map((group, index) => (
                  <div key={index} className={styles.colorGroup}>
                    <input
                      type="color"
                      value={`${group}`}
                      onChange={(event) => handleColor(event, index)}
                    />
                    <input
                      type="file"
                      onChange={(event) => handleImageColor(event, index)}
                    />
                    <span
                      className={styles.deleteGroup}
                      onClick={() => handleDeleteGroup(index)}
                    >
                      <TiDeleteOutline />
                    </span>
                  </div>
                ))}
              <button type="button" onClick={addColorGroup}>
                Add Color
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="size">Size</label>
              <CreatableSelect
                id="size"
                isMulti
                name="size"
                placeholder="size"
                value={size && size}
                onChange={(value) => handleSize(value)}
                styles={{ input: () => ({ height: "4rem" }) }}
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const responseMe = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/me`, {
    credentials: "include",
    headers: {
      Cookie: req.headers.cookie,
    },
  });
  const { error, result }: ResponseServer = await responseMe.json();

  if (error || result.roles !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/wallstore",
      },
    };
  }

  return {
    props: {},
  };
};

export default AddProduct;
