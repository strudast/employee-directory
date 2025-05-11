import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeList from "./features/employees/EmployeeList";
import EmployeeDetails from "./features/employees/EmployeeDetails";
const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <h1 style={{ textAlign: "center" }}>Employee Directory</h1>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />{" "}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
