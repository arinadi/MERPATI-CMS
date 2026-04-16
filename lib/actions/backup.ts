"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { auth } from "@/auth";
import { isSuperUser } from "@/lib/rbac";
import { sendTelegramDocument } from "@/lib/notifications/telegram";
import { Table } from "drizzle-orm";
import archiver from "archiver";
import { PassThrough } from "stream";
import { getCachedOptions } from "@/lib/queries/options";

export type BackupResult = 
    | { success: true; filename: string; content: string }
    | { success: false; error: string };

export type NotifyResult = 
    | { success: true; message: string }
    | { success: false; error: string };

/**
 * Internal helper to check Telegram configuration
 */
async function checkTelegramConfig(): Promise<boolean> {
    const settings = await getCachedOptions([
        "telegram_bot_token",
        "telegram_chat_id"
    ]);
    return !!(settings.telegram_bot_token && settings.telegram_chat_id);
}

/**
 * Helper to escape SQL values
 */
function escapeSqlValue(value: unknown): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Date) return `'${value.toISOString()}'`;
    if (typeof value === "string") {
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
        sqlContent += `DELETE FROM "${name}";\n`;
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

/**
 * Internal helper to generate media backup as a ZIP buffer
 */
async function getMediaBackupZip(prefix = "media-backup") {
    const allMedia = await db.select().from(schema.media);
    if (allMedia.length === 0) {
        throw new Error("No media found to backup");
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    const passthrough = new PassThrough();
    const chunks: Buffer[] = [];

    passthrough.on("data", (chunk) => chunks.push(chunk));

    const zipPromise = new Promise<Buffer>((resolve, reject) => {
        passthrough.on("end", () => resolve(Buffer.concat(chunks)));
        passthrough.on("error", reject);
    });

    archive.pipe(passthrough);

    for (const item of allMedia) {
        try {
            const response = await fetch(item.url);
            if (!response.ok) continue;
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const entryName = item.filename || `${item.id}.jpg`;
            archive.append(buffer, { name: entryName });
        } catch (err) {
            console.error(`Failed to download media ${item.url}:`, err);
        }
    }

    await archive.finalize();
    const buffer = await zipPromise;
    const filename = `${prefix}-${new Date().toISOString().split('T')[0]}.zip`;

    return { buffer, filename };
}

export async function generateDatabaseBackup(): Promise<BackupResult> {
    const session = await auth();
    if (!isSuperUser(session?.user?.role)) throw new Error("Unauthorized");
    try {
        const { sqlContent, filename } = await getRawBackupDataSql();
        return { success: true, filename, content: sqlContent };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function runBackupAndNotify(): Promise<NotifyResult> {
    const session = await auth();
    if (!isSuperUser(session?.user?.role)) throw new Error("Unauthorized");

    // Pre-validation: Telegram check
    if (!(await checkTelegramConfig())) {
        return { success: false, error: "Telegram Bot Token or Chat ID not configured" };
    }

    try {
        const { buffer, filename } = await getRawBackupDataSql();
        await sendTelegramDocument(buffer, filename, `📦 <b>Database Backup (SQL)</b>\n📅 Date: ${new Date().toLocaleString()}\n✨ Merpati CMS`);
        return { success: true, message: "Backup SQL sent to Telegram" };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function runCronBackup(): Promise<NotifyResult> {
    // Pre-validation: Telegram check
    if (!(await checkTelegramConfig())) {
        return { success: false, error: "Cron skipped: Telegram not configured" };
    }

    try {
        const { buffer, filename } = await getRawBackupDataSql("auto-backup");
        await sendTelegramDocument(buffer, filename, `🤖 <b>Automatic Database Backup (SQL)</b>\n📅 Date: ${new Date().toLocaleString()}\n✨ Merpati CMS`);
        return { success: true, message: "Automatic backup sent to Telegram" };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function runMediaBackupAndNotify(): Promise<NotifyResult> {
    const session = await auth();
    if (!isSuperUser(session?.user?.role)) throw new Error("Unauthorized");

    // Pre-validation: Telegram check
    if (!(await checkTelegramConfig())) {
        return { success: false, error: "Telegram not configured" };
    }

    try {
        const { buffer, filename } = await getMediaBackupZip();
        if (buffer.length > 45 * 1024 * 1024) {
            return { success: false, error: "Media backup too large for Telegram (>45MB)" };
        }
        await sendTelegramDocument(buffer, filename, `🖼️ <b>Media Backup (ZIP)</b>\n📅 Date: ${new Date().toLocaleString()}\n✨ Merpati CMS`);
        return { success: true, message: "Media backup sent to Telegram" };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function runWeeklyMediaBackup(): Promise<NotifyResult> {
    // Pre-validation: Telegram check
    if (!(await checkTelegramConfig())) {
        return { success: false, error: "Weekly cron skipped: Telegram not configured" };
    }

    try {
        const { buffer, filename } = await getMediaBackupZip("weekly-media");
        if (buffer.length > 45 * 1024 * 1024) {
            return { success: false, error: "Media backup too large" };
        }
        await sendTelegramDocument(buffer, filename, `🤖 <b>Weekly Media Backup (ZIP)</b>\n📅 Date: ${new Date().toLocaleString()}\n✨ Merpati CMS`);
        return { success: true, message: "Weekly media backup sent to Telegram" };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
