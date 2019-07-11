// the main file in our front-end app
// create-react-app expects a file in src/index.js and loads everything from here

import Firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
// import firebaseui from 'firebaseui'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import './styles/customize.css';
import App from './views/App'

console.log('create-react-app env:', process.env.NODE_ENV);
console.log('journeylife project:', process.env.REACT_APP_ENV);

// connect our app to firebase 
const dbConfig = {
    apiKey: "AIzaSyCR2fjS586ptRkYV--N9IRTjGg4LNbnvlM",
    authDomain: "journeylife-f713b.firebaseapp.com",
    databaseURL: "https://journeylife-f713b.firebaseio.com",
    projectId: "journeylife-f713b",
    storageBucket: "journeylife-f713b.appspot.com",
    messagingSenderId: "745376612165",
    appId: "1:745376612165:web:43b91b03b8defe08"
};

Firebase.initializeApp(dbConfig)

// temporary config to squash error date warning
// TODO - remove once this is the firebase default behavior
// https://firebase.google.com/docs/reference/js/firebase.firestore.Settings#~timestampsInSnapshots
Firebase.firestore().settings({timestampsInSnapshots: true})

// Google Analytics
// https://github.com/react-ga/react-ga#api
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID)

// render the App component to our document root with React
ReactDOM.render(<App />, document.getElementById('root'))
