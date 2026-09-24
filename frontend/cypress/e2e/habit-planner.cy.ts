describe('Habit Planner', () => {
  it('registers and logs in a new user', () => {
    const username = `e2e-user-${Date.now()}`;
    const password = 'test123';

    cy.visit('http://localhost:4200');

    cy.get('#username').type(username);
    cy.get('#password').type(password);

    cy.contains('button', 'Registrieren').click();

    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password);

    cy.contains('button', 'Login').click();

    cy.contains(`Angemeldet als ${username}`).should('be.visible');
    cy.contains('button', 'Logout').should('be.visible');
  });

  it('creates, edits and deletes a habit', () => {
    const username = `e2e-habit-${Date.now()}`;
    const password = 'test123';

    cy.visit('http://localhost:4200');

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.contains('button', 'Registrieren').click();

    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.contains('button', 'Login').click();

    cy.contains(`Angemeldet als ${username}`).should('be.visible');

    cy.get('input[placeholder="Name des Habits"]').type('Joggen');

    cy.get('select').eq(0).select('Sport');
    cy.get('select').eq(1).select('positive');

    cy.contains('button', 'Habit hinzufügen').click();

    cy.contains('li', 'Joggen')
      .should('contain', 'positive')
      .and('contain', 'Sport');

    cy.contains('li', 'Joggen')
      .contains('button', 'Bearbeiten')
      .click();

    cy.get('input[placeholder="Name des Habits"]')
      .clear()
      .type('Laufen');

    cy.contains('button', 'Änderungen speichern').click();

    cy.contains('li', 'Laufen').should('be.visible');
    cy.contains('li', 'Joggen').should('not.exist');

    cy.contains('li', 'Laufen')
      .contains('button', 'Löschen')
      .click();

    cy.contains('li', 'Laufen').should('not.exist');
  });

  it('plans and completes a positive habit', () => {
    const username = `e2e-calendar-${Date.now()}`;
    const password = 'test123';

    cy.visit('http://localhost:4200');

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.contains('button', 'Registrieren').click();

    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.contains('button', 'Login').click();

    cy.contains(`Angemeldet als ${username}`).should('be.visible');

    cy.get('input[placeholder="Name des Habits"]').type('Joggen');
    cy.get('select').eq(0).select('Sport');
    cy.get('select').eq(1).select('positive');
    cy.contains('button', 'Habit hinzufügen').click();

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .click();

    cy.contains('Ausgewählter Tag: 15.').should('be.visible');

    cy.contains('h3', 'Habit planen')
      .parent()
      .find('select')
      .select('Joggen');

    cy.contains('button', 'Habit planen').click();

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .parent()
      .should('contain', 'Joggen - planned');

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .parent()
      .contains('button', 'Erledigt')
      .click();

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .parent()
      .should('contain', 'Joggen - completed');
  });

  it('tracks a negative habit and shows it in statistics', () => {
    const username = `e2e-negative-${Date.now()}`;
    const password = 'test123';

    cy.visit('http://localhost:4200');

    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.contains('button', 'Registrieren').click();

    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.contains('button', 'Login').click();

    cy.contains(`Angemeldet als ${username}`).should('be.visible');

    cy.get('input[placeholder="Name des Habits"]').type('Fast Food');
    cy.get('select').eq(0).select('Ernährung');
    cy.get('select').eq(1).select('negative');
    cy.contains('button', 'Habit hinzufügen').click();

    cy.contains('li', 'Fast Food')
      .should('contain', 'negative')
      .and('contain', 'Ernährung');

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .click();

    cy.contains('h3', 'Habit planen')
      .parent()
      .find('select')
      .select('Fast Food');

    cy.contains('button', 'Negatives Ereignis eintragen').click();

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .parent()
      .should('contain', 'Fast Food - occurred');

    cy.contains('h3', 'Negative Habits').should('be.visible');

    cy.contains('h4', 'Fast Food')
      .parent()
      .should('contain', 'Vorkommnisse: 1');
  });
});