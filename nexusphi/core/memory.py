# NexusPhi Memory Module
# Handles short-term and long-term memory structures
# Auto-cleans outdated or irrelevant memory entries

class NexusMemory:
    def __init__(self):
        self.short_term = {}
        self.long_term = {}

    def store(self, key, value, long_term=False):
        if long_term:
            self.long_term[key] = value
        else:
            self.short_term[key] = value

    def get(self, key):
        return self.long_term.get(key) or self.short_term.get(key)
