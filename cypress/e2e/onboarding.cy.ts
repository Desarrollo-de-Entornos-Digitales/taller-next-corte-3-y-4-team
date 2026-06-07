describe('Onboarding', () => {
    beforeEach(() => {
        // Registrar un usuario nuevo
        cy.visit('/register');
        const randomEmail = `test${Date.now()}@test.com`;
        cy.get('input[name="name"]').type('Usuario Test');
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/onboarding');
    });

    it('debe mostrar la página de onboarding', () => {
        cy.contains('Cuéntanos sobre ti', { timeout: 10000 }).should('be.visible');
    });

    it('debe seleccionar un área creativa', () => {
        cy.get('.grid button').first().click();
        cy.contains('Siguiente').should('be.enabled');
    });
});
