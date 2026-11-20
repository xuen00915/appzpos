/** Browser-side friction only. The API must enforce its own anti-abuse policy. */
export class LeadSpamError extends Error {
  constructor(readonly reason: 'trap' | 'busy' | 'limit') { super(reason); }
  messageFor(locale = 'en'): string {
    if (locale === 'zh') return this.reason === 'trap' ? '无法提交此表单。请刷新页面后重试。' : '提交过于频繁，请稍后再试。您输入的内容已保留。';
    return this.reason === 'trap' ? 'This form could not be submitted. Please refresh the page and try again.' : 'Please wait a minute before trying again. Your details have been kept.';
  }
}
export class LeadSpamGuard {
  private pending = false;
  private attempts: number[] = [];
  private lastSuccess = 0;
  private readonly key = 'appzpos-lead-throttle-v1';
  constructor(private readonly storage?: Storage, private readonly now = () => Date.now()) {}
  begin(trap: string): void {
    if (trap.trim()) throw new LeadSpamError('trap');
    if (this.pending) throw new LeadSpamError('busy');
    const now = this.now();
    try {
      const saved = JSON.parse(this.storage?.getItem(this.key) || '{}');
      if (Array.isArray(saved.attempts)) this.attempts = saved.attempts.filter((n: unknown) => typeof n === 'number' && Number.isFinite(n));
      if (typeof saved.lastSuccess === 'number' && Number.isFinite(saved.lastSuccess)) this.lastSuccess = saved.lastSuccess;
    } catch { /* Retain the in-memory guard when storage is unavailable. */ }
    this.attempts = this.attempts.filter(n => n > now - 60000 && n <= now);
    if (this.attempts.length >= 5 || (this.lastSuccess > 0 && now - this.lastSuccess < 60000)) throw new LeadSpamError('limit');
    this.attempts.push(now);
    this.pending = true;
    this.persist();
  }
  finish(success: boolean): void {
    if (success) this.lastSuccess = this.now();
    this.pending = false;
    this.persist();
  }
  private persist(): void {
    try { this.storage?.setItem(this.key, JSON.stringify({attempts: this.attempts, lastSuccess: this.lastSuccess})); } catch { /* No personal data is stored. */ }
  }
}
