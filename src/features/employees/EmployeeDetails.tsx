import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { useAppSelector } from "../../hooks";

const EmployeeDetails: React.FC = () => {
  const { id } = useParams(); // Get the employee ID from the URL params
  const navigate = useNavigate();
  const employee = useAppSelector((state) =>
    state.employees.employees.find((emp) => emp.id === Number(id))
  );

  useEffect(() => {
    if (!employee) {
      // If no employee found, navigate back to list
      navigate("/");
    }
  }, [employee, id, navigate]);

  if (!employee) return <p>Employee not found</p>;

  return (
    <Box sx={{ padding: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ marginBottom: 2 }}
      >
        Back to Employee List
      </Button>
      <Typography variant="h5">
        {employee.first_name} {employee.last_name}
      </Typography>
      <Typography variant="h6">Email: {employee.email}</Typography>
      <Typography variant="h6">
        Status: {employee.status ? "Active" : "Inactive"}
      </Typography>
      <Typography variant="h6">Hire Date: {employee.hireDate}</Typography>
      <Typography variant="h6">Notes: {employee.notes}</Typography>
      <Typography variant="h6">Department: {employee.department}</Typography>
    </Box>
  );
};

export default EmployeeDetails;
