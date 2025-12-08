# OSAI Memory Engine
# Handles adaptive short-term and long-term memory with auto-cleaning.

import time

class NexusMemory:
    def __init__(self):
        self.short_term = {}      # auto expires
        self.long_term = {}       # persistent
        self.ttl = 300            # 5 minutes short-term memory
    
    def store(self, key, value, persistent=False):
        if persistent:
            self.long_term[key] = value
        else:
            self.short_term[key] = {
                "value": value,
                "timestamp": time.time()
            }
    
    def get(self, key):
        # Long term takes priority
        if key in self.long_term:
            return self.long_term[key]

        # Short term still usable?
        if key in self.short_term:
            data = self.short_term[key]
            if time.time() - data["timestamp"] <= self.ttl:
                return data["value"]
            else:
                del self.short_term[key]
        
        return None
    
    def cleanup(self):
        expired = []
        now = time.time()

        for key, data in self.short_term.items():
            if now - data["timestamp"] > self.ttl:
                expired.append(key)
        
        # remove expired short-term memory
        for key in expired:
            del self.short_term[key]
          
