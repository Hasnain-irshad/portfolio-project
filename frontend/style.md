# Portfolio Design System Reference

This document defines the **visual design system** for the portfolio website.
All UI components must follow this style guide to maintain a **consistent modern portfolio aesthetic** similar to the provided reference design.

---

# 1. Core Color Palette

Primary theme is **dark with strong orange accent**.

```css
:root {
  --color-background: #0f0f10;
  --color-surface: #1b1b1d;
  --color-surface-soft: #242427;

  --color-primary: #f2652a;
  --color-primary-hover: #ff7a42;

  --color-text-main: #ffffff;
  --color-text-secondary: #b8b8b8;

  --color-border: #2c2c2f;

  --color-shadow: rgba(0,0,0,0.4);
}
```

Design philosophy:

* Dark UI for modern developer aesthetic
* Orange used only as **highlight color**
* Avoid overusing the primary color

---

# 2. Typography

Use a **modern sans-serif font**.

Recommended fonts:

* Inter
* Poppins
* Montserrat

Example CSS:

```css
body {
  font-family: "Poppins", sans-serif;
  background-color: var(--color-background);
  color: var(--color-text-main);
}
```

Typography scale:

| Element       | Size | Weight |
| ------------- | ---- | ------ |
| Hero Title    | 48px | 700    |
| Section Title | 36px | 600    |
| Card Title    | 20px | 600    |
| Body Text     | 16px | 400    |
| Small Text    | 14px | 400    |

---

# 3. Layout Structure

The layout should follow a **split hero layout**:

Left side:

* Portfolio introduction
* Title
* subtitle
* CTA button

Right side:

* Profile image
* orange abstract background shape

Example structure:

```
Hero Section
------------------------------
| Text Content | Profile Img |
------------------------------
```

---

# 4. Hero Section Styling

Hero background should be dark.

Profile image area should contain **large orange abstract shape behind image**.

Example CSS concept:

```css
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 90vh;
  align-items: center;
}

.hero-image-container {
  position: relative;
}

.hero-accent-shape {
  position: absolute;
  width: 600px;
  height: 600px;
  background: var(--color-primary);
  border-radius: 40% 60% 70% 30% / 30% 40% 60% 70%;
  right: -100px;
  top: -50px;
  z-index: 0;
}
```

---

# 5. Button Style

Primary CTA buttons should use **orange accent**.

```css
.button-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 14px 26px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}
```

Button style principles:

* Rounded corners
* Smooth hover animation
* Subtle elevation

---

# 6. Card Design (Blogs / Projects / Publications)

Cards should follow this structure:

```css
.card {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--color-border);
  transition: all 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px var(--color-shadow);
}
```

Card layout example:

```
-------------------------
| Image                  |
| Title                  |
| Short description      |
| Tags                   |
| Read More →            |
-------------------------
```

---

# 7. Section Spacing

Sections must maintain generous whitespace.

```css
.section {
  padding: 100px 10%;
}
```

---

# 8. Navigation Style

Navbar should be minimal.

```css
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 24px 10%;
}

.nav-links a {
  color: var(--color-text-secondary);
  margin-left: 20px;
  text-decoration: none;
}

.nav-links a:hover {
  color: var(--color-primary);
}
```

---

# 9. Animations

Use **smooth subtle animations only**.

Recommended library:

```
framer-motion
```

Examples:

* fade-in
* slide-up
* card hover lift
* button hover animation

Avoid excessive motion.

---

# 10. Design Principles

The UI should follow these principles:

Modern developer portfolio aesthetic

Dark theme dominance

Orange accent used sparingly

Clean typography

Large whitespace

Smooth animations

Minimalistic layout

Professional feel

---

# 11. Responsive Design

Breakpoints:

```
Desktop: 1200px+
Tablet: 768px
Mobile: 480px
```

Hero layout should collapse on mobile:

```
Text
Image
```

---

# Final Goal

The final UI should resemble a **modern professional developer portfolio** with:

* dark interface
* orange highlight theme
* strong hero section
* smooth animations
* clean card-based content sections
* minimal clutter
