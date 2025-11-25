import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import IconButton from '../../components/buttons/IconButton/IconButton'
import Button from '../../components/buttons/LargeButton/Button'
import { Color } from '../../constants/enums'
import { IconLink } from '../../constants/IconLink'
import { useReviewStore } from '../../store/reviewStore'
import { appStore } from '../../store/useAppStore'
import { useDataStore } from '../../store/useDataStore'
import { userStore } from '../../store/useUserStore'
import cl from './ReportPage.module.scss'

const ReportPage: React.FC = () => {
  const [problemType, setProblemType] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFloor, setSelectedFloor] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const navigate = useNavigate()

  const corpuses = useDataStore((state) => state.corpuses)
  const plans = useDataStore((state) => state.plans)

  const isLoading = corpuses.length === 0 || plans.length === 0

  const buildings = useMemo(() => [...new Set(corpuses.map((corpus) => corpus.title.trim()))], [corpuses])

  const filteredFloors = useMemo(() => {
    if (!selectedBuilding) return []
    const floors = plans
      .filter((plan) => plan.corpus.title === selectedBuilding)
      .map((plan) => plan.floor.toString())
    return [...new Set(floors)]
  }, [plans, selectedBuilding])

  const { isSending, succeeded, error, sendReview, reset } = useReviewStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = userStore().userId
    if (!userId) {
      appStore().toast.showForTime('Нет user_id, попробуйте перезагрузить страницу')
      return
    }
    if (!problemType || !description || (problemType === 'plan' && (!selectedBuilding || !selectedFloor))) {
      appStore().toast.showForTime('Заполните все обязательные поля')
      return
    }
    let text = description
    if (problemType === 'plan') {
      text += ` (Корпус: ${selectedBuilding}, Этаж: ${selectedFloor})`
    }
    await sendReview({
      image,
      user_id: userId,
      problem: problemType,
      text,
    })
  }

  useEffect(() => {
    if (succeeded) {
      appStore().toast.showForTime('Проблема успешно отправлена!')
      setProblemType('')
      setDescription('')
      setSelectedBuilding('')
      setSelectedFloor('')
      setImage(null)
      reset()
    }
  }, [succeeded, reset])

  if (isLoading) return <div className={cl.reportPage}>Загрузка данных...</div>

  return (
    <div className={cl.reportPage}>
      <div className={cl.header}>
        <button onClick={() => navigate(-1)} className={cl.backButton}>
          <IconButton iconLink={IconLink.BACK} color={Color.C4} />
          <span>Назад</span>
        </button>
      </div>
      <h1>Сообщить о проблеме</h1>
      <form className={cl.form} encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className={cl.formGroup}>
          <label>В чем проблема?</label>
          <select value={problemType} onChange={(e) => setProblemType(e.target.value)} required>
            <option value="">Выберите тип проблемы</option>
            <option value="plan">Неточность на плане</option>
            <option value="work">Работа приложения</option>
            <option value="way">Неправильный маршрут</option>
            <option value="other">Другое</option>
          </select>
        </div>
        {problemType === 'plan' && (
          <>
            <div className={cl.formGroup}>
              <label>Корпус</label>
              <select value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)} required>
                <option value="">Выберите корпус</option>
                {buildings.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className={cl.formGroup}>
              <label>Этаж</label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                required
                disabled={!selectedBuilding || filteredFloors.length === 0}
              >
                <option value="">Выберите этаж</option>
                {filteredFloors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className={cl.formGroup}>
          <label>Опишите проблему</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Введите описание проблемы..."
            required
          />
        </div>
        <div className={cl.formGroup}>
          <label>Фото (необязательно)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>
        <div className={cl.actions}>
          <Button
            color={Color.BLUE}
            text={isSending ? 'Отправка...' : 'Отправить'}
            disabled={isSending}
            type="submit"
          />
        </div>
        {error && <div className={cl.error}>Ошибка: {error}</div>}
      </form>
    </div>
  )
}

export default ReportPage
