---
name: terminal-mastery
description: Advanced terminal command patterns for cross-platform (Windows, Linux, macOS) stability. Prevents syntax errors by enforcing environment detection and shell-specific patterns.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Python
---

# Terminal Mastery Skill

This skill ensures that all terminal commands are executed with the correct syntax based on the OS, shell type, and shell version.

## 🛠️ Protocol: Environment Awareness (MANDATORY)

Before executing a complex or multi-step command, you MUST know your environment:

1.  **Run Detector**: `python .agent/skills/terminal-mastery/scripts/detect_env.py`
2.  **Verify OS**: Confirm if you are on `Windows`, `Linux`, or `Darwin` (macOS).
3.  **Identify Shell**: Check if it's `Bash`, `Zsh`, `CMD`, or `PowerShell`.
4.  **Check Version**: Crucial for PowerShell (Version 5.1 does NOT support `&&`).

## 🖇️ Operator Matrix

| Feature | Windows PowerShell 5.1 | PowerShell 7+ / Bash / Zsh |
|---|---|---|
| **Chaining (Success)** | `;` (semicolon) | `&&` |
| **Chaining (Unconditional)** | `;` | `;` |
| **Logic (Failure)** | `try { ... } catch { ... }` | `\|\|` |
| **Path Separator** | `\` (backslash) | `/` (forward slash) |
| **Variable Access** | `$env:VAR` | `$VAR` |

### ❌ WRONG (PS 5.1)
`git add . && git commit -m "msg"`
*Error: The token '&&' is not a valid statement separator in this version.*

### ✅ CORRECT (PS 5.1)
`git add .; git commit -m "msg"`

---

## 📂 Path & Quote Guide

- **Cross-Platform Paths**: Use forward slashes `/` where possible (many modern Windows tools support them) OR use Python's `os.path.join` if building complex strings in a script.
- **Quoting**: 
    - Windows PowerShell: Use `"double quotes"` for strings containing variables.
    - Bash: Use `"double quotes"` for variable expansion, `'single quotes'` to prevent it.

## 🚀 Safe Execution Pattern

For multi-step logic (e.g., build → test → deploy), it is SAFER to:
1.  Check the environment.
2.  If on Windows/PS 5.1, run commands sequentially or use `;`.
3.  For very complex logic, write a temporary `.py` script and run it via `python`.

## 🧪 Common Cmdlet Equivalents

| Task | Linux/macOS (Bash) | Windows (PowerShell) |
|---|---|---|
| **List Files** | `ls -la` | `Get-ChildItem` (or `ls`) |
| **Find String** | `grep "text" file` | `Select-String "text" file` |
| **Check Connectivity** | `curl -I URL` | `Invoke-WebRequest -Method Head URL` |
| **Remove File** | `rm file` | `Remove-Item file` (or `rm`) |
| **Make Directory** | `mkdir -p path` | `New-Item -ItemType Directory -Force path` |
