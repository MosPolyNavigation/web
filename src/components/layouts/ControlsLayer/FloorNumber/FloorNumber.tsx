import { FC, useEffect, useState } from 'react'
import cl from './FloorNumber.module.scss'
import classNames from 'classnames'
import { useAppStore } from '../../../../store/useAppStore.ts'

//Компонент для верхней части экрана с анимированной сменой номера этажа

const FloorNumber: FC = () => {
  const currentPlan = useAppStore((state) => state.currentPlan)
  const [baseFloor, setBaseFloor] = useState(-2)
  const [newFloor, setNewFloor] = useState(-2)
  const [upOrDown, setUpOrDown] = useState('none')

  useEffect(() => {
    if (currentPlan) {
      if (baseFloor == -2) {
        setBaseFloor(currentPlan.floor)
      } else {
        setNewFloor(currentPlan.floor)
        if (currentPlan.floor > baseFloor) {
          console.log('Выше')
          setUpOrDown('up')
        } else if (currentPlan.floor < baseFloor) {
          console.log('Ниже')
          setUpOrDown('down')
        }
      }
    }
  }, [currentPlan])

  useEffect(() => {
    console.log(upOrDown)
  }, [upOrDown])

  const animationEndHandler = (e) => {
    if (currentPlan) {
      setBaseFloor(currentPlan.floor)
      setUpOrDown('none')
    }
  }

  return (
    <div className={cl.floorNumber}>
      &ensp;
      <div
        className={classNames(cl.floorBox, cl.new, {
          [cl.toUp]: upOrDown === 'up',
          [cl.toDown]: upOrDown === 'down',
        })}
      >
        {newFloor}
      </div>
      <div
        onAnimationEnd={animationEndHandler}
        className={classNames(cl.floorBox, cl.base, {
          [cl.toUp]: upOrDown === 'down',
          [cl.toDown]: upOrDown === 'up',
        })}
      >
        {baseFloor}
      </div>
    </div>
  )
}

export default FloorNumber
