import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import functions
import { login } from "../services/authService";

// import UI components
import EyeIcon from "../components/icons/EyeIcon";
import EyeOffIcon from "../components/icons/EyeOffIcon";
import Spinner from "../components/icons/Spinner";

const LoginPage = () => {
  const navigate = useNavigate();

  // input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // loading and error states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("demopassword");
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="w-80 p-6 bg-white rounded-2xl shadow-lg">
        {/* Title & Error */}
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h1>

        <div className="h-5 mt-2 mb-4 text-sm text-red-600 text-center">
          {error || "\u00A0"}
        </div>

        <form className="space-y-4 text-gray-900" onSubmit={handleLogin}>
          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm shadow-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium mt-3 hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner className="h-5 w-5" />
                Processing...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Demo login button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 font-medium mt-3 hover:bg-gray-100 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Use Demo Account
        </button>

        {/* Register link */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <button
            onClick={handleGoToRegister}
            className="text-indigo-600 hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
