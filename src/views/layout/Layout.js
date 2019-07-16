// this Layout component wraps every page with the app header on top
// check out App.js to see how it's used

import React from 'react'
import firebase from 'firebase'
import Intercom from 'react-intercom'
import FirebaseAuth from '../misc/FirebaseAuth'
import {
  HeaderFooterWrapper,
} from '../../styles/layout'
import './HeaderStyles.css'
import {
  HeaderLink,
} from '../../styles/links'
import {
  Redirect,
} from "react-router-dom";

function setCurrent() {
  document.addEventListener("DOMContentLoaded", function () {
    let links = document.getElementsByClassName('menu-item');
    let current = document.getElementsByClassName("menu-item w-current");
    if (current) {
      current.className = "menu-item";
    }
    for (let i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].href) {
        this.className += " w-current";
        return;
      }
    }
  })
}

async function userInfo() {
  let info = {}
  firebase.auth().onAuthStateChanged(function(user) {
    info["email"] = user.email;
    info["name"] = user.displayName
  })
  return info;
}

// async function checkAdminStatus() {
//   console.log('reached')
//   const userDoc = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get()
//   const company = userDoc.data().company;
//   const companyInfo = await firebase.firestore().collection("/companies").doc(`${company}`).get();
//   const admins = companyInfo.data().admins;
//   console.log(admins.includes(firebase.auth().currentUser.email));
//   if (admins.includes(firebase.auth().currentUser.email)) {
//     return true
//   } else {
//     return false
//   }
// }

const Layout = ({ children }) => (
  <HeaderFooterWrapper>
    <FirebaseAuth>
      {({ isLoading, error, auth }) => {
        if (isLoading) {
          return null
        }
        if (error) {
          return '⚠️ login error'
        }
        if (auth) {
          if (window.location.pathname === "/") {
            return <Redirect to={{ pathname: "/employees" }} />
          } else {
            return [
              <div className="header" key="header">
                <div className="headerNav">
                  <HeaderLink to="/" className="navTitle w-nav">JourneyLIFE Admin</HeaderLink>
                  <div className="navBar">
                    <HeaderLink to={`/members`} className="nav-link">
                      <img src={require("../../media/members.svg")} className="navIcon" alt={'members icon'} />
                    </HeaderLink>
                    <HeaderLink to={`/teams`} className="nav-link">
                      <img src={require(`../../media/team.svg`)} className="navIcon" alt={'teams icon'} />
                    </HeaderLink>
                    <HeaderLink to={`/account`} className="nav-link">
                      <img src={require(`../../media/accountIcon.png`)} className="navIcon" alt={'account icon'} />
                    </HeaderLink>
                  </div>
                </div>
              </div>,
              <div className="large-page-div" key="page">
                <div className="menu-div">
                  <a href="/dashboard" className="menu-item" style={{display: 'none'}}>
                    <div className="menu-title">Dashboard</div><img src={require('../../media/dashboardIcon.png')} sizes="40px" alt="" className="menu-icon" /></a>
                  <a href="/analytics" className="menu-item" style={{display: 'none'}}>
                    <div className="menu-title">Analytics</div><img src={require('../../media/chartIcon.png')} sizes="40px" alt="" className="menu-icon" /></a>
                  <a href="/pulses" className="menu-item">
                    <div className="menu-title">Pulses</div><img src={require('../../media/pulseIcon.png')} alt="" className="menu-icon" /></a>
                  <a href="/employees" className="menu-item">
                    <div className="menu-title">Employees</div><img src={require('../../media/employeesIcon.png')} alt="" className="menu-icon" /></a>
                  <a href="/development" className="menu-item" style={{display: 'none'}}>
                    <div className="menu-title">Development<br />Plans</div><img src={require('../../media/developmentIcon.jpg')} sizes="40px" alt="" className="menu-icon" /></a>
                  <a href="/billing" className="menu-item" style={{display: 'none'}}>
                    <div className="menu-title">Billing</div><img src={require('../../media/billingIcon.png')} sizes="40px" alt="" className="menu-icon" /></a>
                  <a href="/settings" className="menu-item">
                    <div className="menu-title">Settings</div><img src={require('../../media/settingsIcon.png')} alt="" className="menu-icon" /></a>
                </div>
                {/* {setCurrent()} */}
                {children}
              </div>
            ]
          }
        } else if (window.location.pathname === "/signup" || window.location.pathname === "/reset-password") {
          return [<div className="header" key="header">
            <div className="headerNav">
              <HeaderLink to="/" className="navTitle w-nav">JourneyLIFE Admin</HeaderLink>
            </div>
          </div>,
          <div key="page">
            {children}
          </div>
          ]
        } else if (window.location.pathname !== "/") {
          return <Redirect to={{ pathname: "/" }} />
        } else {
          return [<div className="header" key="header">
            <div className="headerNav">
              <HeaderLink to="/" className="navTitle w-nav">JourneyLIFE Admin</HeaderLink>
            </div>
          </div>,
          <div key="children">
            {children}
          </div>
          ]
        }
      }}
    </FirebaseAuth>
    <Intercom appID="mh0y5kvx" {...userInfo}/>
  </HeaderFooterWrapper >
)

export default Layout
