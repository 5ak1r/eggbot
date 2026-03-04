# eggbot

Welcome to eggbot! This is a bot that records the amount of times the word "egg", or an egg-related emoji is sent in your discord server!

## CHANGELOG

### v0.1.0

The "💙" emoji can now only be used as a reaction by a single user.
The bot now also responds to egg-related emojis.

### v0.0.2

Containerisation implemented. Still learning basics of containerisation so this may not be perfect right now. Also got a workflow going (if it ever works)!

### v0.0.1

Server specific stats. The bot increments by 1 every time a user posts a message containing the three letters "egg" with no spaces or other characters in between. Currently no cooldown so this is abusable.

TODO:
- [ ] /eggs command to display server total without incrementing
- [ ] /leaderboard command to display top server leaderboard
- [ ] personal cooldown per person (to avoid spamming)
- [ ] /stats command to display personal egg count
- [x] increment when an emote contains 'egg' (:eggplant:)
- [x] containerisation
