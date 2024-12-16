import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [error, setError] = useState(null);

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-employees');
            setEmployees(response.data);
        } catch (err) {
            setError('Failed to fetch employees');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Handle edit initiation
    const handleEdit = (employee) => {
        setEditingEmployee({...employee});
    };

    const handleDelete = async (employee) => {
        try {
            await axios.delete(`http://localhost:5000/delete-employee/${employee.employee_id}`);
            fetchEmployees(); // Refresh the list
        } catch (err) {
            setError('Failed to delete employee');
            console.error(err);
        }
    };


    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingEmployee(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save edited employee
    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/update-employee/${editingEmployee.employee_id}`, editingEmployee);
            fetchEmployees(); // Refresh the list
            setEditingEmployee(null);
        } catch (err) {
            setError('Failed to update employee');
            console.error(err);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setEditingEmployee(null);
    };

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Employee List</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Employee ID</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Department</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Date of Joining</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.employee_id} className="hover:bg-gray-100">
                            {editingEmployee && editingEmployee.employee_id === employee.employee_id ? (
                                // Edit mode
                                <>
                                    <td className="border p-2">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={editingEmployee.name} 
                                            onChange={handleInputChange} 
                                            className="w-full p-1 border"
                                        />
                                    </td>
                                    <td className="border p-2">{employee.employee_id}</td>
                                    <td className="border p-2">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={editingEmployee.email} 
                                            onChange={handleInputChange} 
                                            className="w-full p-1 border"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input 
                                            type="text" 
                                            name="department" 
                                            value={editingEmployee.department} 
                                            onChange={handleInputChange} 
                                            className="w-full p-1 border"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input 
                                            type="text" 
                                            name="role" 
                                            value={editingEmployee.role} 
                                            onChange={handleInputChange} 
                                            className="w-full p-1 border"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input 
                                            type="date" 
                                            name="date_of_joining" 
                                            value={new Date(editingEmployee.date_of_joining).toISOString().split('T')[0]} 
                                            onChange={handleInputChange} 
                                            className="w-full p-1 border"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={handleSave} 
                                                className="bg-green-500 text-white px-2 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={handleCancel} 
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                // View mode
                                <>
                                    <td className="border p-2">{employee.name}</td>
                                    <td className="border p-2">{employee.employee_id}</td>
                                    <td className="border p-2">{employee.email}</td>
                                    <td className="border p-2">{employee.department}</td>
                                    <td className="border p-2">{employee.role}</td>
                                    <td className="border p-2">{new Date(employee.date_of_joining).toLocaleDateString()}</td>
                                    <td className="border p-2">
                                        <button 
                                            onClick={() => handleEdit(employee)} 
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="border p-2">
                                        <button 
                                            onClick={() => handleDelete(employee)} 
                                            className="bg-blue-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;