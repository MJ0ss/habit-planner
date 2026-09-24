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

    cy.contains('.habit-item', 'Joggen')
      .should('contain', 'Positiv')
      .and('contain', 'Sport');

    cy.contains('.habit-item', 'Joggen')
      .contains('button', 'Bearbeiten')
      .click();

    cy.get('input[placeholder="Name des Habits"]')
      .clear()
      .type('Laufen');

    cy.contains('button', 'Änderungen speichern').click();

    cy.contains('.habit-item', 'Laufen').should('be.visible');
    cy.contains('.habit-item', 'Joggen').should('not.exist');

    cy.contains('.habit-item', 'Laufen')
      .contains('button', 'Löschen')
      .click();

    cy.contains('.habit-item', 'Laufen').should('not.exist');
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

    cy.get('.planning-section')
      .find('select')
      .select('Joggen');

    cy.contains('button', 'Habit planen').click();

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .parent()
      .should('contain', 'Joggen - Geplant');

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
      .should('contain', 'Joggen - Erledigt');
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

    cy.contains('.habit-item', 'Fast Food')
      .should('contain', 'Negativ')
      .and('contain', 'Ernährung');

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .click();

    cy.get('.planning-section')
      .find('select')
      .select('Fast Food');

    cy.contains('button', 'Negatives Ereignis eintragen').click();

    cy.get('.day')
      .not('.empty')
      .contains('strong', '15')
      .parent()
      .should('contain', 'Fast Food - Eingetreten');

    cy.contains('h3', 'Negative Habits').should('be.visible');

    cy.contains('h4', 'Fast Food')
      .parent()
      .should('contain', 'Vorkommnisse')
      .and('contain', '1');
  });
});