/** application global config */

interface Config {
  residentsSpaceId: number
  pricesPerHourMinutes: {
    car: number
    motorcycle: number
  }
}
export const config: Config = {
  residentsSpaceId: 1,
  pricesPerHourMinutes: {
    car: 5,
    motorcycle: 3
  }
}
