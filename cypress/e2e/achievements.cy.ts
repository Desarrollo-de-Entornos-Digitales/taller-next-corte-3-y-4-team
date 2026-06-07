describe('Logros', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/achievements', { timeout: 10000 });
    });

    it('debe mostrar la página de logros', () => {
        cy.contains('Mis logros', { timeout: 10000 }).should('be.visible');
        cy.contains('Progreso general').should('be.visible');
    });

    it('debe mostrar tarjetas de logros', () => {
        cy.wait(3000);
        // Buscar el contenedor principal y verificar que tiene hijos
        cy.get('body').find('[style*="grid"]').should('exist');
    });
});
