import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { NextSeo } from "next-seo";
import Layout from "../components/Layout";
import { UserContext } from "../context/userContext";
import { TUserContext, ResponseServer } from "../lib/types";
import styles from "../styles/Login.module.css";

interface Input {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext) as TUserContext;
  const { register, errors, handleSubmit } = useForm<Input>();

  useEffect(() => {
    if (user) {
      router.push(process.env.NEXT_PUBLIC_BASEURL);
    }
  }, []);

  const onSubmit = async (data: Input) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      }
    );

    const result: ResponseServer = await response.json();

    if (!result.error) {
      setUser(result.result);
      router.push("/");
    }
  };

  return (
    <Layout>
      <NextSeo
        title="login | wallstore"
        description="wallstore ecommerce this site power by nextjs"
      />
      <div className={styles.formLogin}>
        <h2>Sign in your account</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                className={errors.username ? "error" : ""}
                type="text"
                ref={register({
                  required: true,
                })}
                name="username"
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <input
                className={errors.password ? "error" : ""}
                type="password"
                ref={register({ required: true })}
                name="password"
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <p className={styles.register}>
                dot't have account?{" "}
                <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/register`}>
                  <a>
                    <span>register</span>
                  </a>
                </Link>
              </p>
            </div>
            <button type="submit" style={{ width: "100%" }}>
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
