# Vistar Media Dynamic Creative Spec

The functionality and systems described in this spec are considered beta and
are subject to change at any point, without advance notice.

## Contents

1. [Goal](#goal)
2. [What is a Dynamic Creative?](#what-is-a-dynamic-creative)
3. [Considerations](#considerations)
    1. [Packaging](#packaging)
    2. [Loading and Rendering](#loading-and-rendering)
    3. [Distribution](#distribution)
    4. [Signaling](#signaling)
    5. [Proof of Plays and Third Party Verification](#proof-of-plays-and-third-party-verification)
    6. [Media Owner Approvals](#media-owner-approvals)
4. [Example](#example)
    1. [Design Considerations](#design-considerations)
    2. [Technical Considerations](#technical-considerations)

## Goal

Currently there is no standard for serving dynamic creatives programmatically
within DOOH. We believe that having a standard dynamic creative format will be
useful for every player in the DOOH space. In this document we outline an ideal
dynamic creative format that can work reliably on all major DOOH software
stacks.

## What is a Dynamic Creative?

A dynamic creative is a packaged single page web application. Unlike static
creatives, such as images and videos, dynamic creatives must be capable of
loading in a web browser and may run JavaScript to customize the behavior at
the time of serving.

The creative will be served via a "container" - typically a DOOH CMS, or an
offline rendering service. The creative must inform the container when it's
ready to be shown or if it should be skipped, as in the case of an API failure.

## Considerations

### Packaging

* Dynamic creatives must be packaged inside a zip file.
* The zip file containing the dynamic creative should have all assets required
  to render the creative in a browser.
* Any assets loaded from external services shall be subject to standard browser
  Cross-Origin Resource Sharing rules.

### Loading and Rendering

* The creative shall be provided relevant contextual information (latitude,
  longitude, venue id) via the query string / `window.location.search`.
    - Dynamic creatives which are handled by the Vistar renderer will be
      provided the following parameters:
        * `latitude` - Latitude of the requesting venue.
        * `longitude` - Longitude of the requesting venue.
        * `venue_id` - Identifier for the requesting venue.
     - Dynamic creatives will be provided a localized `new Date()`
       geographically relevant to the requesting venue.
* The creative must immediately show valid content when loaded. This content
  will be used as a "fallback" in any case where there is a failure later on in
  the process.
    - The recommended approach is to contain the fallback directly in the body
      of the HTML document and to swap it out when non-fallback content is
      rendered.
* The creative shall take less than **2 seconds** to complete any loading of
  external data or complete any internal computation.
    - It is not recommended to load external web pages served from 3rd party
      services into the dynamic creative in an `<iframe>`. Doing so risks the
      fallback being rendered if the external pages do not load within the
      expected time period.
    - Dynamic creatives may use network resources to `fetch` data from 3rd
      party data APIs for display at render time. All data MUST be fetched,
      parsed, and output to the page within the allotted 2 second window. As
      such, it is recommended to evaluate data partners and 3rd party APIs
      carefully with respect to performance.
* When the creative considers loading to be complete, it must add an element to
  the DOM of the page with the id of `dynamic-creative-ready` as a signal to
  the renderer.
* When the creative adds an element to the DOM with the id of
  `dynamic-creative-skip`, the renderer MAY consider this creative skippable.
    - In the case of the Vistar renderer, this will not apply, and the fallback
      creative will be rendered.
* If the creative fails to create a `dynamic-creative-ready` element in 2
  seconds, the renderer MUST distribute the fallback.

### Distribution

* Dynamic creatives may be served by a remote web server.
* Like traditional creatives, this server may be delivering a URL to a static
  image file for display on a screen.
* Unlike traditional creatives, these shall be dynamically rendered on the fly
  and may be cached with a configurable TTL.

### Signaling

* Renderers should pass through any `console.log` or `console.error` statements
  from dynamic creatives into local or remote logs for debugging and telemetric
  purposes.

### Proof of Plays and Third Party Verification

* Renderers should adopt policies for proof of plays and third party
  verification that best fit their architecture.
* Dynamic creatives which are handled by the Vistar renderer will follow the
  standard PoP model as they are ultimately rendered as static image files
    - At this time, there will be no support for third party verification
      contained within the dynamic creatives themselves. Due to the nature of
      our caching model, we cannot rely absolutely on side effects of a render
      being captured on every play.

### Media Owner Approvals

* Systems integrating with dynamic creative renderers should implement a system
  allowing media owners to approve both fallback creatives and dynamic
  creatives.
* These systems should allow media owners to preview the dynamic creative
  per-venue in the event geographically relevant data is displayed.

## Example

Below is an example dynamic creative found in the `index.html` of this
repository rendered at a 1400x400 resolution.

![Example](example.png)

### Design Considerations

* Dynamic creatives should be capable of rendering a visually consistent
  creative, regardless of screen resolution, aspect ratio, or orientation.
* One such approach can be seen in the example rendered above, where elements
  are "pinned" to quadrants of the creative, able to flexibly respond to sizing
  and orientation changes on-demand.
* Dynamic elements (such as text, location-based data, etc.) should also be
  considerate of the available viewport with respect to sizing at render time.
* From a design perspective, it is best to approach a dynamic creative
  similarly as one would a mobile app that needs to be responsive to different
  device screen sizes and orientations.
* Experiment with your designs on a variety of screen sizes and orientations,
  being sure to include descriptive annotations for how the creative should
  respond to such changes.

### Technical Considerations

* Developers should include `console.log` and `console.error` statements in a
  dynamic creative. Inclusion of such debug statements is very useful for
  troubleshooting technical issues during the proofing and approval processes.
  Some events it may prove valuable to debug include, but are not limited to:
    - Images and other static assets succeeding or failing to load.
    - 3rd party API `fetch` timing for performance tuning.
    - `window` events completing.
    - Network idle.
