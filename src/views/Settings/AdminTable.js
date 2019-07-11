import React, {Component} from 'react'
import firebase from 'firebase'

class AdminTable extends Component {

    constructor() {
        super();

        this.state = {
            rows: [],
            isLoading: true
        };
    }

    componentDidMount() {
        let self = this;
        firebase.auth().onAuthStateChanged(async function (user) {
            const userDoc = await firebase.firestore().collection("users").doc(user.email).get();
            const company = userDoc.data().company;
            const companyInfo = await firebase.firestore().collection("/companies").doc(`${company}`).get();
            const admins = companyInfo.data().admins;
            // const employeeDocs = await firebase.firestore().collection(`/companies/${company}/employees`).get();
            const rows = [];
            console.log(admins, "admins...");
            for (let i in admins) {
                rows.push({
                    key: (i+1),
                    employee: admins[i],
                    name: admins[i],
                    permission: "admin"
                })
            }
            // employeeDocs.forEach((employee) => {
            //     if (admins.includes(employee.id)) {
            //         rows.push({
            //             key: employee.id,
            //             employee,
            //             name: employee.data().Name,
            //             permission: employee.data().permission
            //         });
            //     }
            // });
            console.log(rows, "rows...........")
            self.setState({
                rows,
                isLoading: false
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <div className="loading">
                <img src={require("../../media/loadingIcon.gif")} style={{width: 100, height: 100, margin: 'auto'}}
                     alt={"loading-icon"}/>
            </div>
        }
        return (
            <div id="table" className="employee-table">
                <div className="title-div">
                    <tr className="titles">
                        <th className="name-column">Name</th>
                        <th className="email-column">Email</th>
                        <th className="permission-column">Permission</th>
                    </tr>
                </div>
                {this.state.rows.map(row =>
                    <div className="employee-div" key={`${row.key}`}>
                        <tr className="employee-row">
                            <td className="name-column">{row.name}</td>
                            <td className="email-column">{row.key}</td>
                            <td className="permission-column">{row.permission}</td>
                        </tr>
                    </div>
                )}
            </div>
        )
    }
}

export default AdminTable