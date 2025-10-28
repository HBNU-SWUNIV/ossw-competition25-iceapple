import { z } from 'zod';

export const EnvironmentSchema = z.object({
    PORT: z.coerce.number().min(1024).max(65535),
    HOME_BASE_URL: z.url(),
    PROJECT_BASE_URL: z.url(),
    PLACE_BASE_URL: z.url(),
    NOTICE_BASE_URL: z.url(),
    AUTH_BASE_URL: z.url(),
});

export type Environment = z.infer<typeof EnvironmentSchema>;
