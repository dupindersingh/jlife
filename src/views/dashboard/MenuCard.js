import React from 'react'


const MenuCard = ({ title, icon, link }) => (
    <a href={link} style={{textDecoration: 'none'}}>
        <div className="menucard">
            <img src={require(`../../media/${icon}.png`)} className="menucard-icon" alt={`${icon}`}/>
            <h1 className="menucard-title">
                {title}
            </h1>
        </div >
    </a>
)

export default MenuCard
