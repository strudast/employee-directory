import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Employee model
export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  department: string;
  status: boolean;
  hireDate: string;
  notes: string;
}

// LocalStorage helper
const getFromLocalStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

// State type
interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  search: string;
  departmentFilter: string;
  selectedEmployee: Employee | null;
}

// Departments
export const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Support",
];

// Initial state (uses localStorage where available)
const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
  search: getFromLocalStorage("search", ""),
  departmentFilter: getFromLocalStorage("departmentFilter", ""),
  selectedEmployee: getFromLocalStorage("selectedEmployee", null),
};

// Async thunk to fetch employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    const response = await fetch("https://reqres.in/api/users?page=1", {
      method: "GET",
      headers: {
        "x-api-key": "reqres-free-v1",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const loremIpsum = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Praesent tincidunt nulla vitae est fermentum, a varius erat interdum.",
      "Fusce et ligula ut libero scelerisque feugiat.",
      "Curabitur euismod, mauris nec pulvinar iaculis, tellus velit commodo justo.",
      "Phasellus euismod erat in tellus blandit, at ultrices nisi tempor.",
    ];

    const getRandomDate = () => {
      const start = new Date(2018, 0, 1);
      const end = new Date();
      const date = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
      return date.toISOString().split("T")[0];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrichedEmployees = data.data.map((user: any) => {
      const status = Math.random() < 0.5;
      const notes = loremIpsum[Math.floor(Math.random() * loremIpsum.length)];

      return {
        ...user,
        department: departments[Math.floor(Math.random() * departments.length)],
        status,
        notes,
        hireDate: getRandomDate(),
      };
    });

    return enrichedEmployees;
  }
);

// Slice
const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      localStorage.setItem("search", JSON.stringify(action.payload));
    },
    setDepartmentFilter(state, action: PayloadAction<string>) {
      state.departmentFilter = action.payload;
      localStorage.setItem("departmentFilter", JSON.stringify(action.payload));
    },
    setSelectedEmployee(state, action: PayloadAction<Employee | null>) {
      state.selectedEmployee = action.payload;
      localStorage.setItem("selectedEmployee", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      });
  },
});

// Actions
export const { setSearch, setDepartmentFilter, setSelectedEmployee } =
  employeesSlice.actions;

// Reducer
export default employeesSlice.reducer;

// Selector
export const selectFilteredEmployees = (state: {
  employees: EmployeesState;
}) => {
  const { employees, search, departmentFilter } = state.employees;

  return employees.filter((emp) => {
    const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "" || emp.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });
};
