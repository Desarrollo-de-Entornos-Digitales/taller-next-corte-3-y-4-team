describe('Feed', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/feed', { timeout: 10000 });
        cy.contains('Para ti', { timeout: 10000 }).should('be.visible');
    });

    it('debe mostrar el feed con ejercicios', () => {
        cy.contains('Para ti').should('be.visible');
        cy.get('.grid').should('exist');
    });

    it('debe hacer clic en un ejercicio y ver detalles', () => {
        cy.get('.grid .cursor-pointer').first().click();
        cy.url().should('match', /\/exercises\/\d+$/);
        cy.contains('Comenzar ahora').should('be.visible');
    });

    it('debe cerrar sesión correctamente', () => {
        // Ir al perfil primero
        cy.visit('/profile', { timeout: 10000 });
        cy.contains('Cerrar sesión', { timeout: 10000 }).click();
        cy.url().should('include', '/login');
    });
});
