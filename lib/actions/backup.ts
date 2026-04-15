"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { auth } from "@/auth";
import { isSuperUser } from "@/lib/rbac";
import { sendTelegramDocument } from "@/lib/notifications/telegram";
import { Table } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";

export type BackupResult = 
    | { success: true; filename: string; content: string }
    | { success: false; error: string };

export type NotifyResult = 
    | { success: true; message: string }
    | { success: false; error: string };

/**
 * Helper to escape SQL values
 */
function escapeSqlValue(value: unknown): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Date) return `'${value.toISOString()}'`;
    if (typeof value === "string") {
        // Simple escape for single quotes
        return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === "object") {
        return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    }
    return `'${String(value).replace(/'/g, "''")}'`;
}

/**
 * Internal helper to generate backup data in SQL format
 */
async function getRawBackupDataSql(prefix = "backup") {
    let sqlContent = `-- MERPATI CMS DATABASE BACKUP\n`;
    sqlContent += `-- Generated at: ${new Date().toLocaleString()}\n`;
    sqlContent += `SET standard_conforming_strings = on;\n\n`;
    
    // List of tables to backup
    const tables = [
        { name: "users", table: schema.users },
        { name: "accounts", table: schema.accounts },
        { name: "invitations", table: schema.invitations },
        { name: "options", table: schema.options },
        { name: "posts", table: schema.posts },
        { name: "postRelationships", table: schema.postRelationships },
        { name: "terms", table: schema.terms },
        { name: "termRelationships", table: schema.termRelationships },
        { name: "media", table: schema.media },
        { name: "menus", table: schema.menus },
        { name: "menuItems", table: schema.menuItems },
    ];

    for (const { name, table } of tables) {
        const rows = await db.select().from(table as Table);
        
        if (rows.length === 0) continue;

        sqlContent += `-- Data for table: ${name}\n`;
        sqlContent += `DELETE FROM "${name}";\n`; // Optional: clear existing data before restore
        
        const columns = Object.keys(rows[0]);
        const columnNames = columns.map(c => `"${c}"`).join(", ");

        for (const row of rows) {
            const values = columns.map(c => escapeSqlValue((row as Record<string, unknown>)[c])).join(", ");
            sqlContent += `INSERT INTO "${name}" (${columnNames}) VALUES (${values});\n`;
        }
        sqlContent += `\n`;
    }

    const buffer = Buffer.from(sqlContent, "utf-8");
    const filename = `${prefix}-${new Date().toISOString().split('T')[0]}.sql`;

    return { sqlContent, buffer, filename };
}

export async function generateDatabaseBackup(): Promise<BackupResult> {
    const session = await auth();
    if (!isSuperUser(session?.user?.role)) {
        throw new Error("Unauthorized");
    }

    try {
        const { sqlContent, filename } = await getRawBackupDataSql();
        return {
            success: true,
            filename,
            content: sqlContent,
        };
    } catch (error) {
        console.error("Backup failed:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function runBackupAndNotify(): Promise<NotifyResult> {
    const session = await auth();
    if (!isSuperUser(session?.user?.role)) {
        throw new Error("Unauthorized");
    }

    try {
        const { buffer, filename } = await getRawBackupDataSql();
        await sendTelegramDocument(
            buffer, 
            filename, 
            `📦 <b>Database Backup (SQL)</b>\n📅 Date: ${new Date().toLocaleString()}\n✨ Merpati CMS`
        );
        return { success: true, message: "Backup SQL sent to Telegram" };
    } catch (error) {
        console.error("Backup and notify failed:", error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Version for Cron that bypasses session check
 */
export async function runCronBackup(): Promise<NotifyResult> {
    try {
        const { buffer, filename } = await getRawBackupDataSql("auto-backup");
        await sendTelegramDocument(
            buffer, 
            filename, 
            `🤖 <b>Automatic Database Backup (SQL)</b>\n📅 Date: ${new Date().toLocaleString()}\n✨ Merpati CMS`
        );

        return { success: true, message: "Automatic backup sent to Telegram" };
    } catch (error) {
        console.error("Cron backup failed:", error);
        return { success: false, error: (error as Error).message };
    }
}
