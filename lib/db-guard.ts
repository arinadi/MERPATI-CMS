import { redirect } from "next/navigation";

/**
 * Checks if an error (including nested .cause chain) indicates
 * that database tables don't exist (fresh install / DB reset).
 */
function isDbMissingError(error: unknown): boolean {
    const patterns = ["does not exist", "42P01", "relation"];
    let current: unknown = error;
    while (current) {
        const msg = current instanceof Error
            ? current.message
            : String(current);
        if (patterns.some(p => msg.includes(p))) return true;
        current = current instanceof Error ? current.cause : null;
    }
    return false;
}

/**
 * Wraps an async data-fetching function and redirects to /setup
 * if the database tables don't exist (fresh install / reset).
 * Keeps JSX outside of try/catch to satisfy react-hooks/error-boundaries.
 */
export async function dbGuard<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (isDbMissingError(error)) {
            redirect("/setup");
        }
        throw error;
    }
}
