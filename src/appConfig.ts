export const appConfig = {
  firstPlanSettingDate: Number(localStorage.getItem('last-plan-setting-date')),
  firstPlan: localStorage.getItem('last-plan') ?? 'A-1',
  svgSource: 'https://mospolynavigation.github.io/navigationData/',
  plan: {
    auditoriumFillColor: '#3B3C41',
  },
  dataUrl: '/web/data/locationsV2.json',
}
