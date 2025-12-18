# Feature development workflow

---

## Workflow Steps

### [x] Step: Requirements

Your job is to generate a Product Requirements Document based on the feature description,

First, analyze the provided feature definition and determine unclear aspects. For unclear aspects: - Make informed guesses based on context and industry standards - Only mark with [NEEDS CLARIFICATION: specific question] if: - The choice significantly impacts feature scope or user experience - Multiple reasonable interpretations exist with different implications - No reasonable default exists - Prioritize clarifications by impact: scope > security/privacy > user experience > technical details

Ask up to 5 most priority clarifications to the user. Then, create the document following this template:

```
# Feature Specification: [FEATURE NAME]


## User Stories*


### User Story 1 - [Brief Title]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

## Requirements*

## Success Criteria*

```

Save the PRD into `c:\Users\edib1\Documents\Portfolio\.zencoder\chats\d64fad01-92d1-470d-91ff-cf3ba1949953/requirements.md`.

### [x] Step: Technical Specification

Spec created at: `spec.md`

### [ ] Step: Phase 1 - Replace Competences Section HTML

**Task**: Replace existing grid-based skills layout with new carousel and soft skills card design

**References**: 
- Spec: Delivery Phases > Phase 1
- Contracts: HTML Structure Contracts (Carousel Slide, Soft Skills Card)

**Instructions**:
1. Open `index.html` (lines 336-561)
2. Locate current `<section id="competences">` with `.competences-container` class
3. Replace entire section with new structure:
   - Previous section divider (link to #competences)
   - Section header with h2 icon and subtitle
   - Bootstrap carousel with ID `competenceIconCarousel`
   - 5 carousel items, each containing 4 skill items (icon, title, description)
   - Carousel controls (prev/next buttons with aria-labels)
   - Soft skills separator (hr.softskills-separator)
   - 8 soft skills cards in responsive grid (col-6 col-md-4 col-lg-3)
   - Next section divider (link to #projets)
4. Use provided code from user as reference (lines 1-236)
5. Keep all Font Awesome icons, content, and descriptions

**Deliverable**: Updated `index.html` with new carousel layout

**Verification**:
- [ ] HTML is valid (no console errors in DevTools)
- [ ] Carousel renders without layout shift
- [ ] All 5 slides contain correct content
- [ ] 8 soft skills cards display correctly
- [ ] Navigation dividers are visible and clickable
- [ ] No missing closing tags

### [ ] Step: Phase 2 - Verify and Enhance CSS Styles

**Task**: Ensure CSS styles are complete for carousel and soft skills cards

**References**:
- Spec: Delivery Phases > Phase 2
- Existing CSS: style.css (lines 1001-1102)

**Instructions**:
1. Open `style.css`
2. Verify carousel control styles exist (`.carousel-control-prev`, `.carousel-control-next`)
3. Verify softskill-card hover animations exist
4. Check for responsive breakpoints for carousel spacing
5. Ensure separator styling is present
6. Add any missing transition effects for smooth animations
7. No new CSS should be needed if all styles are already defined

**Deliverable**: Complete, validated CSS (no modifications needed if styles exist)

**Verification**:
- [ ] CSS has no syntax errors
- [ ] Carousel controls are visible
- [ ] Soft skills cards have hover effects
- [ ] Responsive design verified at 375px, 768px, 1200px

### [ ] Step: Phase 3 - Test Carousel Functionality

**Task**: Verify carousel behavior (auto-rotation, manual controls, accessibility)

**References**:
- Spec: Delivery Phases > Phase 3

**Instructions**:
1. Open portfolio in browser (localhost or file://)
2. Scroll to competences section
3. Test carousel controls:
   - Click "Suivant" button → next slide appears
   - Click "Précédent" button → previous slide appears
   - Test wrapping (last slide → first slide)
4. Test auto-rotation:
   - Wait 5 seconds → carousel should auto-advance
   - Hover over carousel → auto-rotation should pause
   - Move mouse away → auto-rotation should resume
5. Test keyboard navigation:
   - Click carousel
   - Press arrow keys → should navigate slides
6. No manual code changes needed (Bootstrap carousel auto-initializes)

**Deliverable**: Verified carousel functionality

**Verification**:
- [ ] Manual controls work (prev/next)
- [ ] Auto-rotation occurs every 5 seconds
- [ ] Pause on hover works
- [ ] Keyboard navigation works
- [ ] No console errors

### [ ] Step: Phase 4 - Verify Responsive Design

**Task**: Test responsive design on all breakpoints and devices

**References**:
- Spec: Delivery Phases > Phase 4

**Instructions**:
1. Open portfolio in browser
2. Use DevTools responsive design mode to test:
   - **Mobile (375px)**: 
     - Soft skills show 2 columns (col-6)
     - Carousel items stack properly
     - Text is readable
   - **Tablet (768px)**:
     - Soft skills show 3 columns (col-md-4)
     - Carousel spacing appropriate
   - **Desktop (1200px)**:
     - Soft skills show 4 columns (col-lg-3)
     - Full carousel width utilized
3. Test actual devices if available
4. Verify section navigation works on mobile
5. No horizontal scroll on any breakpoint

**Deliverable**: Verified responsive design across all breakpoints

**Verification**:
- [ ] Mobile layout correct (2 columns)
- [ ] Tablet layout correct (3 columns)
- [ ] Desktop layout correct (4 columns)
- [ ] No horizontal scroll
- [ ] Section navigation works
- [ ] Text readable without zooming

### [ ] Step: Final Verification & Testing

**Task**: Complete end-to-end testing and verification

**References**:
- Spec: Verification Strategy > End-to-End Verification

**Instructions**:
1. Perform complete user flow:
   - Navigate to competences section from sidebar
   - View all carousel slides
   - Test carousel interactions
   - View soft skills cards
   - Navigate to next section using divider link
2. Test on multiple browsers:
   - Chrome, Firefox, Safari (if available)
3. Run Lighthouse audit (DevTools > Lighthouse)
4. Check for console errors/warnings
5. Verify visual consistency with other portfolio sections
6. Test on mobile device if possible

**Deliverable**: Fully tested and verified feature

**Verification Checklist**:
- [ ] HTML structure valid
- [ ] Carousel displays all 5 slides
- [ ] Carousel controls work
- [ ] Auto-rotation works
- [ ] Soft skills cards display correctly
- [ ] Responsive design at all breakpoints
- [ ] No console errors
- [ ] Smooth animations
- [ ] Section navigation works
- [ ] Visual consistency maintained
- [ ] Lighthouse score > 90
