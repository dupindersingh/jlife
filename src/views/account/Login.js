import React from 'react';

import logInEmail from '../../actions/logInEmail';
// import logInPhone from '../../actions/logInPhone';
import {Page,} from '../../styles/layout'
import './login.css'
// "signInWithPhoneNumber failed: Second argument "applicationVerifier" must be an implementation of firebase.auth.ApplicationVerifier."

export default class Login extends React.Component {
    render() {
        return (
            <Page className="login-page">
                <div>
                    <div className="login-container">
                        <div className="email-password-login">
                            <h1 className="login-header">Log In</h1>
                            <div id="loginForm" className="login-form">
                                <form id="loginForm" name="loginForm" data-name="loginForm" redirect="/dashboard"
                                      data-redirect="/dashboard">
                                    <input type="email" className="signup-email" maxLength="256" name="Login-Email"
                                           data-name="Login Email" placeholder="Email" id="loginEmail" required=""/>
                                    <input type="password" className="signup-password" maxLength="256"
                                           name="loginPassword"
                                           data-name="Login Password" placeholder="password" id="loginPassword"
                                           required=""/>
                                </form>
                            </div>
                            <button id="loginButton" className="submit-button" onClick={logInEmail}>Log In with Email
                            </button>
                        </div>
                        <p id="loginError" className="error-message">Error message</p>
                        <a id="forgotPassword" href="reset-password">
                            <div className="link">Forgot Password?</div>
                        </a><a href="./signup" className="link">Don&#x27;t have an account? Make one</a></div>
                </div>

            </Page>
        )
    }
}


