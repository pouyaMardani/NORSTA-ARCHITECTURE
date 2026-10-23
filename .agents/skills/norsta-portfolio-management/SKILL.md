---
name: norsta-portfolio-management
description: Manage the structure, presentation, and implementation of Norsta's real microcement and patina portfolio projects. Use when adding projects, building galleries, organizing portfolio data, or improving project detail pages.
---

# Norsta Portfolio Management

## Portfolio Purpose

- The portfolio is one of the most important parts of the Norsta website.
- Its primary goal is to showcase authentic work through high-quality photography and clear project information.
- Prioritize the visual quality of the finishes and the usability of the gallery.
- Keep portfolio navigation simple and intuitive.
- Do not treat the portfolio as a generic product catalog.

## Authenticity and Approval

- Use real project photographs supplied or approved by the project owner.
- Never fabricate completed projects, customer identities, locations, dates, or technical specifications.
- Never present AI-generated or stock images as real Norsta work.
- Do not publish private customer information without approval.
- If required project information is unavailable, omit it or mark it as awaiting confirmation.
- Do not claim that a project was completed by Norsta unless that fact is confirmed.

## Portfolio Data Model

- Inspect the existing content model before changing it.
- Use a consistent, typed structure for portfolio entries.
- Give each published project a stable, unique slug.
- Keep project data separate from reusable presentation components where practical.
- Define required and optional fields explicitly.
- Avoid requiring details that are not available for every project.

A project may include fields such as:

- slug
- title
- short description
- cover image
- gallery images
- image alternative text
- project category
- finish or technique, when verified
- material details, when verified
- project location, when approved for publication
- completion date, when known
- related articles, when relevant

This list is a starting point, not a requirement to invent missing information.

## Gallery Presentation

- Use consistent and intentional image ratios where suitable.
- Preserve important texture, color, and surface details.
- Select image crops based on the subject rather than using arbitrary positioning.
- Keep gallery layouts visually balanced across screen sizes.
- Provide clear navigation when a gallery contains multiple images.
- Ensure gallery controls work with touch and keyboard input.
- If a lightbox is implemented, support closing it accessibly and returning focus appropriately.
- Prevent gallery controls from obscuring the actual work.

## Image Performance

- Use Next.js image optimization where appropriate.
- Supply meaningful image dimensions or stable aspect ratios.
- Use responsive image sizes suitable for each layout.
- Avoid downloading every full-resolution image on the initial page load.
- Use lazy loading for appropriate below-the-fold images.
- Do not lazy-load the main image responsible for LCP without a justified reason.
- Load larger images on demand when appropriate.
- Verify that image optimization does not noticeably damage surface details.

## Portfolio Routes

- Use consistent, descriptive URLs for project details.
- Ensure every published project links to the correct detail page.
- Handle unknown slugs with an appropriate not-found response.
- Avoid duplicate project routes.
- Keep internal links consistent with the project data.
- Generate static routes when appropriate for the chosen Next.js rendering strategy.

## Homepage Integration

- Feature selected, owner-approved portfolio projects on the homepage.
- Keep featured projects connected to the main portfolio data source.
- Avoid maintaining duplicate copies of the same project information.
- Make the path from a featured project to its detail page clear.
- Do not invent a ranking or label a project as award-winning without evidence.

## Accessibility

- Write useful alt text for informative photographs.
- Avoid repeating identical generic alt text across all images.
- Use accessible names for gallery and lightbox controls.
- Preserve visible keyboard focus.
- Ensure captions and controls remain readable in both supported themes.

## Verification

- Verify that every displayed image exists and loads correctly.
- Check for missing assets and broken project links.
- Review image crops on mobile, tablet, and desktop.
- Test gallery navigation and lightbox interactions where implemented.
- Check image payload sizes and layout stability.
- Validate project data and unique slugs.
- Run relevant lint, type, test, and build checks.

## Completion Standard

The portfolio must display authentic work in a polished, accessible, responsive, and performant way. Never invent project information or mark unverified portfolio content as approved.