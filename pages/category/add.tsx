import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { ResponseServer } from "../../lib/types";
import Layout from "../../components/Layout";
import Badges from "../../components/Badges";
import { GetServerSideProps } from "next";

interface Input {
  categoryName: string;
  image: any[];
}

const AddCategory = () => {
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(null);
  const { register, errors, handleSubmit, reset } = useForm<Input>();

  const onSubmit = async (data: Input) => {
    const formData = new FormData();

    formData.append("categoryName", data.categoryName);
    formData.append("categoryImage", data.image[0]);

    const response = await fetch("https://jjams.co/api/wallstore/category", {
      method: "POST",
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
          <h3>Add Category</h3>
        </div>
        <div className="content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                type="text"
                name="categoryName"
                ref={register({ required: true })}
              />
              {errors.categoryName && (
                <p className="error-text">Category is required</p>
              )}
            </div>
            <div className="form-group">
              <input
                type="file"
                name="image"
                ref={register({ required: true })}
              />
              {errors.image && (
                <p className="error-text">Category image is required</p>
              )}
            </div>
            <button type="submit">Add</button>
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

export default AddCategory;
