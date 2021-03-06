Hey y'all, I made a bot that makes temporary categories with several useful game channels. I thought you might find it useful to fork. It has some things built into it dedicated to the game Space Aces.

https://github.com/kinostl/Space-Acer

When you type `!start` it creates a category with a random name. The category contains these channels.

- *mission-data* the only channel that gets archived. It useful for text based sessions, or recording highlights.
- *bot-use* self explanatary
- *voice-text* chat for memes or out of character chat
- *voice-chat* a voice channel to voice chat in

When whoever typed `!start` types `!archive` inside the category it deletes every channel in the category except *mission-data*, renames *mission-data* to the randomly generated category name, then moves it to the first category it finds named "archives".

Next updates are going to add a GM Notes channel and a way to rename the category.
