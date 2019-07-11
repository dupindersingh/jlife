import React from 'react'
import './dashboard.css'
import FirebaseAuth from '../misc/FirebaseAuth'

const Dashboard = () => (
    <div className="page-div">
        <FirebaseAuth>
            {({ isLoading, error, auth }) => {
                if (auth) {
                    return <h1>Dashboard</h1>
                }
                return null
            }}
        </FirebaseAuth>
    </div>
)

export default Dashboard