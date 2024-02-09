import React from 'react'

export default function Hero({image}) {
  return (
    <div 
      className='relative bg-cover bg-center h-[450px] object-fill'  
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="container mx-auto px-4">
        {/* Content goes here */}
      </div>
    </div>
  )
}