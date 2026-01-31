// Cypress support file.

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email = "demo@example.com") => {
  cy.visit("/login");
  cy.get("#email").type(email);
  cy.contains("button", "Log in").click();
});

export {};
