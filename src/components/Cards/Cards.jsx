import React from 'react'
import './Cards.css'
import Card from '../Card/Card'

function Cards() {
  return (
    
        <div className="contenedor-grid-cards">
            <div className="grid-item-card">
                <Card
                imagen={'/imagenes/cards/ITALIA PADEL.jpg'}
                titulo='Italia Padel Club'
                id={"1"}/>
            </div>
            <div className="grid-item-card">
                <Card
                imagen={'/imagenes/cards/MAD PADEL.jpg'}
                titulo='Mad Padel Club'
                id={"2"}/>
            </div>
            <div className="grid-item-card">
                <Card
                imagen={'/imagenes/cards/ALEMANIAPADEL.jpg'}
                titulo="Aleamania Padel Club"
                id={"3"}/>
            </div>
        </div>
    
  )
}

export default Cards
