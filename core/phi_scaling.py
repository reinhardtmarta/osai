# core/phi_scaling.py — Universal UI/Runtime Adapter
# Scales everything harmonically: screens, compute, even quantum states

import math
import os
from typing import Tuple

PHI = (1 + math.sqrt(5)) / 2  # 1.618033988749895
CHAOS = 1 / (PHI ** 2)  # 0.3819660112501051 — incoherence threshold

def detect_env() -> dict:
    """Detect screen, RAM, etc. Works in Colab/Termux."""
    try:
        import subprocess
        width = int(subprocess.check_output("tput cols", shell=True).decode().strip()) if os.system("command -v tput") == 0 else 80
        height = int(subprocess.check_output("tput lines", shell=True).decode().strip()) if os.system("command -v tput") == 0 else 24
        ram_free = int(subprocess.check_output("free -m | awk '/Mem:/ {print $4}'", shell=True).decode().strip()) if os.system("command -v free") == 0 else 512
    except:
        width, height, ram_free = 80, 24, 512  # Fallback
    return {"width": width, "height": height, "ram_mb": ram_free}

def phi_scale(env: dict, target_complexity: float = 1.0) -> float:
    """Compute harmonic scale — grows/shrinks without breaking coherence."""
    width, ram = env["width"], env["ram_mb"]
    scale = 1.0
    
    # Grow phase (coherent expansion)
    while (width * scale < 120 or ram * scale > target_complexity * 500) and scale * PHI < 10:
        scale *= PHI
    
    # Shrink if chaos (incoherent)
    while scale * CHAOS > 0.1 and (width * scale > 2000 or ram * scale < 100):
        scale *= CHAOS
    
    return round(scale, 2)

# Example usage
if __name__ == "__main__":
    env = detect_env()
    scale = phi_scale(env)
    print(f"Φ-Scale for your env: {scale}")
    print(f"Coherence: {PHI:.3f} | Incoherence threshold: {CHAOS:.3f}")
    
    # Demo: Scale a plot (integrate with matplotlib in Colab)
    import matplotlib.pyplot as plt
    import numpy as np
    theta = np.linspace(0, 10*np.pi, 1000)
    r = np.exp(theta / PHI)  # Log spiral
    plt.figure(figsize=(6*scale, 6*scale))  # Auto-scale plot!
    plt.polar(theta, r)
    plt.title("Φ-Adaptive Spiral — Scales to Your Screen")
    plt.show()  # In Colab: magic!
