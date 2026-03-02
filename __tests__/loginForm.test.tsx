
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth)/_components/loginForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockHandleSubmit = jest.fn((callback) => (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  callback();
});
const mockHandleEmail = jest.fn();
const mockHandlePassword = jest.fn();
const mockErrors = {
  email: "Enter a valid email",
  password: "Password must be at least 8 characters",
};

jest.mock("@/app/(auth)/_hooks/use-login", () => ({
  useLoginForm: () => ({
    email: "",
    password: "",
    errors: mockErrors,
    handleEmail: mockHandleEmail,
    handlePassword: mockHandlePassword,
    handleSubmit: mockHandleSubmit,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    render(<LoginForm />);
  });


  it("shows validation errors for empty fields", async () => {
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
  });

  it("submits the form", async () => {
    const button = screen.getByRole("button", { name: /sign in/i });
    fireEvent.submit(button);

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});
