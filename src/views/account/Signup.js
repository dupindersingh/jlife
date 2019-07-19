import React from 'react'
import signUp from '../../actions/signUp'
import {Page,} from '../../styles/layout'

export default class Signup extends React.Component {
    render() {
        return (
            <Page className="signup-page">
                <div>
                    <div className="signup-container">
                        <h1 className="signup-header">Sign Up</h1>
                        <div id="signupForm" className="signup-form">
                            <form id="signupForm" name="signupForm" data-name="signupForm" redirect="/menu"
                                  data-redirect="/menu">
                                <input type="text" className="signup-input" name="firstName-2" data-name="First Name 2"
                                       placeholder="First Name" id="firstName" required=""/>
                                <input type="text" className="signup-input" name="lastName-2" data-name="Last Name 2"
                                       placeholder="Last Name" id="lastName" required=""/>
                                <input type="text" className="signup-input" name="Company" data-name="Company"
                                       placeholder="Company"
                                       id="company" required=""/>
                                <input type="email" className="signup-input" name="signup-Email"
                                       data-name="signup Email"
                                       placeholder="Email" id="signupEmail" required=""/>
                                <input type="password" className="signup-input" name="signupPassword"
                                       data-name="signup Password"
                                       placeholder="Password" id="signupPassword" required=""/>
                            </form>
                            <button id="signupButton" className="submit-button" onClick={signUp}>Sign Up</button>
                        </div>
                        <p id="signupError" className="error-message">Error message</p>
                        <a href="./" className="link">Already have an account?</a></div>
                </div>
            </Page>
        )

    }
}