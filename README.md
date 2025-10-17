# eggbot

Welcome to eggbot! This is a bot that records the amount of times the word "egg" is sent in your discord server!

## CHANGELOG

### v0.0.2

Containerisation implemented. Still learning basics of containerisation so this may not be perfect right now.

### v0.0.1

Server specific stats. The bot increments by 1 every time a user posts a message containing the three letters "egg" with no spaces or other characters in between. Currently no cooldown so this is abusable.

TODO:
- [ ] /eggs command to display server total without incrementing
- [ ] /leaderboard command to display top server leaderboard
- [ ] personal cooldown per person (to avoid spamming)
- [ ] /stats command to display personal egg count
- [ ] increment when an emote contains 'egg' (:eggplant:)
- [x] containerisation