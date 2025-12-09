export const Scheduler = {
    queue: [],
    add(task) { this.queue.push(task); },
    run() { setInterval(() => this.queue.forEach(t => t()), 100); }
};
