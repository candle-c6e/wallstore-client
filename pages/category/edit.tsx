import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Category, ResponseServer } from "../../lib/types";
import Layout from "../../components/Layout";
import Badges from "../../components/Badges";
import { GetServerSideProps } from "next";

interface Input {
  categoryName: string;
  image: any[];
}

const EditCategory = () => {
  const router = useRouter();
  const [category, setCategory] = useState<Category>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const { register, errors, handleSubmit, reset } = useForm<Input>();

  const query = router.query.categoryId;

  useEffect(() => {
    fetchCategory();
  }, [query]);

  const fetchCategory = async () => {
    const response = await fetch(
      `https://jjams.co/api/wallstore/category?categoryId=${query}`,
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

  const onSubmit = async (data: Input) => {
    const formData = new FormData();

    formData.append("categoryId", query.toString());
    formData.append("categoryName", data.categoryName);

    if (data.image.length) {
      formData.append("categoryImage", data.image[0]);
    }

    const response = await fetch("https://jjams.co/api/wallstore/category", {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    const { error, msg }: ResponseServer = await response.json();

    if (error) {
      setError(error);
      setErrorMessage(msg);
      reset();
    } else {
      router.push("/category");
    }
  };

  return (
    <Layout>
      <Badges isActive={error} type="danger">
        <span>{errorMessage}</span>
      </Badges>
      <div className="wrapper">
        <div className="content-manage__header">
          <h3>Edit Category</h3>
        </div>
        <div className="content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                type="text"
                name="categoryName"
                defaultValue={category && category.categoryName}
                ref={register({ required: true })}
              />
              {errors.categoryName && (
                <p className="error-text">Category is required</p>
              )}
            </div>
            <div className="form-group">
              <input type="file" name="image" ref={register()} />
              {errors.image && (
                <p className="error-text">Category image is required</p>
              )}
            </div>
            <div>
              {category && (
                <img
                  width={200}
                  height={200}
                  src={`https://jjams.co/api/wallstore/uploads/category/${category.images[0].small}`}
                  alt={category.categoryName}
                />
              )}
            </div>
            <button type="submit">Edit</button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const responseMe = await fetch("https://jjams.co/api/wallstore/me", {
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
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
};

export default EditCategory;
