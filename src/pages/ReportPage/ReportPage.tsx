import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/buttons/LargeButton/Button'
import { Color } from '../../constants/enums'
import { IconLink } from '../../constants/IconLink'
import { useReviewStore } from '../../store/reviewStore'
import { appStore } from '../../store/useAppStore'
import { useDataStore } from '../../store/useDataStore'
import { userStore } from '../../store/useUserStore'
import cl from './ReportPage.module.scss'
import Icon from '../../components/common/Icon/Icon.tsx'
import { CorpusData, PlanData } from '../../constants/types.ts'
import Toast from '../../components/common/Toast/Toast.tsx'
import IconButton from '../../components/buttons/IconButton/IconButton.tsx'

const ReportPage: React.FC = () => {
  const [problemType, setProblemType] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [selectedCorpus, setSelectedCorpus] = useState<CorpusData | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const navigate = useNavigate()

  const corpuses = useDataStore((state) => state.corpuses)
  const plans = useDataStore((state) => state.plans)

  const isLoading = corpuses.length === 0 || plans.length === 0

  const filteredPlans = selectedCorpus
    ? [...plans.filter((p) => p.corpus === selectedCorpus)].sort((p1, p2) => p1.floor - p2.floor)
    : []

  const { isSending, succeeded, error, sendReview, reset } = useReviewStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = userStore().userId
    if (!userId) {
      appStore().toast.showForTime('Нет user_id, попробуйте перезагрузить страницу', IconLink.SMILE_SAD)
      return
    }
    if (!problemType || !description || (problemType === 'plan' && (!selectedCorpus || !selectedPlan))) {
      appStore().toast.showForTime('Заполните все обязательные поля')
      return
    }
    let text = description
    if (problemType === 'plan') {
      text += ` (Корпус: ${selectedCorpus?.id}, Этаж: ${selectedPlan?.id})`
    }
    await sendReview({
      image,
      user_id: userId,
      problem: problemType,
      text,
    })
    appStore().toast.showForTime('Успешно отправлено. Спасибо за обратную связь!')
    setProblemType('')
    setDescription('')
    setSelectedCorpus(null)
    setSelectedPlan(null)
    setImage(null)
    reset()
  }

  if (isLoading) return <div className={cl.reportPage}>Загрузка данных...</div>

  return (
    <div className={cl.reportPage}>
      <div className={cl.header}>
        <IconButton onClick={() => navigate(-1)} className={cl.backButton} iconLink={IconLink.BACK} />
        <h1 className={cl.pageTitle}>Сообщить о проблеме</h1>
      </div>
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
              <select
                value={selectedCorpus?.id ?? ''}
                onChange={(e) => setSelectedCorpus(corpuses.find((c) => c.id === e.target.value) ?? selectedCorpus)}
                required
              >
                <option value="" disabled style={{ display: 'none' }}>
                  Выберите корпус
                </option>
                {corpuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {`${c.location.short}, корпус ${c.title}`}
                  </option>
                ))}
              </select>
            </div>
            <div className={cl.formGroup}>
              <label>Этаж</label>
              <select
                value={selectedPlan?.id ?? ''}
                onChange={(e) => setSelectedPlan(filteredPlans.find((p) => p.id === e.target.value) ?? selectedPlan)}
                required
                disabled={!selectedCorpus || filteredPlans.length === 0}
              >
                <option value="">Выберите этаж</option>
                {filteredPlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.floor}
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
      <div className={cl.info}>
        Сообщить о проблеме, не связанной с нашим сервисом можно в{' '}
        <a className={cl.qq} href="https://e.mospolytech.ru/#/maintenance" target="_blank">
          Личном кабинете
        </a>
      </div>
      <Toast />
    </div>
  )
}

export default ReportPage
