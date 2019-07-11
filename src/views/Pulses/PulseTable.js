import React, { Component } from 'react'
import axios from 'axios'
import firebase from 'firebase'
import { ReactTypeformEmbed } from 'react-typeform-embed'

class PulseTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            isLoading: true,
            showurl: null,
            pulseUrl: null,
            pulseTitle: null,
            userEmail: null,
            employees: []
        };

        this.showPulse = this.showPulse.bind(this);
        this.sendPulseConfirm = this.sendPulseConfirm.bind(this);
        this.sendPulse = this.sendPulse.bind(this);
        this.cancelPulse = this.cancelPulse.bind(this);
    }

    showPulse = (e) => {
        e.preventDefault();
        const link = e.target.dataset.link;
        console.log(link, "link.....");
        let self = this;
        this.setState({
            showurl: link
        }, () => {
            self.typeformEmbed.typeform.open();
        })
    };

    sendPulseConfirm = (e) => {
        e.preventDefault();
        document.getElementById('cancelPulseButton').innerHTML = 'No';
        document.getElementById('confirmPulse').style.position = 'absolute';
        document.getElementById('confirmPulse').style.display = 'flex';
        console.log(e.target, "target...");
        this.setState({
            pulseUrl: e.target.dataset.link,
            pulseTitle: e.target.dataset.title,
        })
    };

    sendPulse() {
        document.getElementById('sendingPulse').style.display = 'block';
        axios({
            method: 'POST',
            baseURL: 'https://us-central1-journeylife-dev.cloudfunctions.net/sendPulse',
            headers: { 'Content-Type': 'application/json' },
            data: {
                pulseUrl: this.state.pulseUrl,
                pulseTitle: this.state.pulseTitle,
                employees: this.state.employees,
                company: this.state.company
            }
        }).then(function () {
            document.getElementById('sendingPulse').style.display = 'none';
            document.getElementById('sentPulse').style.display = 'block';
            document.getElementById('cancelPulseButton').innerHTML = 'Close';
        }).catch(function(error) {
            console.log(error);
            document.getElementById('sendingPulse').style.display = 'none';
            document.getElementById('errorMessage').innerHTML = error;
            document.getElementById('errorMessage').style.display = 'block';
        })
    }

    cancelPulse() {
        document.getElementById('confirmPulse').style.display = 'none';
        this.setState({
            pulseUrl: null,
            pulseTitle: null,
        })
        document.getElementById('sentPulse').style.display = 'none';
        document.getElementById('sendingPulse').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    componentDidMount() {
        let self = this;
        firebase.auth().onAuthStateChanged(async function (user) {
            const userDoc = await firebase.firestore().collection("users").doc(user.email).get();
            console.log(userDoc.data(), "userDoc email.....");
            const company = userDoc.data().company;
            const companyInfo = await firebase.firestore().collection("/companies").doc(`${company}`).get();
            axios({
                method: 'get',
                baseURL: 'https://api.typeform.com/forms',
                headers: { Authorization: 'Bearer 6QvyQsHdiwj9UNcTiaU49Lg5LkFSh17j7MtQXECRt9Zy' },
                params: {
                    workspace_id: companyInfo.data().typeform.workspaceID
                }
            }).then(function (response) {
                self.setState({
                    rows: response.data.items,
                    isLoading: false,
                    employees: companyInfo.data().employees,
                    company: company
                });
            }).catch(function (error) {
                console.log("Error: " + error)
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <div className="loading">
                <img src={require("../../media/loadingIcon.gif")} style={{ width: 100, height: 100, margin: 'auto' }} alt={"loading-icon"} />
            </div>
        }
        return (
            <div id="table" className="employee-table">
                <div id="confirmPulse" className="confirm-pulse" style={{ display: 'none' }}>
                    Send Pulse?
                    <h4>{this.state.pulseTitle}</h4>
                    <div>
                        <button onClick={this.sendPulse}>Yes</button>
                        <button onClick={this.cancelPulse} id="cancelPulseButton">No</button>
                    </div>
                    <div id="sendingPulse" style={{ display: 'none', fontFamily: 'Montserrat' }}>Sending</div>
                    <div id="sentPulse" style={{ display: 'none', fontFamily: 'Montserrat' }}>Sent</div>
                    <div id="errorMessage" style={{ display: 'none', fontFamily: 'Montserrat', color: 'red' }}></div>
                </div>
                {this.state.showurl ?
                    <ReactTypeformEmbed
                        popup
                        url={this.state.showurl}
                        hideHeaders
                        autoOpen={false}
                        style={{ top: 100, height: 0 }}
                        hideFooter
                        ref={tf => {
                            this.typeformEmbed = tf;
                        }}
                    />
                    :
                    null
                }
                <div className="title-div">
                    <tr className="titles">
                        <th className="name-column">Title</th>
                        <th className="view-column no-hover">View</th>
                        <th className="view-column no-hover">Send</th>
                    </tr>
                </div>
                {this.state.rows.map(row =>
                    <div className="employee-div" key={`${row.id}`}>
                        <tr className="employee-row">
                            <td className="name-column">{row.title}</td>
                            <td className="view-column" data-link={row['_links'].display} onClick={this.showPulse}>View</td>
                            <td className="view-column" data-link={row['_links'].display} data-title={row.title} onClick={this.sendPulseConfirm}>Send</td>
                        </tr>
                    </div>
                )}
            </div>
        )
    }
}

export default PulseTable;