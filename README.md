## fleurdle

I never really played wordle, but my girlfriend loves it and wanted to be able to play more than one word a day. I love her, and it didn't seem too complicated, so I put my CS degree to work 👩‍💻. We'll call it \_fleur_dle 🌻

## Features

- varying word lengths:
  - allow 2-15 letter words (turns out long words are hard!!)
- daily mode:
  - users can play one fleurdle a day for all the available word lengths
  - include emoji output that users can share or copy to their clipboard
  - display current streak
  - display longest streak
- freeplay mode:
  - users can play infinitely
  - no emoji sharing enabled (don't want to confuse with daily mode)
- puzzle mode:
  - users can make puzzles (sequence of fleurdles that users can write messages with)
  - puzzles can be public (appear on main puzzle page) or private (only accessible with link)
  - users can add title/author/description to their puzzles
  - users can choose whether or not an elligible word is a fleurdle or is plain text
- explore page
  - users can explore the corpus (pretty cheat-y)
  - users can filter words based off of patterns, allowed letters, disallowed letters

## Tech Stack

- vue 3
- tailwind 3
- mongo (compass)
- netlify functions (with typescript)
