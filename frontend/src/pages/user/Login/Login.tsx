import React, { useState } from "react";
import styles from "./login.module.scss";
import { PATH } from "src/utils/constants/paths";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "~/utils/helpers";
import { FcGoogle } from "react-icons/fc";
import { HOST } from "~/utils/constants";
import { toast } from "react-toastify";
import toastOption from "~/utils/constants/toastOption";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname;
  const { onLogin } = useAuth();

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await onLogin(email, password);
    } catch (error: any) {
      toast.error(error.message, toastOption);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className={`${styles.loginBlock} max-w-md w-full bg-white p-6 rounded-lg flex flex-col items-center`}
      >
        <h1 className="text-2xl font-bold mb-8">Login</h1>
        <form onSubmit={submit} className="w-60">
          <div className="mb-4">
            <label className="block mb-2 font-semibold shad">Email</label>
            <input
              type="email"
              onChange={handleEmail}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Password</label>
            <input
              type="password"
              onChange={handlePassword}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-600 mb-4 "
          >
            Login
          </button>
        </form>
        <p className="text-gray-500 text-center text-sm">Or login with</p>
        <a
          href={`${HOST}/api/auth/google`}
          className="p-2 inline-block rounded-full cursor-pointer border border-slate-700"
        >
          <FcGoogle className="text-lg" />
        </a>
      </div>
    </div>
  );
};

export default Login;
