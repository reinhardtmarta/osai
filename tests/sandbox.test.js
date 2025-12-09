const { executeInSandbox } = require('../security/sandbox');

describe('Sandbox Tests', () => {
  it('deve executar código simples', async () => {
    const result = await executeInSandbox('return "Olá OS.AI!";');
    expect(result).toBe('Olá OS.AI!');
  });

  it('deve falhar sem perm', async () => {
    // Simula denied cap
    await expect(executeInSandbox('fetch("http://evil.com")')).rejects.toThrow('Permissões negadas');
  });
});
