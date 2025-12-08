from transformers import TrainingArguments, Trainer

def start_lifelong_learning(model, tokenizer, memory_db):
    args = TrainingArguments(
        output_dir="nexusphi/checkpoints",
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=8,
        logging_steps=10,
        save_strategy="no",
        report_to="none"
    )
    
    trainer = Trainer(model=model, args=args)
    
    def on_message(user_text, bot_reply):
        memory_db.remember("user", user_text, bot_reply)
        # 1-bit update in background
        trainer.train()
    
    return on_message
