export declare class BatchQueue {
    private batchQueue;
    private head;
    private isProcessing;
    private maxWorkMs;
    private drain;
    private processBatch;
    add(callback: () => void): void;
}
