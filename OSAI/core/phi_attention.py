# OSAI Attention Engine
# Determines where the AI should focus its behavior.

class PhiAttention:
    def __init__(self):
        self.current_focus = None
    
    def focus(self, context):
        """Set the current focus."""
        self.current_focus = context
        return f"Nexus is now focused on: {context}"
    
    def get_focus(self):
        return self.current_focus
      
