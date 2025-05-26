import React, { useEffect, useState } from 'react'

export default function useOnHideRemover(
  dependencyWhenShow: unknown
): [boolean, (e: React.AnimationEvent<HTMLDivElement>) => void] {
  const [isRemoved, setIsRemoved] = useState<boolean>(false)

  useEffect(() => {
    setIsRemoved(false)
  }, [dependencyWhenShow])

  function removerAnimationEndHandler(e: React.AnimationEvent<HTMLDivElement>): void {
    if (e.animationName.startsWith('hide-end')) {
      setIsRemoved(true)
    }
  }

  return [isRemoved, removerAnimationEndHandler]
}

/*
Чтобы использовать добавьте на верхнем уровне функционального компонента:

							передайте в свойство onAnimationEnd      зависимость когда вмонтировать обратно
														|                                           |
const [isRemoved, removerAnimationEndHandler] = useOnHideRemover(dependencyWhenShow)

	if(isRemoved){
		return null
	}
 */
