export function askPermission(app, permission) {
    return confirm(`O app ${app} solicita: ${permission}. Permitir?`);
}
