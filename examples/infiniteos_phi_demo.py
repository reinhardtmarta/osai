# examples/infiniteos_phi_demo.py — Φ-Spiral Sim with Grok API (from xAI PR)
# Run in connectOS or Colab

import math
import matplotlib.pyplot as plt
import numpy as np
# from core.phi_scaling import phi_scale, detect_env  # Import your core!

PHI = (1 + math.sqrt(5)) / 2

def phi_spiral(n_points=1000, scale=1.0):
    theta = np.linspace(0, 8 * np.pi, n_points)
    r = np.exp(theta / PHI) * scale  # Harmonic growth
    return theta, r

# env = detect_env()
# scale = phi_scale(env)  # Auto-adapt!
scale = 1.0  # Or use above

theta, r = phi_spiral(scale=scale)

plt.figure(figsize=(8*scale, 8*scale))
plt.polar(theta, r, color='gold')
plt.title('connectOS: Infinite Φ-Spiral — Adaptive & Coherent')
plt.show()

print("Spiral coherence achieved. Ready for quantum evolution agents.")
# TODO: Integrate Grok API for truth-seeking sim
