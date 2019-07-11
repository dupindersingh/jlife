import React from 'react'
import './employeecard.css'

const EmployeeCard = ({ employee, children }) => (
    <div className="employeecard">
        <h3>{employee.Name}</h3>
        <h3>{employee.email}</h3>
        
        {children}
    </div >
)

export default EmployeeCard