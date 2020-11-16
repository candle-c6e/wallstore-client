import { useState, useEffect, SyntheticEvent } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { OptionTypeBase } from "react-select";
import CreatableSelect from "react-select/creatable";
import { TiDeleteOutline } from "react-icons/ti";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";
import {
  Category,
  ProductImages,
  ResponseServer,
  TProduct,
} from "../../lib/types";
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

const EditProduct = () => {
  const router = useRouter();
  const [product, setProduct] = useState<TProduct>(null);
  const [category, setCategory] = useState<Category[]>(null);
  const [colorGroup, setColorGroup] = useState<ProductImages[] | null>([]);
  const [imageColorGroup, setImageColorGroup] = useState<any[] | null>([]);
  const [size, setSize] = useState<OptionTypeBase[] | null>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const { register, errors, handleSubmit, reset, watch } = useForm<Input>();

  const query = router.query.productId;

  useEffect(() => {
    fetchCategory();
    fetchProduct();
  }, [query]);

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

  const fetchProduct = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/product-id?productId=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const { error, result }: ResponseServer = await response.json();

    if (!error) {
      const product = result[0];

      setProduct(product);

      if (product.attributes.images.length) {
        setColorGroup(
          product.attributes.images.map((attribute: ProductImages) => {
            return {
              _id: attribute._id,
              color: attribute.color,
              small: attribute.small,
              edit: true,
            };
          })
        );
      }

      if (product.attributes.size.length) {
        const sizes = product.attributes.size.map((size) => {
          return {
            label: size,
            value: size,
          };
        });

        setSize(sizes);
      }
    }
  };

  const handleSize = (value: any) => {
    setSize(value);
  };

  const handleColor = (event: any, index: number) => {
    const duplicateGroup = [...colorGroup];
    duplicateGroup[index] = {
      ...duplicateGroup[index],
      color: event.target.value,
    };
    setColorGroup(duplicateGroup);
  };

  const handleImageColor = (event: any, index: number) => {
    const duplicateImage = [...imageColorGroup];
    duplicateImage[index] = event.target.files[0];
    setImageColorGroup(duplicateImage);
  };

  const addColorGroup = () => {
    const duplicateColoGroup: ProductImages[] = [
      ...colorGroup,
      {
        _id: Date.now().toString(),
        color: null,
        small: "",
        large: "",
        edit: false,
      },
    ];
    setColorGroup(duplicateColoGroup);
  };

  const onSubmit = async (data: Input) => {
    const formData = new FormData();
    formData.append("productId", query.toString());
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
        if (!color.edit) {
          formData.append("color", color.color);
        }
      }
    }

    if (imageColorGroup.length) {
      for (let image of imageColorGroup) {
        if (image) {
          formData.append("productImage", image);
        }
      }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/product`,
      {
        method: "PATCH",
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

  const handleDeleteGroup = async (
    edit: boolean,
    groupId: string,
    index: number
  ) => {
    if (window.confirm("Are you want to delete?")) {
      if (edit) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASEURL_API}/delete-product-images`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ productId: query, attributeId: groupId }),
          }
        );

        await response.json();
      }

      const duplicateGroup = [...colorGroup];
      duplicateGroup.splice(index, 1);
      setColorGroup(duplicateGroup);
    }
  };

  const reorder = (
    list: ProductImages[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      colorGroup,
      result.source.index,
      result.destination.index
    );

    setColorGroup(items as any[]);

    sortAttributes();
  };

  const sortAttributes = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/sort-attribute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: query.toString(),
          attributes: colorGroup,
        }),
      }
    );
    await response.json();
  };

  return (
    <Layout>
      <Badges isActive={error} type="danger">
        <span>{errorMessage}</span>
      </Badges>
      <div className="wrapper">
        <div className="form-manage__header">
          <h3>Edit Product</h3>
        </div>
        <div className="content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="productName">Product name</label>
              <input
                type="text"
                name="productName"
                id="productName"
                defaultValue={product && product.productName}
                ref={register({ required: true })}
              />
              {errors.productName && (
                <p className="error-text">productName is required</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select name="category" id="category" ref={register()}>
                {category &&
                  category.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      selected={
                        product && product.category === item._id ? true : false
                      }
                    >
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
                defaultValue={product && product.description}
                ref={register({ required: true })}
                rows={10}
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
                defaultValue={product && product.price}
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
                defaultValue={product && product.salePrice}
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
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, _snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ overflowX: "scroll" }}
                    >
                      {colorGroup &&
                        colorGroup.map((group, index) => {
                          return (
                            <Draggable
                              key={group._id}
                              draggableId={group._id}
                              index={index}
                            >
                              {(provided: DraggableProvided, _snapshot) => (
                                <div
                                  className={styles.colorGroup}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {group.small ? (
                                    <img
                                      src={`${process.env.NEXT_PUBLIC_BASEURL_API}/uploads/product/${group.small}`}
                                      width={50}
                                      height={50}
                                    />
                                  ) : (
                                    <>
                                      <input
                                        type="color"
                                        required
                                        value={`${group.color}`}
                                        onChange={(event) =>
                                          handleColor(event, index)
                                        }
                                      />
                                      <input
                                        type="file"
                                        required
                                        onChange={(event) =>
                                          handleImageColor(event, index)
                                        }
                                      />
                                    </>
                                  )}
                                  <span
                                    className={styles.deleteGroup}
                                    onClick={() =>
                                      handleDeleteGroup(
                                        group.edit,
                                        group._id,
                                        index
                                      )
                                    }
                                  >
                                    <TiDeleteOutline />
                                  </span>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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

export default EditProduct;
