import { z } from 'zod'

export const parkingSessionSchema = z.object({
  vehicleType: z.enum(['car', 'motorcycle']),
  isResident: z.boolean(),
  licensePlate: z
    .string()
    .min(1, 'License plate is required')
    .max(10, 'License plate must be 10 characters or less')
})

export type ParkingSession = z.infer<typeof parkingSessionSchema>
