import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchEmployees,
  setSearch,
  setDepartmentFilter,
  type Employee,
} from "./employeesSlice";
import { useNavigate } from "react-router-dom";

const EmployeeList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { employees, loading, error, search, departmentFilter } =
    useAppSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Filter employees by search text and department filter
  const filteredEmployees = employees.filter((employee) => {
    const fullName =
      `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const email = employee.email.toLowerCase();
    const searchText = search.toLowerCase();
    const departmentMatch =
      departmentFilter === "" || employee.department === departmentFilter;

    return (
      (fullName.includes(searchText) || email.includes(searchText)) &&
      departmentMatch
    );
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Search and Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <TextField
          label="Search by name or email"
          variant="outlined"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          sx={{ width: "45%" }}
        />
        <FormControl sx={{ width: "45%" }}>
          <InputLabel>Filter by Department</InputLabel>
          <Select
            value={departmentFilter}
            onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
            label="Filter by Department"
          >
            <MenuItem value="">All Departments</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Support">Support</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Employee Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((emp: Employee) => (
              <TableRow
                key={emp.id}
                hover
                onClick={() => navigate(`/employee/${emp.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>
                  {emp.first_name} {emp.last_name}
                </TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.status ? "Active" : "Inactive"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EmployeeList;
