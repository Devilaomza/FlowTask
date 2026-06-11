---
name: FlowTask Design System
description: A high-efficiency, dark-mode first design system for task management.
colors:
  primary: "#6366f1"
  secondary: "#a855f7"
  neutral-bg: "#020617"
  neutral-ink: "#f1f5f9"
  neutral-border: "#1e293b"
  neutral-muted: "#94a3b8"
typography:
  display:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist Sans, Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-ink}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
  card:
    backgroundColor: "#0f172a"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: FlowTask

## 1. Overview

**Creative North Star: "The Focused Console"**

The Focused Console is a dark, low-distraction HUD environment with precise controls and typography. It is engineered specifically for tech-focused professionals and developers who require a workspace that fosters flow state and expert control. Rather than relying on heavy decoration, it uses high-contrast layouts, generous information hierarchy, and restrained typography.

This design system explicitly rejects SaaS landing-page clichés such as side-stripe borders, excessive card lines, overly rounded bubbles, and saturated cream/beige backgrounds.

**Key Characteristics:**
- Dark HUD styling with a deep canvas background (slate-950).
- Pure high-contrast typography and subtle dividers to define structure.
- High utility with tactile and confident interaction states.
- Calm and purposeful motion with clean fade/slide transitions.

## 2. Colors

A deep, high-efficiency palette utilizing cool-slate dark tones paired with vibrant purple-indigo indicators.

### Primary
- **Console Indigo** (#6366f1): The main action color used for primary buttons, selection rings, and high-priority states.

### Secondary
- **Focus Purple** (#a855f7): The accent highlight, used for secondary actions, completed progress indicators, and visual emphasis.

### Neutral
- **Deep Slate Canvas** (#020617): The default background of the entire dashboard environment.
- **Console Surface** (#0f172a): The background color for interactive cards, containers, and sections.
- **Ink White** (#f1f5f9): High-contrast primary text color.
- **Muted Steel** (#94a3b8): Secondary supporting text, placeholders, and descriptive labels.
- **Wireframe Border** (#1e293b): Default thin line border for defining components.

### Named Rules
**The Rarity Accent Rule.** Indigo and Purple accents are used sparingly (≤10% of total surface area). Their rarity is the point—ensuring that primary CTAs and active states command immediate attention.

## 3. Typography

**Display Font:** Geist Sans (with Inter, system-ui fallback)
**Body Font:** Geist Sans (with Inter, system-ui fallback)

**Character:** Modern geometric sans-serif prioritizing absolute legibility and precise character tracking.

### Hierarchy
- **Display** (800, 2.25rem, 1.2): Title headers only (e.g., app name FlowTask).
- **Headline** (700, 1.5rem, 1.3): Major page section headings.
- **Title** (600, 1.125rem, 1.4): Card titles and dialog headers.
- **Body** (400, 0.875rem, 1.5): Standard task descriptions and copy. Max line length: 70ch.
- **Label** (600, 0.75rem, 0.05em, uppercase): Table headings, filters, progress tracker labels.

## 4. Elevation

The system uses a hybrid model of flat surfaces with ambient backdrop-blurs (glassmorphism) and subtle shadows showing elevation/hover states.

### Shadow Vocabulary
- **Control Shadow** (`box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`): Default subtle shadow for buttons and inputs.
- **Elevated Hover** (`box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`): Dynamic shadow applied during card hover events to simulate elevation.

### Named Rules
**The Resting Flat Rule.** Elements rest flat on the Console Surface at z-index 0. Shadows and glow effects are only triggered dynamically by hover, focus, or overlay states.

## 5. Components

### Buttons
- **Shape:** Medium rounded corner (12px / rounded-xl)
- **Primary:** Console Indigo background, Ink White text. Padding: 10px 20px (0.625rem 1.25rem).
- **Hover / Focus:** Transitions to Focus Purple background with active scaling (98%).

### Cards / Containers
- **Corner Style:** Large rounded corner (16px / rounded-2xl)
- **Background:** Console Surface at 50% opacity with backdrop-blur.
- **Shadow Strategy:** Resting flat, elevated hover shadow on task items.
- **Border:** Wireframe Border (1px).
- **Internal Padding:** 24px (1.5rem).

### Inputs / Fields
- **Style:** Console Surface background, Wireframe Border, medium rounded corner (12px).
- **Focus:** Console Indigo border glow, 2px ring.

## 6. Do's and Don'ts

### Do:
- **Do** maintain a strict contrast ratio of at least 4.5:1 for body and placeholder texts against their backgrounds.
- **Do** use native dialog tags and absolute positioning to prevent element clipping in overflow contexts.
- **Do** align components to a consistent 8px/16px/24px spacing grid.

### Don't:
- **Don't** use colored left/right side-stripe borders as highlights on cards or task elements.
- **Don't** apply text gradients or gradient-to-transparent text masking.
- **Don't** animate image scale or rotate transformations on hover.
- **Don't** use cream, beige, paper, or ivory background tones.
