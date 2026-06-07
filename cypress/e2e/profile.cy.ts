describe('Perfil', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/profile', { timeout: 10000 });
    });

    it('debe mostrar la página de perfil', () => {
        cy.contains('Mi perfil', { timeout: 10000 }).should('be.visible');
        cy.contains('Editar', { timeout: 10000 }).should('be.visible');
    });

    it('debe mostrar estadísticas del usuario', () => {
        cy.wait(2000);
        cy.get('body').then(($body) => {
            const texto = $body.text();
            expect(texto.includes('Ejercicios') || texto.includes('Logros')).to.be.true;
        });
    });

    it('debe navegar a editar perfil', () => {
        cy.contains('Editar').click();
        cy.url().should('include', '/profile/edit');
    });
});
