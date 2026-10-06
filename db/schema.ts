import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('rooms',{code:text('code').primaryKey(),owner:text('owner').notNull(),data:text('data').notNull(),version:integer('version').notNull().default(0),expires:integer('expires').notNull()},t=>[index('rooms_owner').on(t.owner),index('rooms_expires').on(t.expires)]);
