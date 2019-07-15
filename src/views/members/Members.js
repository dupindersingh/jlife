import React from 'react'
import ReactGA from 'react-ga'
import FirebaseAuth from '../misc/FirebaseAuth'
import {Page,} from '../../styles/layout'
import Firebase from 'firebase/app'
import AddManagerDialog from "../../components/dashboard/dialogBox/addManagerDialogBox";

let thi = null;

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: [],
            members: [],
            membersPageLoading: true,
            membersError: false,
            membersMessage: "",
            addManager: false,
            addManagerTeam: false,
            addManagerTeamEmployee: false,
            openDialogBox: false,
            newManagerDetails: {
                manager_fname: "",
                manager_lname: "",
                manager_email: "",
                manager_company: "",
                password: "",
                team: "",
                employee: []
            }
        }
    }

    componentDidMount() {
        thi = this;
        Firebase.firestore().collection("users").where("role", "==", "user").get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
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
        const teams = Firebase.firestore().collection("teams").get();
        teams.then((all_teams) => {
            all_teams.forEach((t) => {
                const team = Firebase.firestore().collection("teams").doc(t.id).get();
                team.then((detail) => {
                    if (detail) {
                        console.log(detail.data(), "detail... data");
                        const member = detail.data().member;
                        console.log(member, "member in teams...");
                        const currentMember = Firebase.firestore().doc("users/" + member).get();
                        currentMember.then((currentMemberDocData) => {
                            if (currentMemberDocData) {
                                console.log(currentMemberDocData.data(), "email data....");
                                let members = thi.state.members;
                                members.push(currentMemberDocData.data());
                                thi.setState({
                                    members,
                                    membersPageLoading: false,
                                    membersError: false,
                                    membersMessage: ""
                                })
                            }
                        })
                            .catch(error => {
                                thi.setState({
                                    members: [],
                                    membersPageLoading: false,
                                    membersError: true,
                                    membersMessage: "111"
                                })
                            })
                    }
                })
            })
        })
    }

    openAddManagerDialogBox() {
        this.setState({
            openDialogBox: true,
            addManager: true,
            addManagerTeam: false,
            addManagerTeamEmployee: false,
            newManagerDetails: {
                manager_fname: "",
                manager_lname: "",
                manager_email: "",
                manager_company: "",
                password: "",
                team: "",
                employee: []
            }
        });
        window.setTimeout(() => {
            document.getElementById("dialogBox").style.display = "block";
            document.getElementById("dialogBox").classList.add("in");
        }, 500)
    }

    closeAddManagerDialogBox() {
        thi.setState({
            openDialogBox: false,
            addManager: false,
            addManagerTeam: false,
            addManagerTeamEmployee: false
        });
        document.getElementById("dialogBox").style.display = "none";
        document.getElementById("dialogBox").classList.remove("in");
    }

    changeThisManager(e) {
        const target = e.target;
        thi.setState({
            newManagerDetails: Object.assign(thi.state.newManagerDetails, {[target.name]: target.value})
        })
    }

    addThisManager(e) {
        e.preventDefault();
        if (e.target.checkValidity()) {
            let isAlreadyManager = false;
            const managers = thi.state.members;
            managers.forEach((manager) => {
                if (manager.email === thi.state.newManagerDetails.manager_email) {
                    isAlreadyManager = true;
                }
            });
            if (isAlreadyManager) {
                // already a manager error...
            } else {
                ReactGA.event({
                    category: 'User',
                    action: 'Sign Up',
                });

                let email = thi.state.newManagerDetails.manager_email;
                let password = thi.state.newManagerDetails.password;
                const managerFname = thi.state.newManagerDetails.manager_fname;
                const managerLname = thi.state.newManagerDetails.manager_lname;
                const managerCompany = thi.state.newManagerDetails.manager_company;
                return Firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function () {
                        Firebase.auth().currentUser.updateProfile({
                            displayName: managerFname + " " + managerLname
                        })
                    }).then(async function () {
                        // Add a new document in collection "users"
                        email = email.toLowerCase();
                        Firebase.firestore().collection("users").doc(email).set({
                            email: email,
                            firstName: managerFname,
                            lastName: managerLname,
                            company: managerCompany,
                            phoneNumber: "",
                            verification_code: "",
                            isAdmin: false,
                            role: "manager"
                        });
                        // manager added successfully...
                        thi.setState({
                            openDialogBox: true,
                            addManager: false,
                            addManagerTeam: true,
                            addManagerTeamEmployee: false
                        })
                    })
                    .catch(function (error) {
                        // show error heere...
                    });
            }
        } else {
            const invalidInputs = document.querySelectorAll(".add-manager-form input:invalid");
            for (let i = 0; i < invalidInputs.length; i++) {
                if (invalidInputs[i].name === "manager_fname") {
                    invalidInputs[i].setCustomValidity("Invalid First name");
                }
                if (invalidInputs[i].name === "manager_lname") {
                    invalidInputs[i].setCustomValidity("Invalid Last Name");
                }
                if (invalidInputs[i].name === "manager_company") {
                    invalidInputs[i].setCustomValidity("Invalid Company Name");
                }
                if (invalidInputs[i].name === "manager_email") {
                    invalidInputs[i].setCustomValidity("Invalid Email Address");
                }
                if (invalidInputs[i].name === "password") {
                    invalidInputs[i].setCustomValidity("Invalid Password");
                }
            }
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
            let error = "";
            Firebase.firestore().collection("teams").get().then((docs) => {
                docs.forEach((doc) => {
                    error = "";
                    teams.push(doc.id);
                });
            })
                .catch((err) => {
                    error = err.message
                });
            if (error === "") {
                teams.forEach((team) => {
                    if (team === thi.state.team) {
                        isAlreadyTeam = true;
                    }
                });
                if (isAlreadyTeam) {
                    console.log("already exist team")
                    // already team exist...
                } else {
                    Firebase.firestore().collection("teams").doc(thi.state.newManagerDetails.team).set({
                        employee: [],
                        member: thi.state.newManagerDetails.manager_email,
                        teamName: thi.state.newManagerDetails.team
                    });
                    // success team entered..
                    thi.setState({
                        openDialogBox: true,
                        addManager: false,
                        addManagerTeam: false,
                        addManagerTeamEmployee: true
                    })
                }

            } else {
                // show error......error
            }
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
        const {employee} = this.state;
        console.log(employee, "all employee users..")
        return (
            <Page>
                <FirebaseAuth>
                    {({isLoading, error, auth}) => {
                        if (isLoading || this.state.membersPageLoading) {
                            return <img src={require("../../media/loadingIcon.gif")} alt={"loading-icon"}
                                        style={{width: 100, height: 100}}/>
                        } else {
                            if (auth) {
                                return <div>
                                    <div className="title-header">
                                        <h1 className="welcometext">Managers List</h1>
                                    </div>
                                    <div>
                                        <button id="addManager" className="submit-button"
                                                onClick={this.openAddManagerDialogBox.bind(this)}>Add Manager +
                                        </button>
                                    </div>
                                    <table className="zui-table">
                                        <thead>
                                        <tr>
                                            <th>Member Name</th>
                                            <th>Email Address</th>
                                            <th>Company</th>
                                            <th>PhoneNumber</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.state.membersPageLoading && !this.state.membersError && this.state.members.length > 0 &&
                                            this.state.members.map((member) => {
                                                return <tr>
                                                    <td>
                                                        {member.firstName + " " + member.lastName}
                                                    </td>
                                                    <td>
                                                        {member.email}
                                                    </td>
                                                    <td>
                                                        {member.company}
                                                    </td>
                                                    <td>
                                                        {member.phoneNumber}
                                                    </td>
                                                </tr>

                                            })
                                        }
                                        {
                                            !this.state.membersPageLoading && !this.state.membersError && this.state.members.length === 0 &&
                                            <tr>
                                                <td></td>
                                                <td>No members found!!</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                        {
                                            !this.state.membersPageLoading && this.state.membersError &&
                                            <tr>
                                                <td></td>
                                                <td>{this.state.membersMessage}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }

                                        </tbody>
                                    </table>
                                    <AddManagerDialog
                                        employee={this.state.employee}

                                        managers={this.state.members}

                                        addManager={this.state.addManager}
                                        changeThisManager={this.changeThisManager}
                                        addThisManager={this.addThisManager}

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

export default Menu