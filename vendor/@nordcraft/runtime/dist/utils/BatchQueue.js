export class BatchQueue {
    batchQueue = [];
    head = 0;
    isProcessing = false;
    maxWorkMs = 5; // 5ms budget per chunk
    drain() {
        const start = performance.now();
        while (this.head < this.batchQueue.length &&
            performance.now() - start < this.maxWorkMs) {
            this.batchQueue[this.head++]?.();
        }
        if (this.head < this.batchQueue.length) {
            // Budget exceeded: fall back to a macrotask so the browser gets a chance to paint before we resume.
            setTimeout(() => this.drain(), 0);
        }
        else {
            this.isProcessing = false;
            this.batchQueue.length = 0;
            this.head = 0;
        }
    }
    processBatch() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        // Start as a microtask: cheapest path, and covers the common case
        // where the whole batch finishes well under budget.
        queueMicrotask(() => this.drain());
    }
    add(callback) {
        this.batchQueue.push(callback);
        this.processBatch();
    }
}
//# sourceMappingURL=BatchQueue.js.map