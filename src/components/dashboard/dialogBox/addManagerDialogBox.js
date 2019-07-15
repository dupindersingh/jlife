import React from 'react';
import Select from 'react-select';


class AddManagerDialog extends React.Component {
    render() {
        const {
            employee,
            addManager, changeThisManager, addThisManager,
            addManagerTeam, changeThisManagerTeam, addThisManagerTeam,
            addManagerTeamEmployee, changeThisManagerTeamEmployee, addThisManagerTeamEmployee,
            closeDialogBox, newManagerDetails
        } = this.props;
        // console.log(managers, addManager, addManagerTeam, openDialogBox, "managers, addManager, addManagerTeam, openDialogBox");
        return (
            <div>
                <div className="modal" id="dialogBox" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        {
                            addManager &&
                            <form onSubmit={addThisManager.bind(this)} className="add-manager-form">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"
                                            id="exampleModalCenterTitle">Add Manager</h5>
                                    </div>
                                    <div className="code">
                                        <input type="text" placeholder={"Enter Manager First Name"}
                                               style={{width: "100%"}} name="manager_fname"
                                               value={newManagerDetails.manager_fname}
                                               onChange={changeThisManager.bind(this)}
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               required={false}
                                        /><br/>
                                        <input type="text" placeholder={"Enter Manager Last Name"}
                                               style={{width: "100%"}} name="manager_lname"
                                               value={newManagerDetails.manager_lname}
                                               onChange={changeThisManager.bind(this)}
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               required={false}
                                        /><br/>
                                        <input type="text" placeholder={"Enter Company"}
                                               style={{width: "100%"}} name="manager_company"
                                               value={newManagerDetails.manager_company}
                                               onChange={changeThisManager.bind(this)}
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               required={false}
                                        /><br/>
                                        <input type="email" placeholder={"Enter Email Address"}
                                               style={{width: "100%"}} name="manager_email"
                                               value={newManagerDetails.manager_email}
                                               onChange={changeThisManager.bind(this)}
                                               required={true}
                                        /><br/>
                                        <input type="password" placeholder={"Enter Password"}
                                               style={{width: "100%"}} name="password"
                                               value={newManagerDetails.password}
                                               onChange={changeThisManager.bind(this)}
                                               required={true}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                onClick={closeDialogBox.bind(this)}>Close
                                        </button>
                                        <button type="submit" className="btn submit-btn">Next</button>
                                    </div>
                                </div>
                            </form>
                        }
                        {
                            addManagerTeam &&
                            <form onSubmit={addThisManagerTeam.bind(this)} className="add-team-form">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"
                                            id="exampleModalCenterTitle">Add Team</h5>
                                    </div>
                                    <div className="code">
                                        <input type="text" placeholder={"Enter Team Name"}
                                               style={{width: "100%"}} name="team"
                                               onChange={changeThisManagerTeam.bind(this)}
                                               value={newManagerDetails.team}
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([0-9a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               required={true}/>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                onClick={closeDialogBox.bind(this)}>Close
                                        </button>
                                        <button type="submit" className="btn submit-btn">Next</button>
                                    </div>
                                </div>
                            </form>
                        }
                        {
                            addManagerTeamEmployee &&
                            <form onSubmit={addThisManagerTeamEmployee.bind(this)} className="add-employee-form">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"
                                            id="exampleModalCenterTitle">Add Employee</h5>
                                    </div>
                                    <div className="code">
                                        <Select
                                            closeMenuOnSelect={false}
                                            value={newManagerDetails.employee }
                                            onChange={changeThisManagerTeamEmployee.bind(this)}
                                            placeholder="Choose Employee"
                                            isSearchable={true}
                                            isMulti={true}
                                            options={employee}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                onClick={closeDialogBox.bind(this)}>Close
                                        </button>
                                        <button type="submit" className="btn submit-btn">Submit</button>
                                    </div>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default AddManagerDialog