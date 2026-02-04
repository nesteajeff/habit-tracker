describe("Goals flow", () => {
  it("logs in, creates a goal, and updates status", () => {
    const goalTitle = `Test goal ${Date.now()}`;

    cy.login();

    cy.visit("/goals");
    cy.contains("Goal Tracker");
    cy.get("#goal-title").type(goalTitle);
    cy.contains("button", "Create Goal").click();

    cy.contains("span", goalTitle)
      .parents("li")
      .within(() => {
        cy.get('button[aria-label="Mark goal completed"]').click();
        cy.get('button[aria-label="Goal completed"]').should("be.disabled");
      });
  });
});
