import { getSiteConfig } from '@lib/site-config.js';

export const SITE = getSiteConfig(import.meta.env);
export const CONTACTS = SITE.contacts;
