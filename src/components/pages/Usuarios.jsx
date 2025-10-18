import React from 'react'
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'
import"./Usuarios.css"
import Usuarios from '../CardsUsuarios/CardsUsuarios'

function Usuario() {
  return (
    <div>
        <NavBar/>
        <h1 className="titulo-Usuarios">Listado de Usuarios:</h1>
        <Usuarios/>
        <Footer/>
    </div>
  )
}

export default Usuario