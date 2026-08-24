import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// import functions
import { register, loginWithGoogle } from "../services/authService";
import { validateEmail, validatePassword } from "../utils/inputValidators";

// import UI components
import EyeIcon from "../components/icons/EyeIcon";
import EyeOffIcon from "../components/icons/EyeOffIcon";
import Spinner from "../components/icons/Spinner";
import GitHubIcon from "../components/icons/GitHubIcon";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import loginBg from "../assets/login_bg.webp";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useAuth();

  // input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // loading and error states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    /* input validation */
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setIsLoading(true);
      // Attempt to register the user
      const registeredUser = await register(email, password);

      setUser(registeredUser);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setError("");
    try {
      setIsLoading(true);

      // Send the Google credential to the backend for verification and login
      const user = await loginWithGoogle(credentialResponse);

      // If successful, set the user in context and navigate to dashboard
      setUser(user);
      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Hero Section */}
        <div className="relative lg:w-1/2 h-104 lg:h-screen lg:flex-row">
          <img
            src={loginBg}
            alt="Audio Transcriber"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex h-full flex-col justify-center px-8 lg:px-16 text-white">
            <h1 className="text-3xl lg:text-5xl font-bold">
              AI Audio
              <br />
              Transcriber
            </h1>

            <p className="mt-4 text-base lg:text-lg text-gray-200">
              Transform speech into text with AI-powered transcription.
              <br />
              Try the live demo with the Demo Account.
            </p>

            <a
              href="https://github.com/Yuchan48/audio-transcriber-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200"
            >
              <GitHubIcon className="h-5 w-5" />
              View Source on GitHub
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 flex-col">
          {/* Register Container */}
          <div className="flex flex-1 items-center justify-center p-6 flex-col">
            <div className="w-[340px] rounded-xl bg-white border border-gray-200 shadow-xl p-6">
              {/* Title & Error */}
              <h1 className="text-2xl font-semibold text-center text-gray-800">
                Register
              </h1>

              <div className="h-5 mt-2 mb-4 text-sm text-red-600 text-center">
                {error || "\u00A0"}
              </div>

              <form
                className="space-y-2 text-gray-900"
                onSubmit={handleRegister}
              >
                {/* Email input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Password input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 transition"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password input */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="new-password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 transition"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Register button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 mt-4 px-4 py-2 text-white font-medium hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Register"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="h-5 w-5" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              {/* Google login */}
              <div className="mt-4 flex items-center justify-center">
                <GoogleLogin
                  width="292"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google login failed")}
                />
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleGoToLogin}
                className="text-indigo-600 hover:underline"
                aria-label="Go to Login Page"
              >
                Login
              </button>
            </div>
          </div>

          {/* Impressum */}
          <div className="pb-6 text-center">
            <Link
              to="/impressum"
              state={{ from: location.pathname }}
              className="w-full text-center text-sm pb-4 text-gray-600 hover:underline"
            >
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
