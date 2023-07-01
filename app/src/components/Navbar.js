import React from 'react'
import '../css/navbar.css'
import logo from '../images/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid flex center">
            <a className="navbar-brand" href="/"><img src={logo} alt="GPTz"/></a>
        </div>
    </nav>
  )
}

export default Navbar
