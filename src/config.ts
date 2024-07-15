/** application global config */

interface Config {
  appLocale: string
  currency: string
  residentsSpaceId: number
  pricesPerHourMinutes: {
    car: number
    motorcycle: number
  }
}
export const config: Config = {
  appLocale: 'nl-NL',
  currency: 'EUR',
  residentsSpaceId: 1,
  pricesPerHourMinutes: {
    car: 5,
    motorcycle: 3
  }
}
