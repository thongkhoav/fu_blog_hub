import React, { useEffect, useState } from "react";
import "./create-tag.scss";

interface Props {
  mode?: "create" | "edit";
}

const CreateTag = ({ mode = "create" }: Props) => {
  const [tag, setTag] = useState("");

  useEffect(() => {}, []);

  const handleTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
              onChange={handleTag}
              className="form-control form-control-lg mb-4"
            />
            <button type="submit" className="btn btn-block btn-info btn-lg">
              {mode === "create" ? "Create" : "Edit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTag;
