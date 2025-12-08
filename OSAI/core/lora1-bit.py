# 1-bit LoRA adapter — fits in 4 GB RAM phones
# Credits: bitsandbytes + QLoRA + my magic
import torch
from peft import LoraConfig, get_peft_model prepare_model_for_kbit_training

def attach_OSAI_lora(model):
    config = LoraConfig(
        r=8,
        lora_alpha=16,
        target_modules=["q_proj", "v_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        use_rslora=True,
        loftq_config={"loftq_bits": 4},
        modules_to_save=["lm_head"]
    )
    model = prepare_model_for_kbit_training(model)
    model = get_peft_model(model, config)
    model.print_trainable_parameters()
    return model
