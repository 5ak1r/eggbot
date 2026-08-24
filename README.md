# eggbot

Welcome to eggbot! This is a bot that records the amount of times the word "egg", or an egg-related emoji is sent in your discord server!
I'll add an actual list of features eventually.

## CHANGELOG

### v0.1.8
Ability to hide a channel with a role, only accessible when a user joins a voice call (a mute channel)
Added an anti-blue heart for negative messages (opposite of the blue heart functionality)
Celsius/Fahrenheit converter, "!celsius x" converts the value x from fahrenheit to celsius

### v0.1.7.1
Fixed for more generalised level management and accounts for when the user leaves the server and rejoins.

### v0.1.7
Added automatic role assignments for when a specific level is met. Need to clean this up for more generalised level management.

### v0.1.6
F is for :FurretWalk: has made its beloved return

### v0.1.5
April Fools!!
Also added a message that states eggbot version on startup

### v0.1.4

Reduced XP per minute in voice call
Cannot gain XP from voice calls while muted/deafened
Cannot gain XP from messages while unmuted/undeafened in a voice call
Cannot gain enough XP for multiple levels while in the voice call

### v0.1.3

No longer reliant on a third-party bot. Using Mee6's documentation, I implemented my own version of their level up system! Also, you can gain experience in this version by spending time in a voice call, since those are also server interactions! Same rate as messages, 15-25 XP/min.

### v0.1.2

There is now a message whenever the special user reacts with a "💙" emoji.
Also, a message triggered whenever the word "hope" is used. Inside joke.

### v0.1.1

We used to have a bot that would save quotes from users after they "levelled up" off of Mee6's bot. It doesn't work anymore, so I rewrote the original code from Python to JS and added it to eggbot. So now, if you have Mee6 and levels enabled, you can archive the quotes in a channel of your choice.

Also, you can assign a random unique role out of a selection every time someone joins your server (one role = they all get that one)!

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
- [ ] /stats command to display personal egg count
- [x] increment when an emote contains 'egg' (:eggplant:)
- [x] containerisation
