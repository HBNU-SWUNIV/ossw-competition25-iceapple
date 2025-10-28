import {validateEnvironment} from '@/common/env/env-validate.ts';

const Env = validateEnvironment();

export function getEnv() {
    return Env;
}