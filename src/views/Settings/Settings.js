import React, { Component } from 'react'
import './admins.css'
import AdminTable from './AdminTable';
import NewAdmin from './NewAdmin'


class Settings extends Component {
    constructor() {
        super();

        this.admins = [];
        this.state = {
            rows: [],
            newAdminVisible: false,
        };

        this.showNewAdmin = this.showNewAdmin.bind(this);
        this.hideNewAdmin = this.hideNewAdmin.bind(this);
    }

    showNewAdmin = () => {
        this.setState({
            newAdminVisible: true
        })
    }

    hideNewAdmin() {
        this.setState({
            newAdminVisible: false
        })
    }

    render() {
        return (
            <div className="page-div" >
                <div className="page-header">
                    <h2 className="page-heading">Admins</h2>
                    <div className="search-and-add">
                        <button className="add-button w-button" onClick={this.showNewAdmin}>Add Admin</button>
                    </div>
                </div>
                {this.state.newAdminVisible ?
                    <NewAdmin>
                        <div onClick={this.hideNewAdmin} className="text-button">Close</div>
                    </NewAdmin>
                    :
                    null
                }
                <AdminTable/>
            </div >
        )
    }
}

export default Settings