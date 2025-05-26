import { Attributes, FC, useEffect, useRef, useState } from 'react'
import cl from './LocationCard.module.scss'
import classNames from 'classnames'
import Button from '../../buttons/LargeButton/Button.tsx'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { CorpusData, LocationData } from '../../../constants/types.ts'
import { getBottomFloorPlan } from '../../../functions/placesFunctions.ts'
import { Layout } from '../../../constants/enums.ts'

interface LocationCardProps extends Attributes {
  expanded?: boolean
  location: LocationData
  corpuses: CorpusData[]
  expandLocation: (location) => void
}

const LocationCard: FC<LocationCardProps> = ({ expanded, location, corpuses, expandLocation }) => {
  const currentPlan = useAppStore((state) => state.currentPlan)

  const [styles, setStyles] = useState({
    contentWrapper: { maxHeight: 'max-content' },
  })

  const contentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (expanded) {
      const contentWrapperHeight = getComputedStyle(contentRef.current as HTMLDivElement).height
      setStyles({ contentWrapper: { maxHeight: contentWrapperHeight } })
    } else {
      setStyles({ contentWrapper: { maxHeight: '0' } })
    }
  }, [expanded])

  const corpusBtnClickHandler = (corpus: CorpusData) => {
    appStore().changeCurrentPlan(getBottomFloorPlan(corpus))
    // appStore().changeLayout(appStore().previousLayout)
    appStore().changeLayout(Layout.PLAN)
  }

  return (
    <div
      className={classNames(cl.locationCard, { [cl.expanded]: expanded })}
      onClick={() => {
        if (!expanded) expandLocation(location)
      }}
    >
      <div className={cl.titleWrapper}>
        <div className={cl.filler}></div>
        <div>{location.title}</div>
      </div>
      <div style={styles.contentWrapper} className={cl.contentWrapper}>
        <div ref={contentRef} className={cl.content}>
          <div className="">
            <p>Обозначение: {location.short}</p>
            <p>Адрес: {location.address}</p>
          </div>
          {!!corpuses.length && (
            <>
              <div>Корпуса:</div>
              <div className={cl.corpuses}>
                {corpuses.map((corpus) => (
                  <Button
                    onClick={() => {
                      corpusBtnClickHandler(corpus)
                    }}
                    current={currentPlan?.corpus === corpus}
                    key={corpus.id}
                    text={corpus.title}
                    disabled={!corpus.available}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocationCard
