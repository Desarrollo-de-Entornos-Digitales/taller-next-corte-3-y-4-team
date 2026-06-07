// Comando para login como admin
Cypress.Commands.add('loginAsAdmin', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@ludix.com');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    // Esperar a que la URL cambie a /feed
    cy.url().should('include', '/feed', { timeout: 10000 });

    // Esperar a que el token se guarde
    cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.not.be.null;
    });
});

// Comando para login como usuario normal
Cypress.Commands.add('loginAsUser', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('user1@ludix.com');
    cy.get('input[name="password"]').type('user123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/feed', { timeout: 10000 });
});

// Comando para limpiar y hacer login
Cypress.Commands.add('cleanAndLogin', () => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.loginAsAdmin();
});
