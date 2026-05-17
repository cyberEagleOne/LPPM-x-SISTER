/**
 * SyncReport Interface
 * Digunakan untuk melaporkan hasil sinkronisasi data dari SISTER ke database
 */

export interface SyncError {
  record_id?: string;
  record_name?: string;
  error_message: string;
  error_type?: string;
  stack_trace?: string;
}

export interface SyncReport {
  operation: 'syncSDM' | 'syncPenelitian' | 'syncPublikasi';
  started_at: Date;
  completed_at: Date;
  total_processed: number;
  successful: number;
  failed: number;
  errors: SyncError[];
  summary?: string;

  // Utility methods
  isSuccess(): boolean;
  getErrorRate(): number;
}

/**
 * Implementation class untuk SyncReport
 */
export class SyncReportImpl implements SyncReport {
  operation: 'syncSDM' | 'syncPenelitian' | 'syncPublikasi';
  started_at: Date;
  completed_at: Date;
  total_processed: number = 0;
  successful: number = 0;
  failed: number = 0;
  errors: SyncError[] = [];

  constructor(operation: 'syncSDM' | 'syncPenelitian' | 'syncPublikasi') {
    this.operation = operation;
    this.started_at = new Date();
    this.completed_at = new Date();
  }

  isSuccess(): boolean {
    return this.failed === 0;
  }

  getErrorRate(): number {
    if (this.total_processed === 0) return 0;
    return (this.failed / this.total_processed) * 100;
  }

  get summary(): string {
    const duration = Math.round(
      (this.completed_at.getTime() - this.started_at.getTime()) / 1000
    );
    return `${this.operation}: ${this.successful}/${this.total_processed} berhasil, ${this.failed} gagal (${this.getErrorRate().toFixed(2)}% error rate) - ${duration}s`;
  }
}
