import React from 'react'
import Firebase from 'firebase/app'
import {Page,} from '../../styles/layout'
import './signup.css'
import ReactGA from "react-ga";

let thi = this;

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showDialog: false,
            confirmResult: {},
            code: "",

            firstName: "",
            lastName: "",
            company: "",
            final_password: "",
            phoneNumber: "",
            email: "",
            password: ""
        }
    }

    componentDidMount() {
        document.getElementsByName("firstName")[0].focus();
        window.recaptchaVerifier = new Firebase.auth.RecaptchaVerifier("recaptcha-verifier",
            {
                // type: 'image', // another option is 'audio'
                size: 'invisible', // other options are 'normal' or 'compact'
                // badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
                'callback': function (response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    console.log("captacha solved");
                    // window.recaptchaVerifier.render();
                    // thi.phoneLogin();
                },
                'expired-callback': function () {
                    console.log("expired captacha !! Please solve again");
                    window.recaptchaVerifier.render().then(widgetId => {
                        window.recaptchaVerifier.reset(widgetId);
                    });
                }
            })
    }

    phoneLogin(e) {
        e.preventDefault();
        this.setState({
            final_password: this.state.password
        });
        if (e.target.checkValidity()) {
            const validElms = document.querySelectorAll(".signupFormUser .form-group input:valid");
            for (let i = 0; i < validElms.length; i++) {
                validElms[i].parentElement.classList.remove("has-error");
            }
            // window.recaptchaVerifier.render().then(widgetId => {
            //     window.recaptchaVerifier.clear();
            // })
            const thi = this;
            const phoneNumber = "+" + thi.state.phoneNumber;
            const appVerifier = window.recaptchaVerifier;
            const signupButton = document.getElementById('recaptcha');
            const signupError = document.getElementById('signupError');
            // signupButton.setAttribute("data-toggle", "modal");
            // signupButton.setAttribute("data-target", "#dialogBox");
            //on closing the dialog box remove the attributes....

            // check if this phone number already exist in database.
            // if yes than error "already registered" else move further...
            this.setState({
                isLoading: true
            });
            Firebase.firestore().collection("users").where("phoneNumber", "==", phoneNumber).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        document.getElementById("dialogBox").style.display = "block";
                        document.getElementById("dialogBox").classList.add("in");
                        thi.setState({
                            showDialog: true,
                            code: ""
                        });
                        Firebase
                            .auth()
                            .signInWithPhoneNumber(phoneNumber, appVerifier)
                            .then(confirmResult => {
                                thi.setState({
                                    confirmResult,
                                    isLoading: false
                                });
                                console.log(confirmResult, "confirm esul...");
                            })
                            .catch(error => {
                                this.setState({
                                    isLoading: false
                                })
                                window.recaptchaVerifier.render().then(widgetId => {
                                    window.recaptchaVerifier.reset(widgetId);
                                });
                                if (error.message !== "An internal error has occurred.") {
                                    thi.setState({
                                        showDialog: false,
                                        confirmResult: thi.state.confirmResult,
                                        code: ""
                                    });

                                    document.getElementById("dialogBox").style.display = "none";
                                    document.getElementById("dialogBox").classList.remove("in");
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    console.log('Error code: ' + errorCode);
                                    console.log('Error message: ' + errorMessage);
                                    if (!!signupButton && !!signupError) {
                                        signupButton.style.display = 'block';
                                        signupError.innerText = errorMessage;
                                        signupError.style.display = 'block';
                                    }
                                }
                            })
                    } else {
                        this.setState({
                            isLoading: false
                        });
                        window.recaptchaVerifier.render().then(widgetId => {
                            window.recaptchaVerifier.reset(widgetId);
                        });
                        // signupButton.removeAttribute("data-toggle");
                        // signupButton.removeAttribute("data-target");
                        document.getElementById("dialogBox").style.display = "none";
                        document.getElementById("dialogBox").classList.remove("in");
                        thi.setState({
                            showDialog: false,
                            confirmResult: thi.state.confirmResult,
                            code: ""
                        });
                        var errorMessage = "This PhoneNumber is already registered!!";
                        if (!!signupButton && !!signupError) {
                            signupButton.style.display = 'block';
                            signupError.innerText = errorMessage;
                            signupError.style.display = 'block';
                        }
                    }
                })
        } else {
            const invalidElms = document.querySelectorAll(".signupFormUser .form-group input:invalid");
            for (let i = 0; i < invalidElms.length; i++) {
                invalidElms[i].parentElement.classList.add("has-error");
            }
            const validElms = document.querySelectorAll(".signupFormUser .form-group input:valid");
            for (let i = 0; i < validElms.length; i++) {
                validElms[i].parentElement.classList.remove("has-error");
            }
        }
    }

    onCodeChange(e) {
        const target = e.target;
        // check for required true and false on required "false" inputs...........
        if (target.name === "firstName" || target.name === "lastName" || target.name === "company") {
            if (target.value === "") {
                target.required = false
            } else {
                target.required = true
            }
        }
        this.setState({
            [target.name]: target.value
        })
    }

    submitVerificationCode(e) {
        e.preventDefault();
        document.getElementsByName("code")[0].focus();
        if (e.target.checkValidity()) {
            const validElms = document.querySelectorAll(".verify-otp-form .form-group input:valid");
            for (let i = 0; i < validElms.length; i++) {
                validElms[i].parentElement.classList.remove("has-error");
            }
            const thi = this;
            console.log(this.state.code, "code", this.state.email, "email..");
            const signupButton = document.getElementById('recaptcha');
            const signupError = document.getElementById('signupError');

            if (!!thi.state.email) {
                ReactGA.event({
                    category: 'User',
                    action: 'Sign Up',
                });

                let email = thi.state.email;
                let password = thi.state.password;
                let firstName = thi.state.firstName;
                let lastName = thi.state.lastName;
                let company = thi.state.company;
                email = email.toLowerCase();
                thi.setState({
                    isLoading: true
                });
                return Firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function () {
                        Firebase.auth().currentUser.updateProfile({
                            displayName: firstName + " " + lastName
                        })
                    })
                    .then(async function () {
                        if (!!thi.state.code) {
                            // start registering the user..
                            // Add a new document in collection "users"
                            let member = "", employee = [];
                            email = email.toLowerCase();
                            Firebase.firestore().collection("users").doc(email).set({
                                email: email,
                                firstName,
                                lastName,
                                company,
                                phoneNumber: "+" + thi.state.phoneNumber,
                                verification_code: thi.state.code,
                                isAdmin: false,
                                role: "user"
                            });
                            const team = Firebase.firestore().collection("teams").doc("team1").get();
                            team.then((detail) => {
                                if (detail) {
                                    member = detail.data().member;
                                    employee = detail.data().employee;
                                    employee.push({
                                        email: email,
                                        firstName,
                                        lastName,
                                        company,
                                        phoneNumber: "+" + thi.state.phoneNumber,
                                        verification_code: thi.state.code,
                                        isAdmin: false,
                                        role: "user"
                                    });
                                } else {
                                    window.recaptchaVerifier.render().then(widgetId => {
                                        window.recaptchaVerifier.reset(widgetId);
                                    });
                                    // signupButton.removeAttribute("data-toggle");
                                    // signupButton.removeAttribute("data-target");
                                    document.getElementById("dialogBox").style.display = "none";
                                    document.getElementById("dialogBox").classList.remove("in");
                                    thi.setState({
                                        showDialog: false,
                                        confirmResult: thi.state.confirmResult,
                                        code: ""
                                    });
                                    var errorCode = "no document found.";
                                    var errorMessage = "no document found.";
                                    console.log('Error code: ' + errorCode);
                                    console.log('Error message: ' + errorMessage);
                                    if (!!signupButton && !!signupError) {
                                        signupButton.style.display = 'block';
                                        signupError.innerText = errorMessage;
                                        signupError.style.display = 'block';
                                    }
                                    return
                                }
                            }).then(() => {
                                console.log(member, "member", employee, "emplooye....");
                                Firebase.firestore().collection("teams").doc("team1").update({
                                    member,
                                    employee
                                })
                                    .then(function () {
                                        thi.setState({isLoading: false})
                                        console.log("Document successfully written!");
                                        thi.props.history.push('/menu');
                                    })
                                    .catch(function (error) {
                                        console.error("Error writing document: ", error);
                                        window.recaptchaVerifier.render().then(widgetId => {
                                            window.recaptchaVerifier.reset(widgetId);
                                        });
                                        // signupButton.removeAttribute("data-toggle");
                                        // signupButton.removeAttribute("data-target");
                                        document.getElementById("dialogBox").style.display = "none";
                                        document.getElementById("dialogBox").classList.remove("in");
                                        thi.setState({
                                            isLoading: false,
                                            showDialog: false,
                                            confirmResult: thi.state.confirmResult,
                                            code: ""
                                        });
                                        var errorMessage = "error writing document";
                                        if (!!signupButton && !!signupError) {
                                            signupButton.style.display = 'block';
                                            signupError.innerText = errorMessage;
                                            signupError.style.display = 'block';
                                        }
                                    });
                            })
                                .catch(function (error) {
                                    window.recaptchaVerifier.render().then(widgetId => {
                                        window.recaptchaVerifier.reset(widgetId);
                                    });
                                    // signupButton.removeAttribute("data-toggle");
                                    // signupButton.removeAttribute("data-target");
                                    document.getElementById("dialogBox").style.display = "none";
                                    document.getElementById("dialogBox").classList.remove("in");
                                    thi.setState({
                                        isLoading: false,
                                        showDialog: false,
                                        confirmResult: thi.state.confirmResult,
                                        code: ""
                                    });
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

                            // end registering the user...
                        } else {
                            // signupButton.removeAttribute("data-toggle");
                            // signupButton.removeAttribute("data-target");
                            document.getElementById("dialogBox").style.display = "none";
                            document.getElementById("dialogBox").classList.remove("in");
                            thi.setState({
                                isLoading: false,
                                showDialog: false,
                                confirmResult: thi.state.confirmResult,
                                code: ""
                            });
                            window.recaptchaVerifier.render().then(widgetId => {
                                window.recaptchaVerifier.reset(widgetId);
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
                        // signupButton.removeAttribute("data-toggle");
                        // signupButton.removeAttribute("data-target");
                        document.getElementById("dialogBox").style.display = "none";
                        document.getElementById("dialogBox").classList.remove("in");
                        thi.setState({
                            isLoading: false,
                            showDialog: false,
                            confirmResult: thi.state.confirmResult,
                            code: ""
                        });
                        window.recaptchaVerifier.render().then(widgetId => {
                            window.recaptchaVerifier.reset(widgetId);
                        });
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log('Error code: ' + errorCode);
                        console.log('Error message: ' + errorMessage);
                        document.getElementById('recaptcha').style.display = 'block';
                        document.getElementById('signupError').innerText = errorMessage;
                        document.getElementById('signupError').style.display = 'block';

                    });
            } else {
                // signupButton.removeAttribute("data-toggle");
                // signupButton.removeAttribute("data-target");
                document.getElementById("dialogBox").style.display = "none";
                document.getElementById("dialogBox").classList.remove("in");
                thi.setState({
                    showDialog: false,
                    confirmResult: thi.state.confirmResult,
                    code: ""
                });
                window.recaptchaVerifier.render().then(widgetId => {
                    window.recaptchaVerifier.reset(widgetId);
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
        } else {
            const invalidElms = document.querySelectorAll(".verify-otp-form .form-group input:invalid");
            for (let i = 0; i < invalidElms.length; i++) {
                invalidElms[i].parentElement.classList.add("has-error");
            }
            const validElms = document.querySelectorAll(".verify-otp-form .form-group input:valid");
            for (let i = 0; i < validElms.length; i++) {
                validElms[i].parentElement.classList.remove("has-error");
            }
        }

    }

    closeDialog() {
        const signupButton = document.getElementById('recaptcha');
        const signupError = document.getElementById('signupError');
        const thi = this;
        var errorCode = "Process closed by user.";
        var errorMessage = "Process closed by user.";
        console.log('Error code: ' + errorCode);
        console.log('Error message: ' + errorMessage);
        if (!!signupButton && !!signupError) {
            signupButton.style.display = 'block';
            signupError.innerText = errorMessage;
            signupError.style.display = 'block';
        }
        // signupButton.removeAttribute("data-toggle");
        // signupButton.removeAttribute("data-target");
        document.getElementById("dialogBox").style.display = "none";
        document.getElementById("dialogBox").classList.remove("in");
        thi.setState({
            showDialog: false,
            confirmResult: thi.state.confirmResult,
            code: ""
        });
        // window.recaptchaVerifier.clear();
        window.recaptchaVerifier.render().then(widgetId => {
            window.recaptchaVerifier.reset(widgetId);
        });
    }

    render() {
        return (
            <Page className="signup-page">
                {
                    this.state.isLoading &&
                    <img src={require("../../media/loadingIcon.gif")} style={{width: 100, height: 100}}
                         alt={"loading-icon"}/>
                }
                <div>
                    <div className="signup-container">
                        <h1 className="signup-header">Sign Up</h1>
                        <div id="signupForm" className="signup-form">
                            <div id="recaptcha-verifier"></div>
                            <form id="signupFormUser" onSubmit={this.phoneLogin.bind(this)}
                                  className="signupFormUser"
                                  name="signupForm"
                                  data-name="signupForm" noValidate={true}>
                                <div id="signupForm" className="signup-phone">
                                    <div className="form-group">
                                        <input type="text" style={{width: "100%"}} name="firstName"
                                               className="signup-input"
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([0-9a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               placeholder={"Enter FirstName"}
                                               required={false}
                                               value={this.state.firstName}
                                               onChange={this.onCodeChange.bind(this)}/>
                                        <p className="with-error">Please enter valid FirstName.</p>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" style={{width: "100%"}} name="lastName"
                                               className="signup-input"
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([0-9a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               placeholder={"Enter LastName"}
                                               required={false}
                                               value={this.state.lastName}
                                               onChange={this.onCodeChange.bind(this)}/>
                                        <p className="with-error">Please enter valid LastName.</p>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" style={{width: "100%"}} name="company"
                                               className="signup-input"
                                               minLength={3}
                                               maxLength={50}
                                               pattern={"^[^-\\s]([0-9a-zA-Z]+\\s)*[a-zA-Z]{2,}$"}
                                               placeholder={"Enter Company Name"}
                                               required={false}
                                               value={this.state.company}
                                               onChange={this.onCodeChange.bind(this)}/>
                                        <p className="with-error">Please enter valid Company Name.</p>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="signup-input" style={{width: "100%"}}
                                               name="phoneNumber"
                                               pattern="[0-9]{10, 20}"
                                               data-name="signup Password"
                                               placeholder="e.g. 18782050088" id="signupPassword"
                                               required={true}
                                               onChange={this.onCodeChange.bind(this)}/>
                                        <p className="with-error">Please enter valid PhoneNumber.</p>
                                    </div>
                                    <div className="form-group">
                                        <input type="email" style={{width: "100%"}} name="email"
                                               className="signup-input"
                                               placeholder={"Enter EmailAddress"}
                                               required={true}
                                               value={this.state.email}
                                               onChange={this.onCodeChange.bind(this)}/>
                                        <p className="with-error">Please enter valid EmailAddress.</p>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" style={{width: "100%"}} name="password"
                                               className="signup-input"
                                               placeholder={"Enter Password"}
                                               pattern={"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"}
                                               maxLength={32}
                                               required={true}
                                               value={this.state.password}
                                               onChange={this.onCodeChange.bind(this)}/>
                                        <p className="with-error" style={{color: "unset"}}>Enter your password (<span
                                            style={{color: `${this.state.final_password.length >= 8 ? "green" : "red"}`}}>Min 8 characters</span>, <span
                                            style={{color: `${this.state.final_password.match("(?=.*?[A-Z])") ? "green" : "red"}`}}>at least one uppercase letter</span>, <span
                                            style={{color: `${this.state.final_password.match("(?=.*?[a-z])") ? "green" : "red"}`}}>one lowercase letter</span>, <span
                                            style={{color: `${this.state.final_password.match("(?=.*?[0-9])") ? "green" : "red"}`}}>one number and </span>
                                            <span
                                                style={{color: `${this.state.final_password.match("(?=.*?[#?!@$%^&*-])") ? "green" : "red"}`}}>one special character required</span>).
                                        </p>
                                    </div>
                                    <button id="recaptcha" type={"submit"}
                                            className="submit-button">Signup
                                    </button>
                                </div>
                            </form>
                        </div>
                        <p id="signupError" className="error-message">Error message</p>
                        <a href="./" className="link">Already have an account?</a></div>
                    <form id="verifyCodeForm" onSubmit={this.submitVerificationCode.bind(this)}
                          className="verify-otp-form"
                          noValidate={true}>
                        <div className="modal" id="dialogBox" tabIndex="-1" role="dialog"
                             aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title"
                                            id="exampleModalCenterTitle"> Please enter the code sent to your
                                            phone
                                            number.</h5>
                                    </div>
                                    <div className="code">
                                        <div className="form-group">
                                            <input type="text" placeholder={"Enter OTP"} pattern="[0-9]{6,6}"
                                                   style={{width: "100%"}} name="code"
                                                   value={this.state.code}
                                                   required={true}
                                                   onChange={this.onCodeChange.bind(this)}/>
                                            <p className="with-error">Please enter valid OTP.</p>
                                        </div>
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
                </div>
            </Page>
        )

    }
}
