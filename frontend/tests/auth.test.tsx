// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  navigate: vi.fn(),
  setUser: vi.fn(),
  setSkipAuthCheck: vi.fn(),
}));

vi.mock("../src/services/authService", () => ({
  login: mocks.login,
}));

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => ({
    setUser: mocks.setUser,
    setSkipAuthCheck: mocks.setSkipAuthCheck,
  }),
}));

// Mock the react-router-dom library to control navigation behavior during tests
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => ({ state: undefined }),
  };
});

import LoginPage from "../src/pages/LoginPage";

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  // test successful login flow
  it("submits credentials, stores the user, and navigates on success", async () => {
    const user = { id: 1, email: "demo@example.com", role: "user" };
    // Mock the login function to resolve with a user object when called with valid credentials
    mocks.login.mockResolvedValueOnce(user);

    const { container } = render(<LoginPage />);
    // get the email and password input fields from the rendered component
    const emailInput = container.querySelector('input[type="text"]');
    const passwordInput = container.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) {
      throw new Error("Login inputs were not rendered");
    }

    // Simulate user input for email and password fields and submit the form
    fireEvent.change(emailInput, {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert that the login function was called with the correct credentials
    await waitFor(() => expect(mocks.setUser).toHaveBeenCalledWith(user));

    // Assert that the navigate function was called to redirect the user to the dashboard after successful login
    expect(mocks.navigate).toHaveBeenCalledWith("/dashboard");

    // Assert that no error message is shown on successful login
    expect(screen.queryByText(/login failed/i)).toBeNull();
  });

  // test failed login flow
  it("shows a login error when the API rejects", async () => {
    // Mock the login function to reject with an error when called with invalid credentials
    mocks.login.mockRejectedValueOnce(new Error("Invalid credentials"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Render the LoginPage component and simulate user input for email and password fields with invalid credentials, then submit the form
    const { container } = render(<LoginPage />);
    const emailInput = container.querySelector('input[type="text"]');
    const passwordInput = container.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) {
      throw new Error("Login inputs were not rendered");
    }

    // Simulate user input for email and password fields and submit the form with invalid credentials
    fireEvent.change(emailInput, {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Assert that an error message is displayed to the user indicating that the login failed
    expect(await screen.findByText(/login failed/i)).toBeTruthy();

    // Assert that the setUser and navigate functions were not called since the login attempt failed
    expect(mocks.setUser).not.toHaveBeenCalled();

    // Assert that the navigate function was not called to redirect the user since the login attempt failed
    expect(mocks.navigate).not.toHaveBeenCalled();

    // Restore the original console.error implementation after the test to avoid affecting other tests
    consoleErrorSpy.mockRestore();
  });
});
