import React, { useState } from "react";
import "./create-category.scss";

interface Props {
  mode?: "create" | "edit";
}

const CreateCategory = ({ mode = "create" }: Props) => {
  const [category, setCategory] = useState("");
  const handleCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    // depend on mode to call api
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
              placeholder="category"
              onChange={handleCategory}
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

export default CreateCategory;
