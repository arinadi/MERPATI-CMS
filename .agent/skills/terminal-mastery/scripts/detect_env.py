import platform
import os
import json
import subprocess
import sys

def get_ps_version():
    if platform.system() == "Windows":
        try:
            # Try to get PS version via powershell command
            result = subprocess.run(["powershell", "-Command", "$PSVersionTable.PSVersion.ToString()"], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
    return "Unknown"

def get_shell():
    if platform.system() == "Windows":
        return os.environ.get("PSModulePath", "") != "" and "PowerShell" or "CMD"
    else:
        return os.environ.get("SHELL", "Unknown")

def main():
    info = {
        "os": platform.system(),
        "os_release": platform.release(),
        "os_version": platform.version(),
        "architecture": platform.machine(),
        "shell": get_shell(),
        "python_version": platform.python_version()
    }

    if info["os"] == "Windows" and "PowerShell" in info["shell"]:
        info["ps_version"] = get_ps_version()
        # Determine if 5.1 or 7+ (7+ supports &&)
        try:
            major = int(info["ps_version"].split('.')[0])
            info["supports_chaining_operators"] = major >= 7
        except:
            info["supports_chaining_operators"] = False
    else:
        # Bash/Zsh usually support &&
        info["supports_chaining_operators"] = True

    print(json.dumps(info, indent=4))

if __name__ == "__main__":
    main()
