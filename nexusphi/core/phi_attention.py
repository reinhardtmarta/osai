import torch.nn.functional as F

PHI = 1.618033988749895

def phi_attention_weights(attention_scores):
    # Multiplies attention by golden ratio harmonics
    batch, heads, q_len, k_len = attention_scores.shape
    phi_mask = torch.ones_like(attention_scores)
    for i in range(1, 7):
        phi_mask += torch.cos(torch.arange(q_len).unsqueeze(1) * 2 * 3.14159 * i / PHI)
    return attention_scores + 0.1 * phi_mask
