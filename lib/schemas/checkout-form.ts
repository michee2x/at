import { z } from 'zod';


export const checkoutSchema = z.object({
    deliveryMethod: z.enum(['deliver']),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    addressLine2: z.string().optional(),
    saveToProfile: z.boolean().optional(),
    preferredAddress: z.boolean().optional(),
    email: z.string().email('Must be a valid email'),
    phone: z
        .string()
        .min(7, 'Enter a valid phone number')
        .max(20)
        .regex(/^[0-9+\-() ]+$/, 'Phone contains invalid characters'),
});


export type CheckoutSchema = z.infer<typeof checkoutSchema>;