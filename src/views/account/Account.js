import React from 'react'

import FirebaseAuth from '../misc/FirebaseAuth'
import Error from '../misc/Error'
import './account.css'
import { FirestoreDocument } from 'react-firestore'
import logOut from '../../actions/logOut'
import {
  Page,
} from '../../styles/layout'


const Account = () => (
  <Page>
    <FirebaseAuth>
      {({ isLoading, error, auth }) => {

        if (isLoading) {
          return <img src={require("../../media/loadingIcon.gif")} style={{ width: 100, height: 100 }} alt={"loading-icon"}/>
        }

        if (error) {
          return <Error error={error} />
        }

        if (!auth) {
          return null
        }

        return <FirestoreDocument
          path={"users/" + auth.email}
          render={({ isLoading, data }) => {
            return isLoading ? (
              <img src={require("../../media/loadingIcon.gif")} style={{ width: 100, height: 100 }} alt={"loading-icon"}/>
            ) : (
                <div className="account-container">
                  <h1>Account</h1>
                  <div className="account-grid">
                    <h3 id="w-node-fc96f600d9e7-8f8ce80c" className="profile-label">Name:</h3>
                    <div id="nameText" className="profile-text">{data.firstName + " " + data.lastName}</div>
                    <h3 id="emailLabel" className="profile-label">Email:</h3>
                    <div id="emailText" className="profile-text">{data.email}</div>
                    <h3 id="w-node-ac0bd14a8dd0-8f8ce80c" className="profile-label">Company:</h3>
                    <div id="companyText" className="profile-text">{data.company}</div>
                  </div>
                  <button id="logoutLink" className="logout-button" onClick={logOut}>Log Out</button>
                </div>
              )
          }}
        />

      }}
    </FirebaseAuth>
  </Page>
)

export default Account
