import chromadb
from chromadb.config import Settings

class NexusMemory:
    def __init__(self, path="nexusphi/memory"):
        self.client = chromadb.PersistentClient(path=path)
        self.collection = self.client.get_or_create_collection("eternal_memory")
    
    def remember(self, user_id, input_text, output_text):
        self.collection.add(
            documents=[f"USER: {input_text} | NEXUS: {output_text}"],
            metadatas=[{"user": user_id, "timestamp": __import__('time').time()}],
            ids=[f"msg_{__import__('time').time_ns()}"]
        )
    
    def recall(self, query, n_results=5):
        return self.collection.query(query_texts=[query], n_results=n_results)
