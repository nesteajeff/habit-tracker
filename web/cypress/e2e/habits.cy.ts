describe("Habits flow", () => {
  it("logs in, creates a habit, and checks in", () => {
    const habitName = `Test habit ${Date.now()}`;

    cy.login();

    cy.contains("Habit Tracker");
    cy.get("#habit-name").type(habitName);
    cy.contains("button", "Create Habit").click();

    cy.contains("span", habitName)
      .parents("li")
      .within(() => {
        cy.get('button[aria-label="Check in"]').click();
        cy.get('button[aria-label="Checked in"]').should("be.disabled");
      });
  });
});
