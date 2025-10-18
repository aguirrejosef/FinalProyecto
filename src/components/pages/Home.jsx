import React from 'react'
import '../pages/Home.css'
import NavBar from '../NavBar/NavBar'
import Slider from '../Slider/Slider'
import Titulo from '../Titulo/Titulo'
import Cards from '../Cards/Cards'
import BtnFlotanteWp from '../Button/BtnFlotanteWp/BtnFlotanteWp'
import Footer from '../Footer/Footer'
import { useNavigate } from 'react-router-dom'

function Home() {

  const navigate = useNavigate();

  return (
    <div>
      <NavBar/>
      <Slider/>
      <Titulo
        title={'Clubes mas visitados'}
      />
      <Cards/>
      <div className="ver-canchas">
        <button className='btn-ver-canchas' onClick={() => navigate("/canchas")}>Ver todas las canchas</button>
      </div>
      <div className="contenedor-btnFlotanteWsp">
        <BtnFlotanteWp
          NroCelular={'3814653130'}
        />
      </div>  
      <Footer/>
    </div>
  )
}

export default Home
