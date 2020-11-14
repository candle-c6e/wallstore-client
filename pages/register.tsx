import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { UserContext } from "../context/userContext";
import { TUserContext, ResponseServer } from "../lib/types";
import styles from "../styles/Register.module.css";

interface Input {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext) as TUserContext;
  const { register, errors, handleSubmit, watch } = useForm<Input>();

  useEffect(() => {
    if (user) {
      router.push(process.env.NEXT_PUBLIC_BASEURL);
    }
  }, []);

  const onSubmit = async (data: Input) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL_API}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      }
    );

    const result: ResponseServer = await response.json();

    if (!result.error) {
      setUser(result.result);
      router.push(process.env.NEXT_PUBLIC_BASEURL);
    }
  };

  return (
    <Layout>
      <div className={styles.formLogin}>
        <h2>Register your account</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                className={errors.name ? "error" : ""}
                type="text"
                ref={register({
                  required: true,
                })}
                name="name"
                placeholder="name"
              />
              {errors.name && (
                <span className="error-text">Name is required</span>
              )}
            </div>
            <div className="form-group">
              <input
                className={errors.email ? "error" : ""}
                type="text"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "invalid email address",
                  },
                })}
                name="email"
                placeholder="email"
              />
              {errors.email && errors.email.type === "required" && (
                <span className="error-text">Email is required</span>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <span className="error-text">Email is not valid</span>
              )}
            </div>
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
              {errors.username && (
                <span className="error-text">Username is required</span>
              )}
            </div>
            <div className="form-group">
              <input
                className={errors.password ? "error" : ""}
                type="password"
                ref={register({ required: true })}
                name="password"
                placeholder="Password"
              />
              {errors.password && (
                <span className="error-text">Password is required</span>
              )}
            </div>
            <div className="form-group">
              <input
                className={errors.confirmPassword ? "error" : ""}
                type="password"
                ref={register({
                  required: true,
                  validate: (value: any) => value === watch("password"),
                })}
                name="confirmPassword"
                placeholder="Confirm password"
              />
              {errors.confirmPassword &&
                errors.confirmPassword.type === "required" && (
                  <span className="error-text">
                    Confirm password is required
                  </span>
                )}
              {errors.confirmPassword &&
                errors.confirmPassword.type === "validate" && (
                  <span className="error-text">
                    Confirm password is not match
                  </span>
                )}
            </div>
            <div className="form-group">
              <p className={styles.register}>
                already have account?{" "}
                <Link href={`${process.env.NEXT_PUBLIC_BASEURL}/login`}>
                  <a>
                    <span>login</span>
                  </a>
                </Link>
              </p>
            </div>
            <button type="submit" style={{ width: "100%" }}>
              Register
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
