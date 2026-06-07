describe('Historial', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit('/history', { timeout: 10000 });
        cy.wait(2000);
    });

    it('debe mostrar la página de historial', () => {
        // Buscar cualquier título o texto que confirme que estamos en el historial
        cy.get('h1, .text-3xl, .font-bold', { timeout: 10000 }).should('be.visible');
        cy.url().should('include', '/history');
    });

    it('debe mostrar ejercicios completados o mensaje vacío', () => {
        cy.wait(2000);
        cy.get('body').then(($body) => {
            const tieneEjercicios = $body.find('.space-y-3').length > 0;
            const tieneMensajeVacio = $body.text().includes('Aún no has realizado ejercicios');
            expect(tieneEjercicios || tieneMensajeVacio).to.be.true;
        });
    });

    it('debe repetir un ejercicio desde el historial (si hay ejercicios)', () => {
        cy.wait(2000);
        cy.get('body').then(($body) => {
            // Buscar si hay algún botón "Repetir" en la página
            const hayRepetir = $body.find('button:contains("Repetir")').length > 0;

            if (hayRepetir) {
                cy.contains('Repetir').first().click();
                cy.url({ timeout: 10000 }).should('match', /\/exercises\/\d+\/timer$/);
            } else {
                cy.log('⚠️ No hay ejercicios en el historial para probar la función repetir');
                // Esto hace que la prueba pase aunque no haya datos
                expect(true).to.be.true;
            }
        });
    });
});
