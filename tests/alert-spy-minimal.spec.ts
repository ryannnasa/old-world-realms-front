import { describe, it, expect, vi } from 'vitest';

describe('alert spy minimal', () => {
  it('should spy on alert', () => {
    const spy = vi.spyOn(globalThis, 'alert').mockImplementation(() => {});
    alert('test');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
