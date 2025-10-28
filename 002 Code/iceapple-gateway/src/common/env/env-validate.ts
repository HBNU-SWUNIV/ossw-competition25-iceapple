import { z } from 'zod';
import { type Environment, EnvironmentSchema } from './env.schema.ts';

export function validateEnvironment(): Environment {
    const result = EnvironmentSchema.safeParse(process.env);

    if (!result.success) throw new Error(z.prettifyError(result.error));

    return result.data;
}
