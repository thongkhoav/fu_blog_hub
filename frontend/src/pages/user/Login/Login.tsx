import React, { useState } from "react";
import "./login.scss";
import { PATH } from "src/utils/constants/paths";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const history = useHistory();
  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (!loading) {
    //   const payload = { username, password };
    //   login(payload)
    //     .then(res => {
    //       history.push(PATH.HOME);
    //     })
    //     .catch(err => {
    //       setError(err.payload.message);
    //     });
    // }
  };

  return (
    <div className="container">
      <div className="min-vh-100 row">
        <div className="col-md-6 m-auto">
          <form className="p-5 rounded-sm shadow text-center" onSubmit={submit}>
            <h1 className="mb-4">Login</h1>
            <p className="text-muted">Please enter your login and password!</p>
            <input
              type="text"
              placeholder="Username"
              onChange={handleUsername}
              className="form-control form-control-lg mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={handlePassword}
              className="form-control form-control-lg mb-4"
            />
            {error && <div className="mb-3 text-danger text-xl-center">{error}</div>}
            <button type="submit" className="btn btn-block btn-info btn-lg">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
