describe('Admin - Gestionar Logros', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('admin@ludix.com');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('include', '/feed');
        cy.visit('/admin/achievements', { timeout: 10000 });
        cy.wait(2000);
    });

    it('debe mostrar la página de gestión de logros', () => {
        cy.contains('Gestionar logros', { timeout: 10000 }).should('be.visible');
        cy.contains('Nuevo logro', { timeout: 10000 }).should('be.visible');
    });

    it('debe poder abrir el modal para crear un logro', () => {
        // Hacer clic en el botón "Nuevo logro"
        cy.contains('Nuevo logro', { timeout: 10000 }).click();

        // Esperar a que el modal aparezca (por el fondo oscuro)
        cy.get('.fixed.inset-0', { timeout: 10000 }).should('be.visible');

        // Verificar que el título del modal está visible
        cy.contains('Nuevo logro', { timeout: 10000 }).should('be.visible');

        // Verificar que los inputs del modal existen
        cy.get('input[type="text"]').first().should('be.visible');
        cy.get('textarea').should('be.visible');
        cy.get('input[type="number"]').should('be.visible');
    });
});
