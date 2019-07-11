import React from 'react'
import Firebase from 'firebase/app'

import signUp from '../../actions/signUp'
import {Page,} from '../../styles/layout'
import './signup.css'
import ReactGA from "react-ga";

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            confirmResult: {},
            code: "",
            email: "",
            phoneNumber: ""
        }
    }

    componentDidMount() {
        window.recaptchaVerifier = new Firebase.auth.RecaptchaVerifier("recaptcha-container",
            {
                // type: 'image', // another option is 'audio'
                size: 'invisible', // other options are 'normal' or 'compact'
                // badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
            });
    }

    phoneLogin(e) {
        e.preventDefault();
        const thi = this;
        const phoneNumber = thi.state.phoneNumber;
        const appVerifier = window.recaptchaVerifier;
        const signupButton = document.getElementById('signupButton');
        const signupError = document.getElementById('signupError');
        Firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(confirmResult => {
                document.getElementById("dialogBox").style.display = "block";
                document.getElementById("dialogBox").classList.add("in");
                thi.setState({
                    showDialog: true,
                    confirmResult,
                    code: "",
                    email: "",
                    phoneNumber: thi.state.phoneNumber
                });
                console.log(confirmResult, "confirm esul...");
            })
            .catch(error => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error code: ' + errorCode);
                console.log('Error message: ' + errorMessage);
                if (!!signupButton && !!signupError) {
                    signupButton.style.display = 'block';
                    signupError.innerText = errorMessage;
                    signupError.style.display = 'block';
                }
            });
    }

    onCodeChange(e) {
        const target = e.target;
        this.setState({
            [target.name]: target.value
        })
    }

    submitVerificationCode(e) {
        e.preventDefault();
        const thi = this;
        console.log(this.state.code, "code", this.state.email, "email..");
        const signupButton = document.getElementById('signupButton');
        const signupError = document.getElementById('signupError');

        if (!!thi.state.email) {
            ReactGA.event({
                category: 'User',
                action: 'Sign Up',
            });

            let email = thi.state.email;
            let password = "dupinderonjourneylife";
            return Firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(async function () {
                    if (!!thi.state.code) {
                        console.log(thi.state.confirmResult, "thi.state.confirmResult")
                        thi.state.confirmResult.confirm(thi.state.code).then(function (result) {
                            // Add a new document in collection "users"
                            email = email.toLowerCase();
                            Firebase.firestore().collection("users").doc(email.toLowerCase()).set({
                                email: email,
                                firstName: "",
                                lastName: "",
                                company: "",
                                role: "admin",
                                phoneNumber: thi.state.phoneNumber,
                                verification_code: thi.state.code
                            })
                                .then(function () {
                                    console.log("Document successfully written!");
                                    window.location.replace('./menu');
                                })
                                .catch(function (error) {
                                    var errorCode = "Error writing document.";
                                    var errorMessage = "Error writing document";
                                    console.log('Error code: ' + errorCode);
                                    console.log('Error message: ' + errorMessage);
                                    if (!!signupButton && !!signupError) {
                                        signupButton.style.display = 'block';
                                        signupError.innerText = errorMessage;
                                        signupError.style.display = 'block';
                                    }
                                });
                            document.getElementById("dialogBox").style.display = "none";
                            document.getElementById("dialogBox").classList.remove("in");
                            thi.setState({
                                showDialog: false,
                                confirmResult: thi.state.confirmResult,
                                code: "",
                                email: "",
                                phoneNumber: ""
                            });
                        }).catch(function (error) {
                            document.getElementById("dialogBox").style.display = "none";
                            document.getElementById("dialogBox").classList.remove("in");
                            thi.setState({
                                showDialog: false,
                                confirmResult: thi.state.confirmResult,
                                code: "",
                                email: "",
                                phoneNumber: ""
                            });
                            var errorCode = "Wrong entered code...";
                            var errorMessage = "Wrong entered code...";
                            console.log('Error code: ' + errorCode);
                            console.log('Error message: ' + errorMessage);
                            if (!!signupButton && !!signupError) {
                                signupButton.style.display = 'block';
                                signupError.innerText = errorMessage;
                                signupError.style.display = 'block';
                            }
                        })
                    } else {
                        document.getElementById("dialogBox").style.display = "none";
                        document.getElementById("dialogBox").classList.remove("in");
                        thi.setState({
                            showDialog: false,
                            confirmResult: thi.state.confirmResult,
                            code: "",
                            email: "",
                            phoneNumber: ""
                        });
                        var errorCode = "Wrong entered code...";
                        var errorMessage = "Wrong entered code...";
                        console.log('Error code: ' + errorCode);
                        console.log('Error message: ' + errorMessage);
                        if (!!signupButton && !!signupError) {
                            signupButton.style.display = 'block';
                            signupError.innerText = errorMessage;
                            signupError.style.display = 'block';
                        }
                    }
                })
                .catch(function (error) {
                    document.getElementById("dialogBox").style.display = "none";
                    document.getElementById("dialogBox").classList.remove("in");
                    thi.setState({
                        showDialog: false,
                        confirmResult: thi.state.confirmResult,
                        code: "",
                        email: "",
                        phoneNumber: ""
                    });
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log('Error code: ' + errorCode);
                    console.log('Error message: ' + errorMessage);
                    document.getElementById('signupButton').style.display = 'block';
                    document.getElementById('signupError').innerText = errorMessage;
                    document.getElementById('signupError').style.display = 'block';

                });
        } else {
            document.getElementById("dialogBox").style.display = "none";
            document.getElementById("dialogBox").classList.remove("in");
            thi.setState({
                showDialog: false,
                confirmResult: thi.state.confirmResult,
                code: "",
                email: "",
                phoneNumber: ""
            });
            var errorCode = "Wrong entered email...";
            var errorMessage = "Wrong entered email...";
            console.log('Error code: ' + errorCode);
            console.log('Error message: ' + errorMessage);
            if (!!signupButton && !!signupError) {
                signupButton.style.display = 'block';
                signupError.innerText = errorMessage;
                signupError.style.display = 'block';
            }
        }
    }

    closeDialog(e) {
        e.preventDefault();
        const signupButton = document.getElementById('signupButton');
        const signupError = document.getElementById('signupError');
        const thi = this;
        var errorCode = "Process closed by user..";
        var errorMessage = "Process closed by user..";
        console.log('Error code: ' + errorCode);
        console.log('Error message: ' + errorMessage);
        if (!!signupButton && !!signupError) {
            signupButton.style.display = 'block';
            signupError.innerText = errorMessage;
            signupError.style.display = 'block';
        }
        document.getElementById("dialogBox").style.display = "none";
        document.getElementById("dialogBox").classList.remove("in");
        thi.setState({
            showDialog: false,
            confirmResult: thi.state.confirmResult,
            code: "",
            email: "",
            phoneNumber: ""
        });
    }

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

                        <div class="or"><span>OR</span></div>
                        <div id="signupForm" className="signup-form">
                            <input id="recaptcha-container" type="button" onClick="this.onClick"/>
                            <form id="signupForm" name="signupForm" data-name="signupForm" redirect="/menu"
                                  data-redirect="/menu">
                                <input type="phone" className="signup-input" name="phoneNumber"
                                       data-name="signup Password"
                                       placeholder="PhoneNumber" id="signupPassword"
                                       onChange={this.onCodeChange.bind(this)} required=""/>
                                <button id="signupButton" className="submit-button"
                                        onClick={this.phoneLogin.bind(this)} data-toggle="modal"
                                        data-target="#dialogBox"
                                        data-backdrop="false">Signup
                                </button>
                            </form>
                        </div>


                        <p id="signupError" className="error-message">Error message</p>
                        <a href="./" className="link">Already have an account?</a></div>


                </div>
                <form onSubmit={this.submitVerificationCode.bind(this)} className="logout-form">
                    <div className="modal" id="dialogBox" tabIndex="-1" role="dialog"
                         aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"
                                        id="exampleModalCenterTitle"> Please enter the code sent to your phone
                                        number.</h5>
                                </div>
                                <div className="code">
                                    <input type="text" placeholder={"Enter OTP"} style={{width: "100%"}} name="code"
                                           value={this.state.code}
                                           onChange={this.onCodeChange.bind(this)}/><br/>
                                    <input type="email" style={{width: "100%"}} name="email"
                                           placeholder={"Enter Emailaddress"}
                                           value={this.state.email}
                                           onChange={this.onCodeChange.bind(this)}/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary"
                                            onClick={this.closeDialog.bind(this)}>Close
                                    </button>
                                    <button type="submit" className="btn submit-btn">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {
                    this.state.showDialog &&
                    <div className="modal-backdrop fade show"></div>
                }
            </Page>
        )

    }
}