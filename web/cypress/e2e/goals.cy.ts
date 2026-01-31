describe("Goals flow", () => {
  it("logs in, creates a goal, and updates status", () => {
    const goalTitle = `Test goal ${Date.now()}`;

    cy.login();

    cy.visit("/goals");
    cy.contains("Goals");
    cy.get("#goal-title").type(goalTitle);
    cy.contains("button", "Create goal").click();

    cy.contains("span", goalTitle)
      .parents("li")
      .within(() => {
        cy.get("select").select("completed");
        cy.contains("completed");
      });
  });
});
