// Cypress support file.

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "login",
  (username = `demo-${Date.now()}`, password = "password123") => {
    cy.visit("/create-account");
    cy.get("#username").type(username);
    cy.get("#password").type(password);
    cy.contains("button", "Create account").click();
  }
);

export {};
