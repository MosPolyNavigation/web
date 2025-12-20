import { useAppStore } from '../store/useAppStore.ts'
import { IconLink } from '../constants/IconLink.ts'

export class Toast {
  public isShown: boolean = false
  public content: string = ''
  public icon?: IconLink

  private timeWhenLastShowed: number = Date.now()

  constructor() {}

  showForTime(content: string, icon?: IconLink) {
    this.timeWhenLastShowed = Date.now()
    const currentTriggeredTime = this.timeWhenLastShowed
    this.isShown = true
    this.content = content
    this.icon = icon
    mutate()
    setTimeout(() => {
      if (this.timeWhenLastShowed === currentTriggeredTime) {
        this.isShown = false
        mutate()
      }
    }, 2000)
  }
}

function mutate() {
  useAppStore.setState({})
}
