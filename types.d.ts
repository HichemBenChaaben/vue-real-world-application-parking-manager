type Maybe<T> = T | undefined
type Nullish<T> = T | null | undefined
type TypeOrNull<T> = T | null

export type Schemas = {
  readonly loginWithPasswordDto?: LoginWithPasswordDto
  readonly userDto?: UserDto
  readonly authDto?: AuthDto
  readonly userResponse?: UserResponse
  readonly vehicleType?: VehicleType
  readonly startParkingSessionDto?: StartParkingSessionDto
  readonly startParkingSessionRequest?: ParkingSessionRequest
  readonly parkingSessionStartedDto?: ParkingSessionStartedDto
  readonly parkingSessionStartedResponse?: ParkingSessionStartedResponse
  readonly endParkingSessionDto?: EndParkingSessionDto
  readonly endParkingSessionRequest?: ParkingSessionRequest
  readonly parkingSessionEndedDto?: ParkingSessionEndedDto
  readonly parkingSessionEndedResponse?: ParkingSessionEndedResponse
  readonly parkingSpaceRowDto?: ParkingSpaceRowDto
  readonly parkingSpacesListResponse?: ParkingSpacesListResponse
  readonly parkingSessionRowDto?: ParkingSessionRowDto
  readonly parkingSessionsListResponse?: ParkingSessionsListResponse
}

export type AuthDto = {
  readonly type?: string
  readonly properties?: AuthDtoProperties
  readonly required?: string[]
}

export type AuthDtoProperties = {
  readonly accessToken?: AccessToken
  readonly expiresIn?: AccessToken
}

export type AccessToken = {
  readonly type?: Type
}

export type Type = 'string' | 'number' | 'boolean'

export type EndParkingSessionDto = {
  readonly type?: string
  readonly properties?: EndParkingSessionDtoProperties
  readonly required?: string[]
}

export type EndParkingSessionDtoProperties = {
  readonly id?: AccessToken
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

export type LoginWithPasswordDtoProperties = {
  readonly email?: AccessToken
  readonly password?: AccessToken
}

export type ParkingSessionEndedDto = {
  readonly type?: string
  readonly properties?: ParkingSessionEndedDtoProperties
  readonly required?: string[]
}

export type ParkingSessionEndedDtoProperties = {
  readonly parkingSpaceID?: AccessToken
  readonly sessionLengthInHoursMinutes?: AccessToken
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

export type ParkingSessionRowDtoProperties = {
  readonly parkingSessionID?: AccessToken
  readonly parkingSpaceID?: AccessToken
  readonly isSessionEnded?: AccessToken
  readonly sessionLengthInHoursMinutes?: AccessToken
  readonly sessionStartedAt?: SessionEdAt
  readonly sessionEndedAt?: SessionEdAt
  readonly vehicleLicensePlate?: AccessToken
  readonly vehicleType?: VehicleType
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

export type ParkingSessionStartedDtoProperties = {
  readonly parkingSessionID?: AccessToken
  readonly parkingSpaceID?: AccessToken
  readonly sessionStartedAt?: SessionEdAt
  readonly vehicleLicensePlate?: AccessToken
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

export type ParkingSessionsListResponseProperties = {
  readonly parkingSessions?: ParkingS
  readonly parkingSessionsTotalCount?: AccessToken
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

export type ParkingSpaceRowDtoProperties = {
  readonly parkingSpaceID?: AccessToken
  readonly isOccupied?: AccessToken
  readonly occupancy?: AccessToken
  readonly capacity?: AccessToken
  readonly vehicleType?: VehicleType
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

export type StartParkingSessionDtoProperties = {
  readonly vehicleType?: ParkingSession
  readonly isResident?: AccessToken
  readonly vehicleLicensePlate?: AccessToken
}

export type UserDto = {
  readonly type?: string
  readonly properties?: UserDtoProperties
  readonly required?: string[]
}

export type UserDtoProperties = {
  readonly id?: AccessToken
  readonly email?: AccessToken
}

export type UserResponse = {
  readonly type?: string
  readonly properties?: UserResponseProperties
  readonly required?: string[]
}

export type UserResponseProperties = {
  readonly user?: ParkingSession
  readonly auth?: ParkingSession
}

export type SecuritySchemes = {
  readonly bearer?: Bearer
}

export type Bearer = {
  readonly scheme?: string
  readonly bearerFormat?: string
  readonly type?: string
}

export type Info = {
  readonly title?: string
  readonly description?: string
  readonly version?: string
  readonly contact?: Contact
}

export type Contact = {}

export type Paths = {
  readonly empty?: Empty
  readonly v1AuthPassword?: V1AuthPasswordClass
  readonly v1AuthMe?: V1AuthMeClass
  readonly v1ParkingSessionStart?: V1AuthPasswordClass
  readonly v1ParkingSessionEnd?: V1AuthPasswordClass
  readonly v1ParkingSpacesList?: V1AuthMeClass
  readonly v1ParkingSessionsList?: V1AuthMeClass
}

export type Empty = {
  readonly get?: Get
}

export type Get = {
  readonly operationID?: string
  readonly parameters?: any[]
  readonly responses?: PurpleResponses
  readonly tags?: string[]
}

export type PurpleResponses = {
  readonly the200?: Purple200
}

export type Purple200 = {
  readonly description?: string
  readonly content?: PurpleContent
}

export type PurpleContent = {
  readonly applicationJSON?: PurpleApplicationJSON
}

export type PurpleApplicationJSON = {
  readonly schema?: AccessToken
}

export type V1AuthMeClass = {
  readonly get?: V1AuthMeGet
}

export type V1AuthMeGet = {
  readonly operationID?: string
  readonly parameters?: Parameter[]
  readonly responses?: FluffyResponses
  readonly tags?: string[]
  readonly security?: Security[]
}

export type Parameter = {
  readonly name?: string
  readonly required?: boolean
  readonly in?: 'query'
  readonly schema?: Schema
}

export type Schema = {
  readonly default?: number
  readonly type?: Type
  readonly format?: string
  readonly enum?: string[]
}

export type FluffyResponses = {
  readonly the200?: The201_Class
}

export type The201_Class = {
  readonly description?: string
  readonly content?: The201_Content
}

export type The201_Content = {
  readonly applicationJSON?: FluffyApplicationJSON
}

export type FluffyApplicationJSON = {
  readonly schema?: ParkingSession
}

export type Security = {
  readonly bearer?: any[]
}

export type V1AuthPasswordClass = {
  readonly post?: Post
}

export type Post = {
  readonly operationID?: string
  readonly parameters?: any[]
  readonly requestBody?: RequestBody
  readonly responses?: PostResponses
  readonly tags?: string[]
  readonly security?: Security[]
}

export type RequestBody = {
  readonly required?: boolean
  readonly content?: The201_Content
}

export type PostResponses = {
  readonly the201?: The201_Class
}
