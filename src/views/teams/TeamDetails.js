import React from 'react'
import FirebaseAuth from '../misc/FirebaseAuth'
import {Page,} from '../../styles/layout'
import Firebase from 'firebase/app'

class Teams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamEmployee: [],
            teamMember: "",
            teamEmployeePageLoading: true,
            teamEmployeeError: false,
            teamEmployeeMessage: ""
        }
    }

    componentDidMount() {
        const thi = this;
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
                                            <th style={{textAlign: "center", fontWeight: "bold"}}>{this.props.match.params.team} Team</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Email Address</th>
                                            <th>Company</th>
                                            <th>PhoneNumber</th>
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
                                                </tr>

                                            })
                                        }
                                        {
                                            !this.state.teamEmployeePageLoading && !this.state.teamEmployeeError && this.state.teamEmployee.length === 0 &&
                                            <tr>
                                                <td>No team details found!!</td>
                                                <td></td>
                                            </tr>
                                        }
                                        {
                                            !this.state.teamEmployeePageLoading && this.state.teamEmployeeError &&
                                            <tr>
                                                <td>{this.state.teamEmployeeMessage}</td>
                                                <td></td>
                                            </tr>
                                        }

                                        </tbody>
                                    </table>
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