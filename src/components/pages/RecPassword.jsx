import React from 'react'
import NavBar from '../NavBar/NavBar'
import BtnFlotanteWp from '../Button/BtnFlotanteWp/BtnFlotanteWp'
import Footer from '../Footer/Footer'

function RecPassword() {
  return (
    <div>
      <NavBar/>
      <div className="contenedor-btnFlotanteWsp">
        <BtnFlotanteWp
          NroCelular={'3814653130'}
        />
      </div> 
      <Footer/>
    </div>
  )
}

export default RecPassword
