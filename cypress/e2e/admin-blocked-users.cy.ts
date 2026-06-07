describe('Admin - Bloquear Usuarios', () => {
    beforeEach(() => {
        // Login robusto
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@ludix.com');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        // Esperar a que redirija a /feed
        cy.url({ timeout: 10000 }).should('include', '/feed');

        // Verificar token
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.not.be.null;
        });

        // Ahora ir a la página de admin
        cy.visit('/admin/blocked-users', { timeout: 10000 });
        cy.wait(2000);
    });

    it('debe mostrar la página de bloqueo de usuarios', () => {
        cy.contains('Bloquear usuarios', { timeout: 10000 }).should('be.visible');
        cy.get('table', { timeout: 10000 }).should('exist');
    });

    it('debe mostrar la lista de usuarios', () => {
        cy.wait(2000);
        // Puede que la tabla tenga un body o no, dependiendo de si hay datos
        cy.get('tbody tr, .table-row, [role="row"]', { timeout: 10000 }).should('exist');
    });
});
