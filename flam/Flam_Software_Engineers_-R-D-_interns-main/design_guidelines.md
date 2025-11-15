# Design Guidelines: Real-Time Computer Vision Web Application

## Design Approach: Technical Utility System

**Selected Approach**: Developer Tool Aesthetic inspired by Linear, VS Code, and technical documentation sites
**Rationale**: This is a performance-focused technical demonstration requiring precise data visualization, real-time rendering feedback, and developer-friendly controls.

**Core Principles**:
- Prioritize functional clarity over visual decoration
- Technical precision in data display and controls
- Dark-first design for reduced eye strain during extended use
- Minimal cognitive load with clear information hierarchy

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Base: `220 15% 12%` (Deep slate)
- Background Elevated: `220 15% 16%` (Card surfaces)
- Background Interactive: `220 15% 20%` (Hover states)
- Primary Accent: `142 76% 56%` (Emerald for active/processing indicators)
- Text Primary: `220 10% 95%` (High contrast)
- Text Secondary: `220 10% 65%` (Muted text)
- Border Subtle: `220 15% 25%` (Dividers)
- Error/Warning: `0 84% 60%` (Alert red)
- Success: `142 76% 56%` (Processing active)

**Light Mode (Secondary)**:
- Background Base: `220 15% 98%`
- Background Elevated: `0 0% 100%`
- Primary Accent: `142 71% 45%`
- Text Primary: `220 15% 15%`
- Text Secondary: `220 10% 45%`

### B. Typography

**Font Stack**:
- Primary: 'Inter' (via Google Fonts) - UI elements, body text
- Monospace: 'JetBrains Mono' (via Google Fonts) - Technical data, FPS counters, stats

**Type Scale**:
- Display (Frame Stats): 3xl (30px), font-bold, tracking-tight
- Heading (Section Titles): xl (20px), font-semibold
- Body (Controls, Labels): base (16px), font-medium
- Caption (Technical Details): sm (14px), font-normal
- Code (Processing Data): sm (14px), font-mono

### C. Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing (UI density): p-2, gap-2
- Standard component padding: p-4, p-6
- Section spacing: py-8, py-12
- Large separations: mt-16, mb-16

**Grid Structure**:
- Main viewport split: 70/30 or 75/25 (Canvas area / Control panel)
- Canvas area: Full-bleed rendering surface
- Control sidebar: Fixed width (320px-380px) on desktop, drawer on mobile
- Stats overlay: Floating positioned absolutely over canvas

### D. Component Library

**Core UI Elements**:

1. **Video Canvas Area**:
   - Full-height WebGL rendering surface with subtle border
   - Aspect ratio maintained (16:9 or 4:3 based on camera)
   - Dark background (220 15% 8%) when inactive
   - Loading state with skeleton pulse animation

2. **Control Panel** (Fixed sidebar):
   - Glass-morphism subtle background: backdrop-blur-xl with bg-opacity-90
   - Grouped control sections with dividers
   - Toggle switches for processing modes (Tailwind custom components)
   - Slider controls for threshold adjustments
   - Button group for shader selection

3. **Stats Overlay** (Floating):
   - Semi-transparent card (bg-black/80) positioned top-left of canvas
   - Monospace typography for numerical data
   - Real-time updating values with subtle color coding:
     - Green (>30 FPS), Yellow (15-30 FPS), Red (<15 FPS)
   - Grid layout for organized stat display

4. **Navigation Bar** (Top):
   - Minimal height (64px)
   - Logo/title left-aligned
   - Camera permission status indicator
   - Theme toggle icon button right-aligned
   - Border-bottom subtle divider

5. **Processing Toggles**:
   - Segmented control design (pill-shaped button group)
   - Active state: Primary accent background
   - Inactive: Transparent with border
   - Labels: "Raw Feed" | "Edge Detection" | "Grayscale"

6. **Shader Effect Cards**:
   - Compact card design (p-4)
   - Effect preview thumbnail (optional small canvas preview)
   - Radio button or checkbox selection
   - Hover: Elevated shadow, border accent color

**Data Displays**:
- FPS Counter: Large monospace display with color-coded background
- Frame Resolution: Small label with actual dimensions
- Processing Time: Millisecond precision in monospace
- Camera Status: Dot indicator (green/red) with label

**Interactive Elements**:
- Primary Button: Solid primary accent, px-6 py-3, rounded-lg, font-semibold
- Secondary Button: Outline variant with accent border, backdrop-blur
- Icon Buttons: 40x40px touch target, rounded-full, ghost style
- Toggle Switch: Custom Tailwind implementation, accent color when active

### E. Responsive Behavior

**Desktop (1280px+)**:
- Side-by-side layout: Canvas (70%) + Control Panel (30%)
- Stats overlay: Top-left of canvas, fixed position
- All controls visible simultaneously

**Tablet (768px-1279px)**:
- Canvas full-width, control panel in bottom sheet/drawer
- Stats overlay remains on canvas
- Floating action button to toggle controls

**Mobile (<768px)**:
- Canvas: Full viewport height minus nav
- Controls: Bottom drawer (swipe up to reveal)
- Stats: Condensed version, top-left corner
- Larger touch targets (48px minimum)

---

## Key Interactions & States

**Camera Activation Flow**:
1. Permission request modal (centered overlay)
2. Loading spinner during camera initialization
3. Preview frame with "Start Processing" CTA
4. Active processing state with live feed

**Processing State Indicators**:
- Idle: Gray neutral tones
- Processing: Pulsing accent color on relevant controls
- Error: Red border on canvas with error message overlay

**Performance Visualization**:
- FPS graph mini-chart (optional sparkline in stats card)
- Processing time history (last 10 frames average)
- Frame drop warnings (brief toast notification)

**Shader Preview**:
- Real-time shader application on canvas
- Smooth transition between effects (0.2s ease)
- Visual feedback on shader selection (border highlight)

---

## Technical Aesthetic Elements

**WebGL Canvas Styling**:
- Clean edges with 1px border (border-slate-700)
- Subtle inner shadow for depth perception
- Background pattern when no feed (dot grid or subtle noise)

**Monospace Data Display**:
- All technical numbers in JetBrains Mono
- Tabular figures for alignment
- Color-coded severity (green/yellow/red based on thresholds)

**Control Grouping**:
- Logical sections: Camera Controls | Processing Options | Shader Effects | Stats
- Section headers: Small caps, text-slate-400, border-b divider
- Vertical spacing: 8 units between groups

**Loading & Error States**:
- Skeleton loaders for camera feed (animated gradient pulse)
- Error boundary with retry button centered on canvas
- Toast notifications for non-critical updates (top-right, auto-dismiss)

---

## Accessibility & Polish

- High contrast ratios (WCAG AAA for text on backgrounds)
- Keyboard navigation: Tab through all controls, Enter to activate
- Focus indicators: 2px accent color ring with offset
- Screen reader labels for all interactive elements
- Reduced motion: Disable transitions when prefers-reduced-motion is active
- Camera permission handling with clear instructions

**Animations** (Minimal, purposeful):
- Stat updates: Quick number flip animation (0.15s)
- Shader switch: Subtle crossfade (0.2s ease-in-out)
- Control panel slide: Smooth drawer animation (0.3s ease-out)
- NO decorative animations, NO parallax, NO scroll-triggered effects

---

## Implementation Notes

This is a technical demonstration tool - every pixel should serve a functional purpose. The design emphasizes clarity, performance data visibility, and precise control over processing parameters. The dark aesthetic reduces eye strain during extended testing sessions while maintaining excellent readability for all technical data displays.