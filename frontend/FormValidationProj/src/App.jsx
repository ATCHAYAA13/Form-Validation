import React, { useState } from "react";
import axios from "axios";
import EmployeeList from "./EmployeeList";
//import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";


const departments = ["HR", "Engineering", "Marketing"];
const countryCodes = [
  { code: "+91", country: "India", regex: /^\d{10}$/ },
  { code: "+1", country: "USA", regex: /^\d{10}$/ },
  { code: "+44", country: "UK", regex: /^\d{10}$/ },
  

  // Add more country codes and their regex as needed
];

function App() {
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    email: "",
    phone_number: "",
    country_code: "+91",
    department: "",
    date_of_joining: "",
    role: "",
  });

  const [error, setError] = useState({});
  const [message, setMessage] = useState("");
  const [value, setValue] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setMessage("");

    // Frontend validation
    const newError = {};
    if (!formData.name) newError.name = "Name is required.";
    if (!formData.employee_id)
      newError.employee_id = "Employee ID is required.";
    if (!formData.email.includes("@")) newError.email = "Invalid email.";

    // Validate phone number based on selected country code
    const selectedCountry = countryCodes.find(
      (cc) => cc.code === formData.country_code,
    );
    if (!selectedCountry.regex.test(formData.phone_number)) {
      newError.phone_number = `Invalid phone number for ${selectedCountry.country}.`;
    }

    if (!formData.department) newError.department = "Department is required.";
    if (
      !formData.date_of_joining ||
      new Date(formData.date_of_joining) >
        new Date(new Date().setDate(new Date().getDate() + 1))
    ) {
      newError.date_of_joining = "Date is required";
    }
    if (!formData.role) newError.role = "Role is required.";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    // Submit to backend
    try {
      const res = await axios.post(
        "http://localhost:5000/add-employee",
        formData,
      );
      setMessage(res.data);
      setFormData({
        name: "",
        employee_id: "",
        email: "",
        phone_number: "",
        country_code: "+91",
        department: "",
        date_of_joining: "",
        role: "",
      });
    } catch (err) {
      setMessage(err.response.data);
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate());
    return today.toISOString().split("T")[0];
  };

  return (
    <div>
      <h1>Employee Management System</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <small>{error.name}</small>
        </div>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
          />
          <small>{error.employee_id}</small>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <small>{error.email}</small>
        </div>

        <div>
          <label>Phone Number:</label>
          <select
            name="country_code"
            value={formData.country_code}
            onChange={handleChange}
          >
            {countryCodes.map((cc) => (
              <option key={cc.code} value={cc.code}>
                {cc.country} ({cc.code})
              </option>
            ))}
          </select>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          
          {/* <PhoneInput
            placeholder="Enter phone number"
            value={value}
            onChange={setValue}
          /> */}
          <small>{error.phone_number}</small>
        </div>
        <div>
          <label>Department:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          <small>{error.department}</small>
        </div>
        <div>
          <label>Date of Joining:</label>
          <input
            type="date"
            name="date_of_joining"
            value={formData.date_of_joining}
            onChange={handleChange}
            max={getMaxDate()}
          />

          <small>{error.date_of_joining}</small>
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <small>{error.role}</small>
        </div>
        <button type="submit">Submit</button>
        <button
          type="reset"
          onClick={() =>
            setFormData({
              name: "",
              employee_id: "",
              email: "",
              phone_number: "",
              country_code: "+91",
              department: "",
              date_of_joining: "",
              role: "",
            })
          }
        >
          Reset
        </button>
      </form>
      <p>{message}</p>
      <EmployeeList/>
    </div>
  );
}

export default App;