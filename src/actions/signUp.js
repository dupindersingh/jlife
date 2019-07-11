import Firebase from 'firebase/app'
import ReactGA from 'react-ga'

const signUp = () => {
    ReactGA.event({
        category: 'User',
        action: 'Sign Up',
    });

    document.getElementById('signupButton').style.display = 'none';
    document.getElementById('signupError').style.display = 'none';
    let email = document.getElementById('signupEmail').value.toLowerCase();
    let password = document.getElementById('signupPassword').value;
    return Firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async function () {
            // Add a new document in collection "users"
            email = email.toLowerCase();
            Firebase.firestore().collection("users").doc(email.toLowerCase()).set({
                email: email,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                company: document.getElementById('company').value,
                role: "admin"
            })
                .then(function () {
                    console.log("Document successfully written!");
                    window.location.replace('./menu');
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error code: ' + errorCode);
            console.log('Error message: ' + errorMessage);
            document.getElementById('signupButton').style.display = 'block';
            document.getElementById('signupError').innerText = errorMessage;
            document.getElementById('signupError').style.display = 'block';
        });
}

export default signUp
