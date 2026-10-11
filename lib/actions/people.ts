"use server";

import { auth } from "@/auth";
import { addCreditPerson, listCreditPeople } from "@/lib/post-credits";

export async function getCreditPeople() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }
    return { people: await listCreditPeople() };
}

export async function createCreditPerson(name: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }
    const person = await addCreditPerson(name);
    if (!person) {
        return { error: "Name cannot be empty" };
    }
    return { person };
}
