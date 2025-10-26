
// jest.setup.ts:
import "@testing-library/jest-dom";

// Example test file: __tests__/ProductHeader.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { ProductHeader, getProduct, ImageGallery } from "@/app/product/[id]/page"; // Adjust path, but since it's in page, export the component

// To test, export ProductHeader
// Mock getProduct
jest.mock("@/app/pd/page", () => ({
  getProduct: jest.fn(),
}));

test("renders product header", async () => {
  (getProduct as jest.Mock).mockResolvedValue({
    name: "Nike Air Max 97 SE",
    price: "170",
  });

  render(<ProductHeader productId="123" />);

  await waitFor(() => {
    expect(screen.getByText("Nike Air Max 97 SE")).toBeInTheDocument();
    expect(screen.getByText("$170")).toBeInTheDocument();
  });
});

// Similar tests for other components, e.g., check alt tags, skeletons render divs, etc.
test("renders image with alt tag", async () => {
  (getProduct as jest.Mock).mockResolvedValue({
    name: "Nike Air Max 97 SE",
    images: [{ src: "/img1.jpg" }],
  });

  render(<ImageGallery productId="123" />);

  await waitFor(() => {
    expect(
      screen.getByAltText("Nike Air Max 97 SE front view")
    ).toBeInTheDocument();
  });
});

// Add more tests for skeletons, description, etc.
// For full page, use render(<ProductPage params={{id: '123'}} />) and waitFor elements.
