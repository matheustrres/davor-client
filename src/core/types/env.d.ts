import { type Environment } from '@/core/types';

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Environment {}
	}
}
