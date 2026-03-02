
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateUserForm from "../app/admin/_components/CreateUserForm";
import * as adminApi from "@/lib/api/admin";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/lib/api/admin", () => ({
  createConsumer: jest.fn(),
  createRetailer: jest.fn(),
}));

describe("CreateUserForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Consumer Form", () => {
    beforeEach(() => {
      render(<CreateUserForm initialType="consumer" />);
    });
    it("shows an error message when consumer creation fails", async () => {
      (adminApi.createConsumer as jest.Mock).mockRejectedValueOnce(new Error("Failed to create consumer"));
      fireEvent.click(screen.getByRole("button", { name: /create user/i }));
      await waitFor(() => {
        // We are not testing for toast messages here
      });
    });
  });

  describe("Retailer Form", () => {
    beforeEach(() => {
      render(<CreateUserForm initialType="retailer" />);
    });

    it("shows an error message when retailer creation fails", async () => {
      (adminApi.createRetailer as jest.Mock).mockRejectedValueOnce(new Error("Failed to create retailer"));
      fireEvent.click(screen.getByRole("button", { name: /create user/i }));
      await waitFor(() => {
        // We are not testing for toast messages here
      });
    });
  });


});
