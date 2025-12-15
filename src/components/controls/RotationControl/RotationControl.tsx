import { FC, useState, useEffect, useRef } from 'react'
import cl from './RotationControl.module.scss'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'

interface RotationControlProps {
  onClick?: () => void
}

// noinspection JSUnusedLocalSymbols
const RotationControl: FC<RotationControlProps> = ({ onClick }) => {
  const rotationAngle = useAppStore((state) => state.rotationAngle)
  const [inputValue, setInputValue] = useState(String(rotationAngle))
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(rotationAngle))
    }
  }, [rotationAngle, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    const numValue = parseInt(inputValue, 10)
    if (!isNaN(numValue)) {
      // Нормализуем угол в диапазон 0-360
      const normalizedAngle = ((numValue % 360) + 360) % 360
      appStore().setRotationAngle(normalizedAngle)
      setInputValue(String(normalizedAngle))
    } else {
      setInputValue(String(rotationAngle))
    }
  }

  const handleInputFocus = () => {
    setIsEditing(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    }
  }

  return (
    <div className={cl.rotationControl}>
      <div className={cl.rotationInputWrapper}>
        <input
          ref={inputRef}
          type="number"
          className={cl.rotationInput}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          min="0"
          max="360"
          step="1"
        />
        <span className={cl.rotationUnit}>°</span>
      </div>
    </div>
  )
}

export default RotationControl

