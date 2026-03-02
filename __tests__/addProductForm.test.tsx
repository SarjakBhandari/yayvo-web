import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddProductForm from "../app/retailer/_components/addProductForm";
import { useCreateProduct } from "../app/retailer/_hooks/useCreateProducts";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock the entire module containing the hook
jest.mock("../app/retailer/_hooks/useCreateProducts");

// Cast the imported hook to a Jest mock function for type-safety and auto-completion
const useCreateProductMock = useCreateProduct as jest.Mock;

// Mock the handler functions that the hook would return
const mockHandleSubmit = jest.fn();
const mockToggleSentiment = jest.fn();
const mockHandleTitle = jest.fn();
const mockHandleDescription = jest.fn();
const mockHandleFile = jest.fn();
const mockSetRetailerAuthId = jest.fn();
const mockSetRetailerName = jest.fn();
const mockSetRetailerIcon = jest.fn();

const defaultMockValues = {
    title: "",
    description: "",
    targetSentiment: [],
    file: null,
    errors: {},
    isSubmitting: false,
    handleTitle: mockHandleTitle,
    handleDescription: mockHandleDescription,
    handleFile: mockHandleFile,
    toggleSentiment: mockToggleSentiment,
    handleSubmit: mockHandleSubmit,
    setRetailerAuthId: mockSetRetailerAuthId,
    setRetailerName: mockSetRetailerName,
    setRetailerIcon: mockSetRetailerIcon,
    retailerIcon: null,
};

describe("AddProductForm: Comprehensive Tests", () => {
  beforeEach(() => {
    // Reset all mocks before each test to ensure isolation
    jest.clearAllMocks();

    // Provide a default implementation for the mock for each test
    useCreateProductMock.mockImplementation(() => defaultMockValues);

    mockHandleSubmit.mockImplementation(async () => Promise.resolve());
  });

 
    it("should display the file dropzone when no file is selected", () => {
      render(<AddProductForm />);
      expect(screen.getByText(/drop an image or click to browse/i)).toBeInTheDocument();
    });
  });

  // Test Suite: Form Submission
  describe("Form Submission", () => {
    it("should call handleSubmit when the form is submitted", async () => {
      render(<AddProductForm />);
      fireEvent.click(screen.getByRole("button", { name: /create product/i }));
      await waitFor(() => {
        expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it("should disable the submit button when isSubmitting is true", () => {
      useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, isSubmitting: true }));
      render(<AddProductForm />);
      const submitButton = screen.getByRole("button", { name: /creating…/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show "Creating…" text on the submit button when isSubmitting is true', () => {
      useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, isSubmitting: true }));
      render(<AddProductForm />);
      expect(screen.getByRole("button", { name: /creating…/i })).toBeInTheDocument();
    });

    it("should call onCreated callback after successful submission", async () => {
        const onCreatedMock = jest.fn();
        useCreateProductMock.mockImplementation((cb) => ({
            ...defaultMockValues,
            handleSubmit: jest.fn().mockImplementation(async () => {
                if (cb) cb();
            }),
        }));

        render(<AddProductForm onCreated={onCreatedMock} />);
        fireEvent.click(screen.getByRole("button", { name: /create product/i }));
        await waitFor(() => {
            expect(onCreatedMock).toHaveBeenCalledTimes(1);
        });
    });
  });

  // Test Suite: Input Fields
  describe("Input Field Handling", () => {
    it("should call handleTitle on title input change", () => {
      render(<AddProductForm />);
      const titleInput = screen.getByPlaceholderText("Give your product a title…");
      fireEvent.change(titleInput, { target: { value: "A new title" } });
      expect(mockHandleTitle).toHaveBeenCalled();
    });

    it("should call handleDescription on description input change", () => {
      render(<AddProductForm />);
      const descInput = screen.getByPlaceholderText("Describe what makes this product special…");
      fireEvent.change(descInput, { target: { value: "A new description" } });
      expect(mockHandleDescription).toHaveBeenCalled();
    });

  });

  // Test Suite: Error Handling
  describe("Error Display", () => {
    it("should display a title error when present", () => {
      useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, errors: { title: "Title cannot be empty." } }));
      render(<AddProductForm />);
      expect(screen.getByText("Title cannot be empty.")).toBeInTheDocument();
    });

    it("should display a general error when present", () => {
      useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, errors: { general: "An unknown error occurred." } }));
      render(<AddProductForm />);
      expect(screen.getByText("An unknown error occurred.")).toBeInTheDocument();
    });

    it("should not display error messages when there are no errors", () => {
        useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, errors: {} }));
        render(<AddProductForm />);
        expect(screen.queryByText("Title cannot be empty.")).not.toBeInTheDocument();
        expect(screen.queryByText("An unknown error occurred.")).not.toBeInTheDocument();
    });
  });

  // Test Suite: Sentiments
  const sentiments = ["calm", "cozy", "joy", "minimalist", "nostalgic", "excited"];
  describe("Sentiment Selection", () => {
    sentiments.forEach((sentiment) => {
      it(`should render the "${sentiment}" sentiment button`, () => {
        render(<AddProductForm />);
        expect(screen.getByRole("button", { name: new RegExp(sentiment, 'i') })).toBeInTheDocument();
      });
    });

    sentiments.forEach((sentiment) => {
      it(`should call toggleSentiment with "${sentiment}" when the button is clicked`, () => {
        render(<AddProductForm />);
        const sentimentButton = screen.getByRole("button", { name: new RegExp(sentiment, 'i') });
        fireEvent.click(sentimentButton);
        expect(mockToggleSentiment).toHaveBeenCalledWith(sentiment);
      });
    });

    it("should apply the 'selected' class to a selected sentiment", () => {
      useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, targetSentiment: ["joy"] }));
      render(<AddProductForm />);
      const joyButton = screen.getByRole("button", { name: /joy/i });
      expect(joyButton).toHaveClass("selected");
    });

    it("should apply the 'selected' class to multiple selected sentiments", () => {
      useCreateProductMock.mockImplementation(() => ({ ...defaultMockValues, targetSentiment: ["calm", "nostalgic"] }));
      render(<AddProductForm />);
      expect(screen.getByRole("button", { name: /calm/i })).toHaveClass("selected");
      expect(screen.getByRole("button", { name: /nostalgic/i })).toHaveClass("selected");
      expect(screen.getByRole("button", { name: /joy/i })).not.toHaveClass("selected");
    });
  });




;
