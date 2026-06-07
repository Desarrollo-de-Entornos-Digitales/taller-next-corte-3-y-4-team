describe('Favoritos', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/favorites', { timeout: 10000 });
    });

    it('debe mostrar la página de favoritos', () => {
        cy.contains('Mis favoritos', { timeout: 10000 }).should('be.visible');
    });

    it('debe mostrar la lista de favoritos (puede estar vacía)', () => {
        cy.wait(2000);
        cy.get('body').then(($body) => {
            const tieneGrid = $body.find('.grid').length > 0;
            const tieneMensajeVacio = $body.text().includes('Aún no tienes favoritos');
            expect(tieneGrid || tieneMensajeVacio).to.be.true;
        });
    });
});
