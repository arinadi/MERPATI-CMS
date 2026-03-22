import { redirect } from "next/navigation";

/**
 * Wraps an async data-fetching function and redirects to /setup
 * if the database tables don't exist (fresh install / reset).
 * Keeps JSX outside of try/catch to satisfy react-hooks/error-boundaries.
 */
export async function dbGuard<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        const msg = String(error);
        if (msg.includes("does not exist") || msg.includes("42P01")) {
            redirect("/setup");
        }
        throw error;
    }
}
