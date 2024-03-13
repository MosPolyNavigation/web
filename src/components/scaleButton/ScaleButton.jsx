import React from 'react'

import minusIcon from '../../images/minusIcon.svg'
import plusIcon from '../../images/plusIcon.svg'

const ScaleButton = () => {
  return (
    <div className='scaleButton_packet'>
        <button className='scaleButton_button'>
            <img src={plusIcon} alt="plus" />
        </button>
        <button className='scaleButton_button'>
            <img src={minusIcon} alt="minus" />
        </button>
    </div>
  )
}

export default ScaleButton