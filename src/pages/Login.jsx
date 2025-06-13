import React, { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import { VscEyeClosed } from "react-icons/vsc";
import { RxEyeOpen } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import Loader from "../utilities/Loader";
import { useApi } from "../APIConfig/APIContext";
import axios from "axios";
import { setEmailId, setFirstName, setId, setLogin, setRoleId, setRoleName } from "../utilities/sessionUtils";
import { roleIds } from "../utilities/constants";

const Login = () => {
  const baseUrl = useApi()
  const navigate = useNavigate()
  const [isPsdShown, setIsPsdShown] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showApiError, setShowApiError] = useState(false);
  const [apiError, setApiError] = useState("")
  const [loading, setLoading] = useState(false)

  // console.log("baseurl:", baseUrl)

  // toggle function to show/hide password
  const togglePsdShown = () => setIsPsdShown((prev) => !prev);

  // function to submit form
  const handleFormSubmit = async () => {
    let isValid = true;

    if (username === "") {
      setUsernameError(true);
      isValid(false);
    } else {
      setUsernameError(false);
    }

    if (password === "") {
      setPasswordError(true);
      isValid(false);
    } else {
      setPasswordError(false);
    }

    const requestBody = {
      username: username,
      password: password
    }

    if (isValid) {
      setLoading(true)
      await axios.post(`${baseUrl}/api/Login`, requestBody)
        .then(response => {
          // console.log("login response:", response)

          // store im session storage - id, roleid, rolename, firstname
          if (response.status === 200) {
            setLoading(false)
            const data = response?.data?.data
            // console.log("loginres", response)

            setLogin(1)
            setId(data?.id)
            setRoleId(data?.role_ID)
            setRoleName(data?.role_Name)
            setFirstName(data?.firstname)
            setEmailId(data?.emailid);

            if (data?.role_ID == 6 || true) {
              navigate("/approve")
            }

            if ([roleIds.BROKER, roleIds.LANDLORD].includes(String(data?.role_ID))) {
              navigate("/all")
            }

            else {
              navigate("/pending")
            }
          }
        })
        .catch(err => {
          // console.log("login err:", err)
          setLoading(false)
          // setShowApiError(true)
          alert(err?.response?.data?.message || "Login failed")
          // setApiError(err?.response?.data?.message || "Login Failed")
        })
    }
  };

  // function to submit form on pressing enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (username !== "" || password !== "")) {
      handleFormSubmit();
    }
  };

  // automatically hide api error after 2 seconds
  useEffect(() => {
    if (showApiError) {
      const timer = setTimeout(() => setShowApiError(false), 2000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className={styles.container}>
      {/* show loader */}
      {loading && <Loader />}

      {/* show error */}
      {showApiError && (
        <div className="api_error">{apiError}</div>
      )}

      {/* image div */}
      <div className={styles.left_div}>
        <div className={styles.image_div}>{/* image comes here */}</div>
      </div>

      {/* login form div */}
      <div className={styles.right_div}>
        <div className={styles.form_div}>
          <h1>Login</h1>
          <form className={styles.form}>
            <div className={styles.form_group}>
              <label htmlFor="username">
                Username
                <span style={{ color: "red" }}>*</span>
              </label>

              <div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
                {usernameError && (
                  <small className={styles.warning_text}>
                    username is required
                  </small>
                )}
              </div>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="password">
                Password
                <span style={{ color: "red" }}>*</span>
              </label>

              <div style={{ position: "relative" }}>
                <input
                  type={isPsdShown ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
                {password && (
                  <span className={styles.toggle_psd} onClick={togglePsdShown}>
                    {isPsdShown ? <RxEyeOpen /> : <VscEyeClosed />}
                  </span>
                )}
                {passwordError && (
                  <small className={styles.warning_text}>
                    password is required
                  </small>
                )}
              </div>
            </div>

            <button
              type="button"
              className={styles.form_submit}
              onClick={handleFormSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
