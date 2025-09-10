// jest.setup.js
import "@testing-library/jest-dom";

// Mock for CSS modules
jest.mock("*.css", () => ({}));
jest.mock("*.scss", () => ({}));

// Mock for Lucide React
jest.mock("lucide-react", () => ({
  AlertTriangle: () => "svg",
  Filter: () => "svg",
  RefreshCw: () => "svg",
}));
