import React from 'react';
import Select from 'react-select';


class ChangeUserToManagerDialog extends React.Component {
    render() {
        const {
            employee,
            addManagerTeam, changeThisManagerTeam, addThisManagerTeam,
            addManagerTeamEmployee, changeThisManagerTeamEmployee, addThisManagerTeamEmployee,
            closeDialogBox, newManagerDetails
        } = this.props;
        return (
            <div>
                <div className="modal" id="dialogBox" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
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

export default ChangeUserToManagerDialog