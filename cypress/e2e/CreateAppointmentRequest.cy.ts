/// <reference types="cypress" />

describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('client@gmail.com')
    cy.get('input[type="password"]').type('client')
    cy.get('button[type="submit"]').contains('Login to your account').click()
    cy.url().should('include', '/')

    cy.get('a').contains('Haircut').click()

    cy.get('a[type="StylistCard"]').click()
    cy.get('button[type="button"]').click()

    cy.get('input[type="date"]').type('2025-12-11')
    cy.get('input[type="time"]').type('12:30')
    
    cy.get('button[type="submit"]').click()

    cy.contains(
      /Appointment request sent successfully!|You already have a pending booking request/
    ).should('be.visible')
  })
})
