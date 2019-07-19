import React from 'react'
import FirebaseAuth from '../misc/FirebaseAuth'
import {Page,} from '../../styles/layout'
import Firebase from 'firebase/app'
import ChangeUserToManagerDialog from "../../components/dashboard/dialogBox/changeUserToManagerDialogBox";

let thi = this;

class Teams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamEmployee: [],
            teamMember: "",
            teamEmployeePageLoading: true,
            teamEmployeeError: false,
            teamEmployeeMessage: "",

            checkboxSelected: "",
            isCheckboxChecked: false,
            selectedUser: null,

            employee: [],
            addManager: false,
            addManagerTeam: false,
            addManagerTeamEmployee: false,
            openDialogBox: false,
            newManagerDetails: {
                team: "",
                employee: []
            }
        }
    }

    getTeamDetails() {
        const team = Firebase.firestore().collection("teams").doc(thi.props.match.params.team).get();
        team.then((detail) => {
            if (detail) {
                thi.setState({
                    teamEmployee: detail.data().employee,
                    teamMember: detail.data().member,
                    teamEmployeePageLoading: false,
                    teamEmployeeError: false,
                    teamEmployeeMessage: ""
                })
            }
        })
            .catch(error => {
                thi.setState({
                    teamEmployee: [],
                    teamMember: "",
                    teamEmployeePageLoading: false,
                    teamEmployeeError: false,
                    teamEmployeeMessage: error.message
                })
            })
    }

    componentDidMount() {
        thi = this;
        thi.getTeamDetails();
    }

    closeAddManagerDialogBox() {
        thi.setState({
            openDialogBox: false,
            addManagerTeam: false,
            addManagerTeamEmployee: false,
            newManagerDetails: {
                team: "",
                employee: []
            },
            selectedUser: null
        });
        document.getElementById("dialogBox").style.display = "none";
        document.getElementById("dialogBox").classList.remove("in");
        thi.getTeamDetails();
    }

    makeMeManager(e, team) {
        // code to change employee "user" role to "manager" role.
        const target = e.target;
        const selectedUserEmail = team.email;
        this.setState({
            checkboxSelected: target,
            isCheckboxChecked: true,
            selectedUser: team
        });
        if (target.checked) {
            // change the role of user from "users" collection to manager.. and delete user from teams..
            let totalEmployeeInTeam = [];
            Firebase.firestore().collection("users").doc(team.email).update({
                role: "manager"
            });
            const teams = Firebase.firestore().collection("teams").get();
            teams.then((teams) => {
                teams.forEach((team) => {
                    totalEmployeeInTeam = [];
                    const doc = Firebase.firestore().collection("teams").doc(team.id).get();
                    doc.then((doc) => {
                        if (doc) {
                            totalEmployeeInTeam = doc.data().employee;
                            for (let i = 0; i < totalEmployeeInTeam.length; i++) {
                                if (totalEmployeeInTeam[i].email === selectedUserEmail) {
                                    totalEmployeeInTeam.splice(i, 1)
                                }
                            }
                        }
                    }).then(() => {
                        Firebase.firestore().collection("teams").doc(team.id).update({
                            "employee": totalEmployeeInTeam
                        });
                    })
                })
            });


            // get employee

            Firebase.firestore().collection("users").where("role", "==", "user").get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        return;
                    }
                    snapshot.forEach((doc) => {
                        Firebase.firestore().collection("users").doc(doc.id).get().then((doc) => {
                            if (doc) {
                                let employee = thi.state.employee;
                                let data = doc.data();
                                data.value = doc.data().email;
                                data.label = doc.data().email;
                                employee.push(data);
                                thi.setState({
                                    employee
                                })
                            }
                        })
                    })
                });

            // now open dialog box to create new team for this manager....

            this.setState({
                openDialogBox: true,
                addManagerTeam: true,
                addManagerTeamEmployee: false
            });
            window.setTimeout(() => {
                document.getElementById("dialogBox").style.display = "block";
                document.getElementById("dialogBox").classList.add("in");
            }, 500)

        }
    }

    changeThisManagerTeam(e) {
        const target = e.target;
        thi.setState({
            newManagerDetails: Object.assign(thi.state.newManagerDetails, {[target.name]: target.value})
        })
    }

    addThisManagerTeam(e) {
        e.preventDefault();
        if (e.target.checkValidity()) {
            let isAlreadyTeam = false;
            let teams = [];
            let error = "error";
            Firebase.firestore().collection("teams").get().then((docs) => {
                docs.forEach((doc) => {
                    error = "";
                    teams.push(doc.id);
                });
            }).then(() => {
                if (error === "") {
                    teams.forEach((team) => {
                        if (team === thi.state.newManagerDetails.team) {
                            isAlreadyTeam = true;
                        }
                    });
                    if (isAlreadyTeam) {
                        // already team exist...
                    } else {
                        Firebase.firestore().collection("teams").doc(thi.state.newManagerDetails.team).set({
                            employee: [],
                            member: thi.state.selectedUser.email,
                            teamName: thi.state.newManagerDetails.team
                        });
                        // success team entered..
                        thi.setState({
                            openDialogBox: true,
                            addManagerTeam: false,
                            addManagerTeamEmployee: true
                        })
                    }

                } else {
                    // show error......error
                }
            })
        } else {
            const invalidInputs = document.querySelectorAll(".add-team-form input:invalid");
            for (let i = 0; i < invalidInputs.length; i++) {
                invalidInputs[i].setCustomValidity("Invalid Team Name");
            }
        }
    }

    changeThisManagerTeamEmployee = (selectedOptions) => {
        if (selectedOptions === null) {
            selectedOptions = []
        }
        thi.setState({
            newManagerDetails: Object.assign(thi.state.newManagerDetails, {"employee": selectedOptions})
        })
    };

    addThisManagerTeamEmployee(e) {
        e.preventDefault();
        Firebase.firestore().collection("teams").doc(thi.state.newManagerDetails.team).update({
            employee: thi.state.newManagerDetails.employee
        });
        // success adde users...
        thi.closeAddManagerDialogBox();
    }


    render() {
        return (
            <Page>
                <FirebaseAuth>
                    {({isLoading, error, auth}) => {
                        if (isLoading || this.state.teamEmployeePageLoading) {
                            return <img src={require("../../media/loadingIcon.gif")} alt={"loading-icon"}
                                        style={{width: 100, height: 100}}/>
                        } else {
                            if (auth) {
                                return <div>
                                    <div className="title-header">
                                        <h1 className="welcometext">Team Details - {this.props.match.params.team}</h1>
                                    </div>
                                    <table className="zui-table">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th style={{
                                                textAlign: "center",
                                                fontWeight: "bold"
                                            }}>{this.props.match.params.team} Team
                                            </th>
                                            <th></th>
                                            <th></th>
                                            <th></th>

                                        </tr>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Email Address</th>
                                            <th>Company</th>
                                            <th>PhoneNumber</th>
                                            <th>isManager</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.state.teamEmployeePageLoading && !this.state.teamEmployeeError && this.state.teamEmployee.length > 0 &&
                                            this.state.teamEmployee.map((team) => {
                                                return <tr>
                                                    <td>
                                                        {team.firstName + " " + team.lastName}
                                                    </td>
                                                    <td>
                                                        {team.email}
                                                    </td>
                                                    <td>
                                                        {team.company}
                                                    </td>
                                                    <td>
                                                        {team.phoneNumber}
                                                    </td>
                                                    <td>
                                                        <input type="checkbox"
                                                               onChange={(e) => this.makeMeManager(e, team)}
                                                               checked={(e) =>
                                                                   this.state.checkboxSelected === e.target ? this.state.isCheckboxChecked : false
                                                               }
                                                               id="employee"
                                                               name="employee"/>
                                                    </td>
                                                </tr>

                                            })
                                        }
                                        {
                                            !this.state.teamEmployeePageLoading && !this.state.teamEmployeeError && this.state.teamEmployee.length === 0 &&
                                            <tr>
                                                <td></td>
                                                <td>No team details found!!</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                        {
                                            !this.state.teamEmployeePageLoading && this.state.teamEmployeeError &&
                                            <tr>
                                                <td></td>
                                                <td>{this.state.teamEmployeeMessage}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }

                                        </tbody>
                                    </table>
                                    <ChangeUserToManagerDialog
                                        employee={this.state.employee}

                                        addManagerTeam={this.state.addManagerTeam}
                                        changeThisManagerTeam={this.changeThisManagerTeam}
                                        addThisManagerTeam={this.addThisManagerTeam}

                                        addManagerTeamEmployee={this.state.addManagerTeamEmployee}
                                        changeThisManagerTeamEmployee={this.changeThisManagerTeamEmployee}
                                        addThisManagerTeamEmployee={this.addThisManagerTeamEmployee}

                                        closeDialogBox={this.closeAddManagerDialogBox}
                                        newManagerDetails={this.state.newManagerDetails}/>
                                    {
                                        this.state.openDialogBox &&
                                        <div className="modal-backdrop fade show"></div>
                                    }
                                </div>
                            }
                            return null
                        }
                    }}
                </FirebaseAuth>
            </Page>
        )
    }
}

export default Teams