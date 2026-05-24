describe('Feed', () => {
    beforeEach(() => {
        // Login antes de cada prueba
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@ludix.com');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/feed');
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
        cy.get('header button').click();
        cy.contains('Cerrar sesión').click();
        cy.url().should('include', '/login');
    });
});
