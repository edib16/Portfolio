# Feature Specification: Skills Section Redesign with Carousel

## Overview
Replace the current grid-based skills section (with progress bars) with a modern carousel-based design featuring skill icons and soft skills cards.

---

## User Stories

### User Story 1 - View Skills via Interactive Carousel

**Acceptance Scenarios**:

1. **Given** a user visits the portfolio, **When** they navigate to the skills section, **Then** they see a carousel with 5 slides of technical skills displayed with icons and descriptions
2. **Given** the carousel is displayed, **When** the user clicks the next/previous buttons, **Then** the carousel transitions to the next/previous slide smoothly
3. **Given** the carousel is displayed, **When** the page loads, **Then** the carousel auto-rotates every 5 seconds (default Bootstrap carousel behavior)
4. **Given** the carousel is visible, **When** the user hovers over the carousel or interacts with controls, **Then** auto-rotation pauses

### User Story 2 - Browse Soft Skills Cards

**Acceptance Scenarios**:

1. **Given** a user scrolls to the soft skills section, **When** they view the content, **Then** they see 8 soft skills displayed as styled cards in a responsive grid
2. **Given** soft skills cards are displayed, **When** the user resizes the browser to mobile size, **Then** the cards adjust to show 2 columns on mobile (col-6), 3 columns on tablet (col-md-4), and 4 columns on desktop (col-lg-3)
3. **Given** a user views a soft skill card, **When** they look at the card, **Then** they can see the soft skill icon, title, and description

### User Story 3 - Navigate Between Sections

**Acceptance Scenarios**:

1. **Given** the user is viewing the skills section, **When** they click the "Section suivante" link, **Then** they are scrolled to the next section (Projets)
2. **Given** the user scrolls to the top of skills section, **When** the page loads, **Then** they see a divider link pointing to the skills section

---

## Requirements

### Functional Requirements
- **Carousel Implementation**: Replace current grid-based skills layout with Bootstrap carousel displaying 5 slides of technical skills
- **Carousel Controls**: Include previous/next navigation buttons with proper aria-labels for accessibility
- **Carousel Auto-Rotation**: Auto-rotate slides with 5-second interval (Bootstrap default)
- **Carousel Pause on Interaction**: Auto-rotation pauses on hover/interaction
- **Soft Skills Display**: Display 8 soft skills as cards (not simple badges) in a responsive grid
- **Responsive Design**: Ensure carousel and soft skills adapt to mobile, tablet, and desktop viewports
- **Visual Hierarchy**: Separate carousel section from soft skills section with visual divider (HR element)
- **Navigation**: Maintain section dividers (previous and next navigation) for consistency with other sections

### Non-Functional Requirements
- **Performance**: Carousel transitions should be smooth without jank
- **Accessibility**: All carousel controls must have proper aria-labels; keyboard navigation should work
- **Maintainability**: Use Bootstrap 5.3.3 components (carousel already included in current version)
- **Styling**: Maintain consistency with existing portfolio design (Poppins font, color scheme, spacing)
- **Browser Compatibility**: Support all modern browsers (Chrome, Firefox, Safari, Edge)

### Content Requirements
- **Carousel Slides**: 5 slides of technical skills (Linux, Windows Server, Networking, etc.)
- **Soft Skills Cards**: 8 soft skills with icons, titles, and descriptions
- **Icons**: Use Font Awesome 6.0.0 icons (already available in portfolio)

---

## Success Criteria

1. ✅ Current skills grid layout completely replaced with carousel design
2. ✅ Carousel displays 4 skills per slide with proper spacing and alignment
3. ✅ Carousel navigation buttons (prev/next) are functional and properly labeled
4. ✅ Carousel auto-rotates every 5 seconds with pause on interaction
5. ✅ Soft skills section displays as 8 styled cards in a responsive grid
6. ✅ Responsive design works on mobile (< 768px), tablet (768px-1200px), and desktop (> 1200px)
7. ✅ Visual consistency maintained with existing portfolio sections
8. ✅ No console errors or warnings
9. ✅ Page loads without layout shift (CLS = 0)
10. ✅ Smooth animations and transitions (no janky animations)
11. ✅ Section navigation (prev/next dividers) functions correctly
12. ✅ Accessibility requirements met (ARIA labels, keyboard navigation)
