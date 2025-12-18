# Feature Specification: Remove Call and Email Buttons from About Section

## User Stories

### User Story 1 - Simplify About Section
**Acceptance Scenarios**:
1. **Given** the about section is displayed, **When** the user views the profile card, **Then** the Email and Call buttons are not visible
2. **Given** the page is loaded, **When** the user scrolls to the about section, **Then** only the Download CV button remains in the profile card

---

## Requirements

- **Functional**: Remove the Email button and Call button from the about section profile card
- **Technical**: Delete the HTML elements for the email and call action buttons
- **Scope**: About section (id="about-section") only - no other sections affected
- **Backward Compatibility**: No CSS or JavaScript changes needed

## Success Criteria

1. Email button (`<a href="mailto:...">`) is removed
2. Call button (`<a href="tel:...">`) is removed
3. Download CV button remains functional
4. Profile card layout remains intact and responsive
5. No console errors after change
