import React, { Component } from 'react'
import './employees.css'
import EmployeeTable from './EmployeeTable';

class Dashboard extends Component {
    constructor() {
        super();

        this.employees = [];

    }

    render() {
        return (
            <div className="page-div" >
                <div className="page-header">
                    <h2 className="page-heading">Employees</h2>
                    <div className="search-and-add" style={{display: 'none'}}>
                        <input type="text" className="page-search" maxLength="256" name="pulse-search" data-name="Pulse Search" placeholder="Search for Employees" id="pulse-search" required="" />
                        <button className="add-button w-button" >
                            <strong>+</strong>  New Employee
                </button>
                    </div>
                </div>
                <EmployeeTable />
            </div >
        )
    }
}

export default Dashboard