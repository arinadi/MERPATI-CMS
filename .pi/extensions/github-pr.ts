import type { PiExtension } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";

const extension: PiExtension = {
    name: "GitHub PR Automator",
    description: "Automates Git commit, branch creation, push, and GitHub PR creation.",
    version: "1.0.0",

    async init(pi) {
        pi.registerCommand({
            name: "pr",
            description: "Automatically commit all changes, create a new branch, and open a Pull Request",
            async execute(args, ctx) {
                const title = args.trim() || "chore: update from Pi Agent";

                // Tanya pengguna untuk konfirmasi branch name
                const branchName = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

                const branch = await ctx.ui.input({
                    message: "Enter new branch name:",
                    default: `feature/${branchName}`,
                });

                if (!branch) {
                    ctx.ui.notify({ message: "PR creation cancelled.", type: "warning" });
                    return;
                }

                ctx.ui.notify({ message: `Preparing PR on branch: ${branch}...`, type: "info" });

                try {
                    // 1. Git checkout new branch
                    execSync(`git checkout -b ${branch}`, { stdio: "ignore" });

                    // 2. Git add all
                    execSync(`git add .`, { stdio: "ignore" });

                    // 3. Git commit
                    execSync(`git commit -m "${title}"`, { stdio: "ignore" });

                    // 4. Git push
                    execSync(`git push origin ${branch}`, { stdio: "ignore" });

                    ctx.ui.notify({ message: "Changes pushed. Creating PR...", type: "info" });

                    // 5. Create PR using GitHub CLI
                    const prOutput = execSync(
                        `gh pr create --title "${title}" --body "Automated PR created by Pi Coding Agent.\n\nChanges included:\n- ${title}" --head ${branch} --base main`
                    ).toString();

                    ctx.ui.notify({ message: `✅ PR Created Successfully!\n${prOutput.trim()}`, type: "success" });

                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    ctx.ui.notify({ message: `❌ Error: ${message}`, type: "error" });
                }
            },
        });
    },
};

export default extension;