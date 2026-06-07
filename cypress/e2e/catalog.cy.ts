describe('Catálogo', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/catalog', { timeout: 10000 });
        cy.wait(2000);
    });

    it('debe mostrar la página de catálogo', () => {
        cy.contains('Catálogo de ejercicios', { timeout: 10000 }).should('be.visible');
        cy.get('.grid', { timeout: 10000 }).should('exist');
    });

    it('debe filtrar ejercicios por tipo', () => {
        cy.contains('Todos', { timeout: 10000 }).should('be.visible');
        cy.get('button').contains('Ideación').click();
        cy.wait(1000);
        cy.get('.grid').should('exist');
    });

    it('debe agregar un ejercicio a favoritos desde el catálogo', () => {
        cy.get('.relative button', { timeout: 10000 }).first().click();
        cy.contains('Agregado a favoritos', { timeout: 5000 }).should('be.visible');
    });

    it('debe navegar al detalle del ejercicio al hacer clic', () => {
        cy.get('.grid .cursor-pointer', { timeout: 10000 }).first().click();
        cy.url({ timeout: 10000 }).should('match', /\/exercises\/\d+$/);
        cy.contains('Comenzar ahora', { timeout: 10000 }).should('be.visible');
    });
});
