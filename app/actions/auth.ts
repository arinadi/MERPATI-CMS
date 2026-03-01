"use server";

import { signIn as signInAuth, signOut as signOutAuth } from "@/auth";

export async function login() {
    await signInAuth("google", { redirectTo: "/dashboard" });
}

export async function logout() {
    await signOutAuth({ redirectTo: "/" });
}
