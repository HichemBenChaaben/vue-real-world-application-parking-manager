type Maybe<T> = T | undefined
type Nullish<T> = T | null | undefined
type TypeOrNull<T> = T | null

export type EndParkingSessionDto = {
  readonly type?: string
  readonly properties?: EndParkingSessionDtoProperties
  readonly required?: string[]
}

export type ParkingSessionRequest = {
  readonly type?: string
  readonly properties?: EndParkingSessionRequestProperties
  readonly required?: string[]
}

export type EndParkingSessionRequestProperties = {
  readonly parkingSession?: ParkingSession
}

export type ParkingSession = {
  readonly ref?: string
}

export type LoginWithPasswordDto = {
  readonly type?: string
  readonly properties?: LoginWithPasswordDtoProperties
  readonly required?: string[]
}

export type ParkingSessionEndedDto = {
  readonly type?: string
  readonly properties?: ParkingSessionEndedDtoProperties
  readonly required?: string[]
}

export type ParkingSessionEndedResponse = {
  readonly type?: string
  readonly properties?: ParkingSessionEndedResponseProperties
  readonly required?: string[]
}

export type ParkingSessionEndedResponseProperties = {
  readonly endedSession?: ParkingSession
}

export type ParkingSessionRowDto = {
  readonly type?: string
  readonly properties?: ParkingSessionRowDtoProperties
  readonly required?: string[]
}

export type SessionEdAt = {
  readonly format?: string
  readonly type?: Type
}

export type VehicleType = {
  readonly type?: Type
  readonly enum?: string[]
}

export type ParkingSessionStartedDto = {
  readonly type?: string
  readonly properties?: ParkingSessionStartedDtoProperties
  readonly required?: string[]
}

export type ParkingSessionStartedResponse = {
  readonly type?: string
  readonly properties?: ParkingSessionStartedResponseProperties
  readonly required?: string[]
}

export type ParkingSessionStartedResponseProperties = {
  readonly startedSession?: ParkingSession
}

export type ParkingSessionsListResponse = {
  readonly type?: string
  readonly properties?: ParkingSessionsListResponseProperties
  readonly required?: string[]
}

export type ParkingS = {
  readonly type?: string
  readonly items?: ParkingSession
}

export type ParkingSpaceRowDto = {
  readonly type?: string
  readonly properties?: ParkingSpaceRowDtoProperties
  readonly required?: string[]
}

export type ParkingSpacesListResponse = {
  readonly type?: string
  readonly properties?: ParkingSpacesListResponseProperties
  readonly required?: string[]
}

export type ParkingSpacesListResponseProperties = {
  readonly parkingSpaces?: ParkingS
}

export type StartParkingSessionDto = {
  readonly type?: string
  readonly properties?: StartParkingSessionDtoProperties
  readonly required?: string[]
}
