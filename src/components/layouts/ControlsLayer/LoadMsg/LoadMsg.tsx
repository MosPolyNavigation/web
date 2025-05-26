import { useEffect, useState } from 'react'
import cl from './LoadMsg.module.scss'
import classNames from 'classnames'

const LoadMsg = () => {
  const [dotsCount, setDotsCount] = useState(0)

  useEffect(() => {
    function updateCount() {
      setDotsCount((dots) => (dots < 3 ? dots + 1 : 0))
    }

    const interval = setInterval(updateCount, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      Загрузка
      <span className={classNames(cl.dot, { [cl.hidden]: dotsCount < 1 })}>.</span>
      <span className={classNames(cl.dot, { [cl.hidden]: dotsCount < 2 })}>.</span>
      <span className={classNames(cl.dot, { [cl.hidden]: dotsCount < 3 })}>.</span>
    </>
  )
}

export default LoadMsg
