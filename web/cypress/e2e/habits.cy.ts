describe("Habits flow", () => {
  it("logs in, creates a habit, and checks in", () => {
    const habitName = `Test habit ${Date.now()}`;

    cy.login();

    cy.contains("Habit Tracker");
    cy.get("#habit-name").type(habitName);
    cy.get("#habit-description").type("Cypress flow");
    cy.contains("button", "Create habit").click();

    cy.contains("span", habitName)
      .parents("li")
      .within(() => {
        cy.contains("button", "Check in").click();
        cy.contains("Checked in today");
      });
  });
});
