# Ganesh Classes — static Bootstrap website

Open `index.html`, or serve this directory with `python -m http.server 5500` and visit http://localhost:5500.
No React, Angular, npm install or build step is required. Bootstrap 5.3.3 and Google Fonts load from CDNs; an internet connection is needed for the complete styling. Navigation and interactions use plain JavaScript.

## Add your real content

1. Put sir and madam photographs in `assets/faculty/`. Set `sir.photo` and `madam.photo` in `site-config.js` to relative paths, such as `assets/faculty/sir.jpg`. Update names and roles with confirmed details.
2. Put student review videos in `assets/reviews/`. Set each review's `video` path, title and description in `site-config.js`. Prefer compressed MP4 (H.264/AAC). Optional `poster` images and WebVTT `captions` paths are supported. Videos never autoplay; playing one pauses the other. Use captions in the video's language for accessibility.
3. Set the real `whatsapp` number (country code plus number), `phoneDisplay` and centre `address` in `site-config.js`.
4. Confirm programmes, subjects, batch availability and wording before launch. Existing course names were retained as draft content. No student results, testimonials, faculty qualifications or fees have been invented.

## Enquiry behaviour

The form validates inputs and prepares a message locally. It does not save or submit personal information. Without an admissions number it offers a copyable enquiry. Once the number is configured, the visitor reviews the message, opens WhatsApp, and explicitly sends it there. It does not claim an enquiry was sent.

## Media status

The supplied sir and madam photographs are installed in assets/faculty and connected to their profiles. The first supplied student review video is installed as assets/reviews/student-review-01.mp4 with a poster extracted from the video. It is displayed in a portrait-friendly player with native controls. The second review slot is hidden until another video is supplied. The hero and learning visuals are original CSS illustrations, not stock portraits or fabricated student reviews. Two video slots are provided initially; add further cards using the same structure when needed.

## Files

- `index.html`: page structure and copy
- `style.css`: visual design and responsive layouts
- `animations.css`: reduced-motion aware entrance motion
- `script.js`: mobile menu, course filtering, media integration and enquiry preparation
- `site-config.js`: contact and media settings
- `backups/`: previous versions captured before this redesign

This is a local project. It has not been published or deployed.

## Enquiry confirmation update
Submitting valid details opens a review dialog. Visitors can edit, copy or confirm their enquiry. Confirm opens WhatsApp chat with +91 9490967626 and the prepared message. Visitors must press Send inside WhatsApp; opening the chat does not send automatically.
