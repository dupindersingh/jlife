import React from 'react'
import firebase from 'firebase'
import {
  Page,
} from '../../styles/layout'
import './login.css'

function sendResetPassEmail() {
  let auth = firebase.auth();
  let emailAddress = document.getElementById('resetEmail').value;

  auth.sendPasswordResetEmail(emailAddress).then(function () {
    document.getElementById('success').style.display = 'block';
    document.getElementById('return').style.display = 'block';
    // Email sent.
  }).catch(function (error) {
    document.getElementById('error').innerHTML = error;
    document.getElementById('error').style.display = 'block';
    // An error happened.
  });
}

const ResetPassword = () => (
  <Page className="login-page">
    <div className="login-container">
      <h2 className="login-header">Reset Password</h2>
      <div id="loginForm" className="login-form">
        <input type="email" className="signup-email" maxLength="256" name="Login-Email" data-name="Login Email" placeholder="Email" id="resetEmail" required="" />
      </div>
      <button id="loginButton" className="submit-button" onClick={sendResetPassEmail}>Send password reset</button>
      <p id="error" className="error-message">Error message</p>
      <p id="success" className="error-message" style={{color: 'black'}}>Sending email</p>
      <a href="./" className="submit-button">Back to Login</a>
    </div>
  </Page>
)

export default ResetPassword
