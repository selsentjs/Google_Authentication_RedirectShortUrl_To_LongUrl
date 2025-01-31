import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const url = "http://localhost:3000/api/auth/register";

const Register = () => {
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // error
  const [error, setError] = useState("");

  // form
  const submitForm = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Enter all the fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("password and confirm password must be equal");
      return;
    }

    if (password.length < 6) {
      setError("password should be maximum 6 characters");
      return;
    }

    const response = await axios.post(url);
    console.log("res:", response.data);
    setUser(response.data);
  };

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>

                      <form className="mx-1 mx-md-4" onSubmit={submitForm}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw"></i>

                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <label
                              htmlFor="name"
                              className="form-label"
                              for="form3Example1c"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="form3Example1c"
                              className="form-control"
                              value={name}
                              onChange={(e) => setName(e.preventDefault())}
                            />
                            {error && <p>{error}</p>}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <label
                              htmlFor="email"
                              className="form-label"
                              for="form3Example3c"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="form3Example3c"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.preventDefault())}
                            />
                            {error && <p>{error}</p>}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <label
                              htmlFor="password"
                              className="form-label"
                              for="form3Example4c"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.preventDefault())}
                            />
                            {error && <p>{error}</p>}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <label
                              htmlFor="confirmPassword"
                              className="form-label"
                              for="form3Example4cd"
                            >
                              Confirm password
                            </label>
                            <input
                              type="password"
                              id="form3Example4cd"
                              className="form-control"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.preventDefault())
                              }
                            />
                            {error && <p>{error}</p>}
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="button"
                            data-mdb-button-init
                            data-mdb-ripple-init
                            className="btn btn-primary btn-lg"
                          >
                            Register
                          </button>
                        </div>
                        <div className="text-center mt-4">
                          <p>
                            Already registered?
                            <NavLink
                              to="/"
                              className="text-decoration-none ms-2"
                            >
                              Login here
                            </NavLink>
                          </p>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://img.freepik.com/free-vector/posts-concept-illustration_114360-194.jpg?t=st=1738315580~exp=1738319180~hmac=2c8b0d61faff97de3959a767dd72006184a2fd9015cd5c4ae375c0d73c772727&w=740"
                        className="img-fluid"
                        alt="register"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
