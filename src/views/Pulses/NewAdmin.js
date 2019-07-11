import React from 'react'
import './admins.css'
import firebase from 'firebase'

async function addNewAdmin() {
    let email = document.getElementById('newAdminEmail').value;
    const userDoc = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get()
    const company = userDoc.data().company;
    const companyInfo = await firebase.firestore().collection("/companies").doc(`${company}`).get();
    const admins = companyInfo.data().admins;
    let newAdmins = [...admins, email];
    firebase.firestore().collection("/companies").doc(`${company}`).update({
        admins: newAdmins
    });
    firebase.firestore().collection(`/companies/${company}/employees`).doc(email).update({
        permission: "Admin"
    });
    document.getElementById('success-message').style.display = 'block';
}

const NewAdmin = ({ children }) => (
    <div className="newadmin">
        <h3>New Admin</h3>
        <input style={{ marginBottom: 10, width: 300, fontFamily: 'Montserrat', fontSize: 14 }} type="email" maxLength="256" placeholder="New Admin Email" id="newAdminEmail" />
        <div onClick={addNewAdmin} className="text-button">Add Admin</div>
        <h5 id="success-message" style={{display: 'none'}}>Success, Admin added</h5>
        {children}
    </div >
)

export default NewAdmin