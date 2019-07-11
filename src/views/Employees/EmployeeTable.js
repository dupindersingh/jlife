import React, {Component} from 'react'
import firebase from 'firebase'
import EmployeeCard from './EmployeeCard';

class EmployeeTable extends Component {

    constructor() {
        super();

        this.state = {

            rows: [],
            isLoading: true,
            employeeCardVisible: false,
            employee: null
        };

        this.showEmployeeCard = this.showEmployeeCard.bind(this);
        this.hideEmployeeCard = this.hideEmployeeCard.bind(this);
    }

    showEmployeeCard = (e) => {

        // 3EmployeeTable.js:26 undefined "id" "undefined" 3 "id2" "number"?
        const self = this;
        const employees = self.state.rows;
        console.log(employees, "employees")
        for (let i in employees) {
            console.log(employees[i]["key"],"id", typeof employees[i]["key"], Number(e.target.id), "id2", typeof Number(e.target.id))
            if (employees[i]["key"] === Number(e.target.id)) {
                self.setState({
                    employee: employees[i],
                    employeeCardVisible: true
                });
            }
        }
    };

    hideEmployeeCard() {
        this.setState({
            employeeCardVisible: false
        })
    }

    componentDidMount() {
        let self = this;
        firebase.auth().onAuthStateChanged(async function (user) {
            const userDoc = await firebase.firestore().collection("users").doc(user.email).get();
            const company = userDoc.data().company;
            const employeesDoc = await firebase.firestore().collection("companies").doc(`${company}`).get();
            console.log(employeesDoc, "employeeDocs");
            const rows = [];
            const employeesList = employeesDoc.data().employees;
            employeesList.forEach((employee) => {
                rows.push({
                    key: employee.id,
                    employee,
                    email: employee.email,
                    name: employee.Name,
                });
            });
            self.setState({
                rows,
                isLoading: false
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <div className="loading">
                <img src={require("../../media/loadingIcon.gif")}
                     style={{width: 100, height: 100, margin: 'auto'}}
                     alt={"loading-icon"}/>
            </div>
        }
        return (
            <div id="table" className="employee-table">
                {this.state.employeeCardVisible ?
                    <EmployeeCard employee={this.state.employee}>
                        <div onClick={this.hideEmployeeCard} className="view-column">Close</div>
                    </EmployeeCard>
                    :
                    null
                }
                <div className="title-div">
                    <tr className="titles">
                        <th className="name-column">Name</th>
                        <th className="email-column">Email</th>
                        <th className="alignment-column" style={{display: 'none'}}>Alignment</th>
                        <th className="view-column no-hover">View</th>
                    </tr>
                </div>
                {this.state.rows.map(row =>
                    <div className="employee-div" key={`${row.key}`}>
                        <tr className="employee-row">
                            <td className="name-column">{row.name}</td>
                            <td className="email-column">{row.email}</td>
                            <td className="alignment-column" style={{display: 'none'}}>95%</td>
                            <td id={`${row.key}`} className="view-column" onClick={this.showEmployeeCard}>View
                            </td>
                        </tr>
                    </div>
                )}
            </div>
        )
    }
}

export default EmployeeTable