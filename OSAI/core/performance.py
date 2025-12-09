# OSAI Performance Manager
# Monitors and optimizes resource usage.

class PerformanceManager:
    def __init__(self):
        self.cpu_load = 0
        self.ram_usage = 0
    
    def report(self, cpu, ram):
        """Update system usage."""
        self.cpu_load = cpu
        self.ram_usage = ram
    
    def optimize(self):
        """Return recommendations for optimization."""
        actions = []

        if self.cpu_load > 80:
            actions.append("reduce_background_tasks")

        if self.ram_usage > 80:
            actions.append("clean_memory")

        return actions
