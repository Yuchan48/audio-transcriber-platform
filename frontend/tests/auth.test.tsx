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

afterEach(() => {
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  it("submits credentials, stores the user, and navigates on success", async () => {
    const user = { id: 1, email: "demo@example.com", role: "user" };
    mocks.login.mockResolvedValueOnce(user);

    const { container } = render(<LoginPage />);
    const emailInput = container.querySelector('input[type="text"]');
    const passwordInput = container.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) {
      throw new Error("Login inputs were not rendered");
    }

    fireEvent.change(emailInput, {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(mocks.setUser).toHaveBeenCalledWith(user));
    expect(mocks.navigate).toHaveBeenCalledWith("/dashboard");
    expect(screen.queryByText(/login failed/i)).toBeNull();
  });

  it("shows a login error when the API rejects", async () => {
    mocks.login.mockRejectedValueOnce(new Error("Invalid credentials"));
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { container } = render(<LoginPage />);
    const emailInput = container.querySelector('input[type="text"]');
    const passwordInput = container.querySelector('input[type="password"]');

    if (!emailInput || !passwordInput) {
      throw new Error("Login inputs were not rendered");
    }

    fireEvent.change(emailInput, {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/login failed/i)).toBeTruthy();
    expect(mocks.setUser).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
