import Firebase from 'firebase/app'
import ReactGA from 'react-ga'

const logInEmail = () => {
  ReactGA.event({
    category: 'User',
    action: 'Log in',
  });

  let email = document.getElementById('loginEmail').value;
  let password = document.getElementById('loginPassword').value;
  const loginButton = document.getElementById('loginButton');
  const loginError = document.getElementById('loginError');
  // code to check only users are loggedin not admins...
  let users = [];
  let userAlreadyExist = false;
  Firebase.firestore().collection("users").where("role", "==", "admin")
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }
        snapshot.forEach(doc => {
          // console.log(doc.id, 'role==user', doc.data());
          const document = Firebase.firestore().collection("users").doc(doc.id).get();
          document.then((doc) => {
            if (doc) {
              if (doc.data().email === email) {
                return Firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(async function (user) {
                      if (!user.displayName) {
                        const userDoc = await Firebase.firestore().collection("users").doc(user.email).get();
                        user.updateProfile({
                          displayName: (userDoc.data().firstName + " " + userDoc.data().lastName)
                        })
                      }

                    })
                    .then(function () {
                      window.location.replace('./menu');
                    })
                    .catch(function (error) {
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      console.log('Error code: ' + errorCode);
                      console.log('Error message: ' + errorMessage);
                      if (!!loginButton && !!loginError) {
                        loginButton.style.display = 'block';
                        loginError.innerText = errorMessage;
                        loginError.style.display = 'block';
                      }
                    });
              }
            }
          })
        });
        var errorCode = "Email doesn't exist";
        var errorMessage = "Email doesn't exist";
        console.log('Error code: ' + errorCode);
        console.log('Error message: ' + errorMessage);
        if (!!loginButton && !!loginError) {
          loginButton.style.display = 'block';
          loginError.innerText = errorMessage;
          loginError.style.display = 'block';
        }
      })
};

export default logInEmail
