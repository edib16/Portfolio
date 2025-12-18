# Technical Specification: Skills Section Redesign with Carousel

## Technical Context

**Language/Framework**: HTML5, CSS3 (Poppins & Raleway fonts), JavaScript (vanilla)

**Primary Dependencies**:
- Bootstrap 5.3.3 (carousel component)
- Font Awesome 6.0.0 (skill icons)
- Existing portfolio CSS framework with gradient backgrounds, color palette (#0b3d91, #2563eb, #16a34a, etc.)

**Existing Code Style**:
- Uses Bootstrap utility classes extensively
- Custom CSS with gradients, shadows, and transition effects
- Responsive grid layouts (col-6, col-md-4, col-lg-3)
- Section-based architecture with full-viewport sections (100vh height)
- Animation: `.section-animate` class for fade/slide on scroll

---

## Technical Implementation Brief

### Key Technical Decisions

1. **Carousel Component**: Use Bootstrap 5.3.3 native carousel (already available in project)
   - No new dependencies needed
   - Supports auto-rotation, manual controls, and accessibility out-of-the-box

2. **Layout Strategy**:
   - Replace existing grid-based skills layout with carousel + soft skills cards
   - Maintain existing section divider navigation (prev/next arrows)
   - Use existing CSS color scheme and design patterns

3. **Soft Skills Cards**:
   - Convert from simple badges to styled cards (leverage existing `.softskill-card` class)
   - Use CSS Grid for responsive layout (already partially defined)
   - Responsive columns: 2 (mobile), 3 (tablet), 4 (desktop)

4. **Styling Approach**:
   - Leverage existing CSS patterns (gradients, shadows, transitions)
   - Add carousel-specific customizations for icons
   - Reuse animation classes (`.section-animate`, scroll-reveal)
   - Maintain visual hierarchy with separator (hr element)

5. **No JavaScript Changes Required**:
   - Bootstrap carousel auto-initializes with `data-bs-ride="carousel"`
   - Existing scroll animation will apply automatically
   - No custom JS needed for carousel functionality

---

## Source Code Structure

```
index.html (lines 322-561)
├── Section divider link (navigation to competences)
└── <section id="competences">
    ├── Header (h2 with icon, subtitle)
    ├── Carousel (#competenceIconCarousel)
    │   ├── 5 carousel-items (slides)
    │   │   ├── 4 skill items per slide
    │   │   │   ├── Icon (Font Awesome)
    │   │   │   ├── Title
    │   │   │   └── Description
    │   └── Controls (prev/next buttons, visually hidden labels)
    ├── Visual separator (hr.softskills-separator)
    ├── Soft Skills section
    │   ├── h4.softskills-title with icon
    │   └── Grid of 8 cards (col-6 col-md-4 col-lg-3)
    │       ├── Icon (Font Awesome fa-2x)
    │       ├── Title
    │       └── Description
    └── Section divider link (navigation to projets)

style.css
├── #competenceIconCarousel styles (lines 1001-1028)
│   ├── Carousel control customizations
│   ├── Icon styling for carousel
│   └── Hover effects
├── .softskill-card styles (lines 1083-1091)
│   ├── Card background and border-radius
│   ├── Shadow and transform on hover
├── .softskills-separator styles (lines 1094-1102)
│   └── Gradient separator between carousel and cards

script.js
└── No new changes needed (Bootstrap carousel self-initializes)
```

---

## Contracts

### Data Model: Skill Item
```javascript
{
  icon: "fa-brands fa-linux",        // Font Awesome class
  title: "Linux",                     // Skill name
  description: "Administration & scripts"  // Description
}
```

### Data Model: Soft Skill Card
```javascript
{
  icon: "fa-solid fa-users",          // Font Awesome icon class
  title: "Travail en équipe",         // Soft skill name
  description: "Collaboration sur des projets collectifs"  // Description
}
```

### HTML Structure Contracts

**Carousel Slide**:
```html
<div class="carousel-item active/inactive">
  <div class="d-flex justify-content-center gap-5 flex-wrap">
    <!-- 4 skill items with icon, title, description -->
  </div>
</div>
```

**Soft Skills Card**:
```html
<div class="col-6 col-md-4 col-lg-3">
  <div class="card h-100 shadow-sm border-0 text-center py-3 softskill-card">
    <i class="fa-solid fa-{icon} fa-2x text-{color} mb-2"></i>
    <div class="fw-bold mb-1">{Title}</div>
    <div class="small text-muted">{Description}</div>
  </div>
</div>
```

---

## Delivery Phases

### Phase 1: Replace Competences Section HTML
**Deliverable**: Updated `index.html` with new carousel and soft skills layout

**Tasks**:
1. Remove existing `.competences-container` grid layout (lines 338-561)
2. Insert new structure with:
   - Previous section divider
   - Section header (h2 with icon)
   - Bootstrap carousel with 5 slides
   - Carousel controls (prev/next buttons)
   - Soft skills separator (hr)
   - 8 soft skills cards in responsive grid
   - Next section divider
3. Maintain all content from original 5 categories and 8 soft skills

**Verification**:
- HTML is valid (no console errors)
- Carousel renders without layout shift
- All 5 slides contain correct content
- 8 soft skills cards display correctly
- Navigation dividers are visible

---

### Phase 2: Add/Update CSS Styles
**Deliverable**: Enhanced `style.css` with carousel and card animations

**Tasks**:
1. Verify/enhance existing carousel styles (`.carousel-control-prev/next`, custom icons)
2. Ensure softskill-card styling is complete with:
   - Card background gradient
   - Shadow effects
   - Hover animations (translateY, scale)
3. Add responsive breakpoints for carousel spacing
4. Ensure separator styling is consistent
5. Add smooth transition animations

**Verification**:
- CSS lint passes (no syntax errors)
- Carousel controls are visible and properly styled
- Soft skills cards have smooth hover effects
- Responsive design works (test at 375px, 768px, 1200px)
- No visual regressions

---

### Phase 3: Verify Carousel Functionality
**Deliverable**: Working carousel with auto-rotation and manual controls

**Tasks**:
1. Verify Bootstrap carousel initializes automatically
2. Test carousel controls:
   - Previous button navigates to previous slide
   - Next button navigates to next slide
   - Carousel wraps around (last → first, first → last)
3. Verify auto-rotation:
   - Carousel auto-rotates every 5 seconds
   - Auto-rotation pauses on hover/interaction
   - Auto-rotation resumes when interaction ends
4. Test keyboard accessibility:
   - Arrow keys navigate carousel (Bootstrap default)
   - Tab navigation works

**Verification**:
- Manual tests in browser (Chrome, Firefox)
- No console errors
- Touch controls work on mobile (swipe if available)

---

### Phase 4: Responsive Design Verification
**Deliverable**: Fully responsive carousel and soft skills layout

**Tasks**:
1. Test carousel on mobile (< 768px):
   - Carousel items stack properly
   - Controls are touch-friendly
   - Text size is readable
2. Test soft skills grid on all breakpoints:
   - Mobile (375px): 2 columns (col-6)
   - Tablet (768px): 3 columns (col-md-4)
   - Desktop (1200px): 4 columns (col-lg-3)
3. Verify no overflow or layout shift (CLS = 0)
4. Test section navigation (prev/next dividers) on mobile

**Verification**:
- Responsive design test using browser DevTools
- Test on actual mobile device if possible
- No horizontal scroll
- All text readable without zooming

---

## Verification Strategy

### Unit Verification (Per Phase)

**Phase 1 Verification**:
```bash
# Check for HTML validity
# Use browser DevTools > Inspect Elements
# Verify:
# - No red error indicators
# - All sections render
# - Carousel items visible (inspect DOM)
# - Soft skills cards visible
```

**Phase 2 Verification**:
```bash
# CSS validation
# Use browser DevTools > Styles panel
# Verify:
# - No CSS syntax errors (red indicators)
# - Carousel controls styled correctly
# - Cards have proper shadows and gradients
# - Animations are smooth (60fps)
```

**Phase 3 Verification** (Manual Testing):
```
1. Open portfolio in browser
2. Scroll to competences section
3. Verify carousel displays
4. Click "Suivant" button → should go to next slide
5. Click "Précédent" button → should go to previous slide
6. Wait 5 seconds → carousel should auto-advance
7. Hover over carousel → auto-rotation should pause
8. Move mouse away → auto-rotation should resume
9. Try arrow keys on keyboard → should navigate carousel
```

**Phase 4 Verification** (Responsive Testing):
```
1. Open DevTools > Toggle device toolbar
2. Test at breakpoints:
   - 375px (mobile) - soft skills should show 2 columns
   - 768px (tablet) - soft skills should show 3 columns
   - 1200px (desktop) - soft skills should show 4 columns
3. Check carousel spacing on each breakpoint
4. Verify no horizontal scroll
5. Test section navigation on mobile
6. Use browser's "Responsive Design Mode" or physical devices
```

### End-to-End Verification

After all phases complete:
1. Load portfolio in browser and navigate to competences section
2. Verify visual consistency with other sections
3. Test complete user flow:
   - View carousel slides (all 5)
   - Interact with carousel controls
   - View soft skills cards
   - Navigate to previous/next sections
4. Check on multiple devices:
   - Desktop (Chrome, Firefox, Safari, Edge)
   - Tablet (iPad)
   - Mobile (iPhone/Android)
5. Performance check:
   - Lighthouse audit (target: >90)
   - No console errors/warnings
   - Smooth animations (no jank)

### Testing Checklist
- [ ] HTML structure is valid
- [ ] Carousel displays all 5 slides
- [ ] Carousel controls work (prev/next)
- [ ] Carousel auto-rotates every 5 seconds
- [ ] Auto-rotation pauses on interaction
- [ ] Soft skills cards display in correct grid (2/3/4 columns)
- [ ] Responsive design at all breakpoints
- [ ] No console errors
- [ ] No layout shift (CLS = 0)
- [ ] Smooth animations (no jank)
- [ ] Section navigation works
- [ ] Visual consistency maintained
