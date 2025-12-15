import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { loginApi, saveToken } from "../services/auth";
import "../styles/loginPage.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwVisible, setPwVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email) return setError("Enter email/login id");
    if (!password) return setError("Enter password");

    setLoading(true);
    const res = await loginApi(email, password);
    setLoading(false);

    if (res.error) return setError(res.error);

    const token = res.data?.token || res.data?.access_token;
    if (!token) return setError("Token missing");

    saveToken(token);
    navigate("/dashboard");
  }

  return (
    <div className="login-page">

      {/* BACKGROUND + OVERLAY */}
      <div className="hero-bg">
        <div className="overlay"></div>

        {/* LEFT HERO TEXT */}
        <div className="hero-text">
          <h1>
            Welcome to the <br /> Crowd Management System
          </h1>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="login-card-wrapper">
          <Card className="login-card">

            {/* FIGMA TOP GRADIENT BAR */}
            <div className="card-header">
              <img src="/logo192.png" alt="logo" className="brand-logo" />
              <h3 className="brand-text">kloudspot</h3>
            </div>

            {/* FORM */}
            <form onSubmit={submit} className="login-form">

              <Input
                label="Log In *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@test.com"
              />

              {/* PASSWORD SECTION */}
              <div className="form-item">
                <label className="form-label">Password *</label>
                <div className="password-row">
                  <input
                    className="input"
                    type={pwVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setPwVisible((s) => !s)}
                  >
                    {pwVisible ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}

              <Button type="submit" loading={loading}>
                Login
              </Button>

              

            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
