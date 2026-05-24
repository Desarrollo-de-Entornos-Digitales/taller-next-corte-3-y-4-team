describe("Autenticación", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("debe mostrar la página de login", () => {
    cy.contains("¡Bienvenido de vuelta!").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("debe hacer login exitoso con admin", () => {
    cy.get('input[name="email"]').type("admin@ludix.com");
    cy.get('input[name="password"]').type("admin123");
    cy.get('button[type="submit"]').click();

    // Debería redirigir al feed
    cy.url().should("include", "/feed");
    cy.contains("Para ti").should("be.visible");
  });

  it("debe mostrar error con credenciales inválidas", () => {
    cy.get('input[name="email"]').type("admin@ludix.com");
    cy.get('input[name="password"]').type("contraseña-incorrecta");
    cy.get('button[type="submit"]').click();

    // Debería mostrar notificación de error
    cy.contains("Credenciales inválidas").should("be.visible");
  });
});