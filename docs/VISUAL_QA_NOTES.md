# Visual QA Notes

## Desktop preview

The landing page renders successfully at the temporary preview URL. The header, Return Arc vector mark, announcement bar, hero headline, hero athlete image, dual CTA, LINE floating action, and brand palette all display as intended.

The hero uses a strong asymmetric split and maintains clear contrast. The athlete image is intentionally dark and desaturated; the circular return-arc treatment remains visible without competing with the headline. The values section transitions cleanly from Obsidian to Bone and retains the four-column editorial rhythm on desktop.

The first screenshot captured the hero in a stable state. The second screenshot was taken while reveal transitions were still in progress after scrolling; a follow-up stabilized screenshot is required before final visual sign-off.

## Mid-page verification

After reveal animations settle, the values heading and four value columns are fully legible with strong hierarchy. The transition into the New Arrivals section is clean. The four-card product grid remains aligned, pricing is readable, and the monochrome placeholder treatment communicates an intentionally premium catalog state until Shopify product photography is configured. The fixed LINE CTA stays clear without covering essential content.

## Mobile verification

The first 390×844 capture revealed that the closed mobile navigation panel was still partially visible above the header. The responsive CSS was corrected to use opacity, visibility, and pointer-event states instead of moving the panel far above the viewport. A second capture confirms that the announcement bar, brand lockup, hamburger button, hero image, vertical campaign label, and floating LINE control now render without overlap. The hero intentionally presents the image before the headline on mobile; the headline begins below the fold to keep the opening frame cinematic and uncluttered.

## Automated quality checks

| Check | Result |
|---|---|
| HTML validation | Passed |
| JavaScript syntax | Passed |
| Shopify Theme Check | Passed with 0 errors; 11 inherited Dawn warnings |
| Integration TypeScript check | Passed |
| Integration unit tests | 4/4 passed |
| Lighthouse Performance | 90 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |

The remaining performance variance is driven primarily by the externally hosted Google Fonts and the large above-the-fold hero composition in a cold, throttled Lighthouse run. The production Shopify theme avoids the Google Fonts dependency and uses Shopify/system font delivery.
