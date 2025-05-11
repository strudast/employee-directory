import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import EmployeeList from "./EmployeeList";
import { useNavigate } from "react-router-dom";

// Mock navigate from react-router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Define types for the state
interface EmployeeState {
  loading: boolean;
  error: string | null;
  employees: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  search: string;
  departmentFilter: string;
}

interface RootState {
  employees: EmployeeState;
}

// Create a test store with the RootState type
const createTestStore = (initialState: RootState) => {
  return configureStore({
    reducer: {
      employees: (state = initialState.employees) => state, // Dummy reducer for testing
    },
  });
};

// Render function with store
const renderWithStore = (storeState: RootState) => {
  const store = createTestStore(storeState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <EmployeeList />
      </BrowserRouter>
    </Provider>
  );
};

describe("EmployeeList component", () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("renders loading spinner", () => {
    renderWithStore({
      employees: {
        loading: true,
        error: null,
        employees: [],
        search: "",
        departmentFilter: "",
      },
    });

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders error message", () => {
    renderWithStore({
      employees: {
        loading: false,
        error: "Failed to fetch",
        employees: [],
        search: "",
        departmentFilter: "",
      },
    });

    expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
  });

  it("renders filtered employees", () => {
    const employeeData = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        department: "Engineering",
        email: "john@example.com",
        status: true,
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        department: "Marketing",
        email: "jane@example.com",
        status: false,
      },
    ];

    renderWithStore({
      employees: {
        loading: false,
        error: null,
        employees: employeeData,
        search: "Jane",
        departmentFilter: "Marketing",
      },
    });

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("navigates to employee detail on row click", () => {
    const employeeData = [
      {
        id: 3,
        first_name: "Alice",
        last_name: "Johnson",
        department: "Sales",
        email: "alice@example.com",
        status: true,
      },
    ];

    renderWithStore({
      employees: {
        loading: false,
        error: null,
        employees: employeeData,
        search: "",
        departmentFilter: "",
      },
    });

    const row = screen.getByText("Alice Johnson").closest("tr");
    fireEvent.click(row!);

    expect(mockNavigate).toHaveBeenCalledWith("/employee/3");
  });
});
