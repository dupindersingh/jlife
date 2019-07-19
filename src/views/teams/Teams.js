import React from 'react'
import FirebaseAuth from '../misc/FirebaseAuth'
import {Page,} from '../../styles/layout'
import Firebase from 'firebase/app'
import {Link} from 'react-router-dom';

class Teams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            teamsPageLoading: true,
            teamsError: false,
            teamsMessage: ""
        }
    }

    componentDidMount() {
        const thi = this;
        const teams = Firebase.firestore().collection("teams").get();
        teams.then((all_teams) => {
            all_teams.forEach((t) => {
                const team = Firebase.firestore().collection("teams").doc(t.id).get();
                team.then((detail) => {
                    if (detail) {
                        let teams = thi.state.teams;
                        teams.push({name: detail.data().teamName, employee: detail.data().employee.length});
                        thi.setState({
                            teams,
                            teamsPageLoading: false,
                            teamsError: false,
                            teamsMessage: ""
                        })
                    }
                })
                    .catch(error => {
                        thi.setState({
                            teams: [],
                            teamsPageLoading: false,
                            teamsError: true,
                            teamsMessage: error.message
                        })
                    })
            })
        })
    }

    render() {
        return (
            <Page>
                <FirebaseAuth>
                    {({isLoading, error, auth}) => {
                        if (isLoading || this.state.teamsPageLoading) {
                            return <img src={require("../../media/loadingIcon.gif")} alt={"loading-icon"}
                                        style={{width: 100, height: 100}}/>
                        } else {
                            if (auth) {
                                return <div>
                                    <div className="title-header">
                                        <h1 className="welcometext">All Teams</h1>
                                    </div>
                                    <table className="zui-table">
                                        <thead>
                                        <tr>
                                            <th>Team Name</th>
                                            <th>Total Employee</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            !this.state.teamsPageLoading && !this.state.teamsError && this.state.teams.length > 0 &&
                                            this.state.teams.map((team) => {
                                                return <tr>
                                                    <td>
                                                        {team.name}
                                                    </td>
                                                    <td>
                                                        <Link to={"/teams/"+team.name+"/details"}>{team.employee}</Link>
                                                    </td>
                                                </tr>

                                            })
                                        }
                                        {
                                            !this.state.teamsPageLoading && !this.state.teamsError && this.state.teams.length === 0 &&
                                            <tr>
                                                <td>No teams found!!</td>
                                                <td></td>
                                            </tr>
                                        }
                                        {
                                            !this.state.teamsPageLoading && this.state.teamsError &&
                                            <tr>
                                                <td>{this.state.teamsMessage}</td>
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