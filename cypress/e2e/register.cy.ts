describe('Registro', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('debe mostrar la página de registro', () => {
        cy.contains('Crear cuenta').should('be.visible');
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
    });

    it('debe registrar un nuevo usuario', () => {
        const randomEmail = `test${Date.now()}@test.com`;

        cy.get('input[name="name"]').type('Usuario Test');
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type('123456');
        cy.get('button[type="submit"]').click();

        // Debería redirigir al onboarding
        cy.url().should('include', '/onboarding');
    });
});
