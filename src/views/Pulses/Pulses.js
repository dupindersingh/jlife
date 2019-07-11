import React, { Component } from 'react'
import './pulses.css'
import PulseTable from './PulseTable';




class Pulses extends Component {
    render() {
        return (
            <div className="page-div" >
                <div className="page-header">
                    <h2 className="page-heading">Pulses</h2>
                    <div className="search-and-add" style={{display: 'none'}}>
                        <button className="add-button w-button">New Pulse</button>
                    </div>
                </div>
                
                <PulseTable/>
            </div >
        )
    }
}

export default Pulses