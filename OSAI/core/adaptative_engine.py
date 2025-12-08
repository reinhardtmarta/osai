# OSAI Adaptive Engine
# Learns patterns and adjusts system behavior dynamically.

class AdaptiveEngine:
    def __init__(self):
        self.patterns = {}   # user behavior model
        self.preferences = {}
    
    def record_action(self, action):
        """Record user actions to build patterns."""
        self.patterns[action] = self.patterns.get(action, 0) + 1
    
    def set_preference(self, key, value):
        """User-defined preferences."""
        self.preferences[key] = value
    
    def get_preference(self, key):
        return self.preferences.get(key, None)

    def predict(self):
        """Predict what the user probably wants next."""
        if not self.patterns:
            return None
        
        # Return the action with the highest count (simple model)
        return max(self.patterns, key=self.patterns.get)
