import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const url = "http://localhost:3000/api/auth/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // error
  const [error, setError] = useState("");

  // navigate
  const navigate = useNavigate();

  // form
  const submitForm = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Enter all the fields");
      return;
    }
    try {
      // Send the data to the server
      const response = await axios.post(url, {
        email,
        password,
      });
      console.log("Response:", response.data);

      // Store JWT token in localStorage
      localStorage.setItem("authToken", response.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      console.error(err);
    }
  };

  // handle success login for google
  const handleLoginSuccess = async (response) => {
    const token = response.credential;

    try {
      // Send the Google token to your backend for verification and user authentication
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        token,
      });

      if (res.status === 200) {
        console.log("User authenticated:", res.data);
        // You can now store the JWT token received from your own backend in localStorage
        localStorage.setItem("authToken", res.data.token);
        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during authentication.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Login
                      </p>
                      {error && <p className="text-danger">{error}</p>}
                      <form className="mx-1 mx-md-4" onSubmit={submitForm}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <label
                              className="form-label"
                              htmlFor="form3Example3c"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="form3Example3c"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                          <div
                            data-mdb-input-init
                            className="form-outline flex-fill mb-0"
                          >
                            <label
                              className="form-label"
                              htmlFor="form3Example4c"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                          >
                            Login
                          </button>
                        </div>

                        {/* Google Sign-In Button */}
                        <div className="d-flex flex-column justify-content-center align-items-center mt-4">
                          <p>Or Sign in With</p>
                          <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={(error) =>
                              console.log("Google login error: ", error)
                            }
                            useOneTap
                          >
                            <button className="google-login-btn">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="bi bi-google"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                              </svg>
                              <span className="ms-2 fs-6">Google</span>
                            </button>
                          </GoogleLogin>
                        </div>

                        <div className="text-center mt-4">
                          <p>
                            Not a Member?
                            <NavLink
                              to="/register"
                              className="text-decoration-none ms-2"
                            >
                              Register
                            </NavLink>
                          </p>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg?t=st=1738315486~exp=1738319086~hmac=da228862e77d8e1a8d97883073088caf7fe641c71e561ab2780e4fdcaf187d23&w=740"
                        className="img-fluid"
                        alt="login"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </GoogleOAuthProvider>
  );
};
export default Login;
