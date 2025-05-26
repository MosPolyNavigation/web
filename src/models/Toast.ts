import { useAppStore } from '../store/useAppStore.ts'

export class Toast {
  public isShown: boolean = false
  public content: string = ''

  private timeWhenLastShowed: number = Date.now()

  constructor() {}

  showForTime(content: string) {
    this.timeWhenLastShowed = Date.now()
    const currentTriggeredTime = this.timeWhenLastShowed
    this.isShown = true
    this.content = content
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
