import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw Error('The game service is unavailable. Please try again.');return env.DB;}
