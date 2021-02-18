import Discord from 'discord.js'
import { writeFile, readFile } from 'node-serialization'
import _ from 'lodash'
import { customAlphabet } from 'nanoid/async'
const client = new Discord.Client()
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 9)
const channelSafetyPath = 'channelSafety.bs'
const channelSafety = await readFile(channelSafetyPath)

function generateMission () {
  const faction = [
    'Order of Shadow (stay hidden)',
    'Galactic Congress (maintain control)',
    'Stellar Alliance (stop oppression)',
    'Freetrader Syndicate (defy authority)',
    'Explor-A-Corp (boldly go)',
    'Species 4774 (who knows...)'
  ]
  const mission = [
    'Destroy or Defend',
    'Deliver or Steal',
    'Capture or Escort',
    'Aid or Investigate',
    'Save or Negotiate',
    'Retrieve or Infiltrate'
  ]
  const objective = [
    'Friend or Frenemy',
    'Gizmo or Treasure',
    'Discovery or Beasty',
    'Massive Monster',
    'Message or Secret',
    'Space Hulk or Mech'
  ]
  const location = [
    'Planet or Deep Space',
    'Station or Colony',
    'Starship or Shipyard',
    'Asteroid Field',
    'Badlands or Nebula',
    'Strange Anomaly'
  ]
  const locationAspect = [
    'Enclave (congregate)',
    'Archive (contain info)',
    'Fortification (protect)',
    'Den (harbor danger)',
    'Wonder (inspire awe)',
    'Ruins (hidden things)'
  ]
  const opposition = [
    'Pirate or Bounty',
    'Monster or Invasion',
    'Friend or Rival',
    'Time or Puzzle',
    'Viral or Corporation',
    'Environment or Law'
  ]
  const theirAgenda = [
    'Sow Chaos',
    'Gain Wealth',
    'Increase Power',
    'Infest & Spread',
    'Enact Revenge',
    'Destroy Enemy'
  ]
  const theSnag = [
    'Tough Decision or Trap',
    'Creature or Enemy',
    'Theft or Abduction',
    'Mistaken or Manipulated',
    'Countdown or Betrayal',
    'Disaster or Malfunction'
  ]

  return `**Faction** ${_.sample(faction)}
**The Mission** ${_.sample(mission)}
**The Objective** ${_.sample(objective)}
**The Location** ${_.sample(location)}
**Location Aspect** ${_.sample(locationAspect)}
**The Opposition** ${_.sample(opposition)} **Their Agenda** ${_.sample(theirAgenda)}
**The Snag** ${_.sample(theSnag)}`
}

function generateEpisodeEvent (eventType) {
  const episodeEvents = {}
  episodeEvents.flavor = () => {
    return `**Flavor** ${_.sample(['Captured', 'Abandoned', 'Advanced', 'Monolithic', 'Endangered', 'Treacherous', 'Protected', 'Volatile', 'Beautiful', 'Deceptive', 'Shattered', 'Savage', 'Exotic', 'Fragile', 'Civilized', 'Hidden', 'Active', 'Moving'])}`
  }
  episodeEvents.scuffle = () => {
    const scuffleRoll = _.sample(6)
    let scuffleResult = ''
    if (scuffleRoll < 3) {
      scuffleResult = `${_.random(1, 6)} Minion(s). *1 Gumption & 1 Harm*`
    } else if (scuffleRoll < 6) {
      scuffleResult = `${_.random(1, 3)} Goon(s). *3 Gumption & 2 Harm*`
    } else {
      scuffleResult = `Big Daddy. *${6 + _.random(1, 6)} Gumption & 3 Harm*`
    }
    const tactic = _.sample(['Destroy', 'Weaken', 'Capture', 'Deceive', 'Steal', 'Hunt'])
    return `**Scuffle** ${scuffleResult} - **Tactic** ${tactic} - ${episodeEvents.flavor()}`
  }
  episodeEvents.social = () => {
    const social = _.sample(['Harbinger *or* Hero', 'Guardian *or* Gossip', 'Trickster *or* Sage', 'Hunter *or* Authority', 'Seeker *or* Outcast', 'Outlaw *or* Shadow'])
    const bearing = _.sample(['Hostile', 'In Peril', 'In Need', 'Shifty', 'Nervous', 'Friendly'])
    return `**Social** ${social} - **Bearing** ${bearing} - ${episodeEvents.flavor()}`
  }
  episodeEvents.encounter = () => {
    return `**Encounter** ${_.sample(['Danger (imperil)', 'Obstacle (slow)', 'Barrier (prevent)', 'Passage (advance)', 'Resource (enable)', 'Refuge (refresh)'])} - ${episodeEvents.flavor()}`
  }
  episodeEvents.difficulty = () => {
    // sample difficulty
    return `**Difficulty** ${_.sample(['Overcome *or* Aid', 'Rescue *or* Protect', 'Endur *or* Choose', 'Outwit *or* Restore', 'Survive *or* Avoid', 'Escape *or* Hinder'])} - ${episodeEvents.flavor()}`
  }
  episodeEvents.complex = () => {
    // complex method
    const eventTypeOptions = ['scuffle', 'social', 'encounter', 'difficulty']
    const eventTypeRoll = []
    eventTypeRoll[0] = _.sample(eventTypeOptions)
    _.pullAll(episodeEvents, eventTypeRoll)
    eventTypeRoll[1] = _.sample(eventTypeOptions)
    return `**Complex!!**
${eventTypeRoll.map((o) => episodeEvents[o]()).join('\n')}`
  }
  if (eventType) {
    return episodeEvents[eventType]()
  } else {
    // roll stuff and go full random
    const eventTypeRoll = _.sample(['scuffle', 'social', 'encounter', 'difficulty', 'complex', 'complex'])
    return episodeEvents[eventTypeRoll]()
  }
}

function getAIHelp (likelihood) {
  const riskFactor = {
    likely: 5,
    possibly: 10,
    unlikely: 15
  }[likelihood]
  const riskRoll = _.random(1, 20)
  const riskResult = riskRoll > riskFactor ? 'Yes' : 'No'
  const bonusResult = _.sample([', but...', '', ', and...'])
  return `${riskResult}${bonusResult}`
}

const commands = {}
commands.start = async (msg) => {
  const guild = msg.guild
  const channelId = await nanoid()
  const newCategory = await guild.channels.create(channelId, { type: 'category' })
  const missionData = await guild.channels.create('mission-data', { parent: newCategory })
  const voiceText = await guild.channels.create('voice-text', { parent: newCategory })
  const botUse = await guild.channels.create('bot-use', { parent: newCategory })
  const voiceChat = await guild.channels.create('voice-chat', { type: 'voice', parent: newCategory })
  channelSafety[newCategory.id] = {
    creator: msg.author.id,
    missionId: missionData.id,
    channels: [newCategory.id, voiceText.id, botUse.id, voiceChat.id]
  }
  const saveChannelSafety = writeFile(channelSafetyPath, channelSafety)
  const mission = generateMission()
  await missionData.send(mission)
  await missionData.send(`${msg.author} your play rooms have been created!
You should ping your players and start interpreting the mission parameters!
Make a three step plan, use the \`!event\` command to make some Episode Events to fit in between those steps!
Finally, use \`!difficulty\` to start ‘in medias res’ and you’ve got the adventure! 

When in doubt, Ask the AI with \`!likely\`, \`!possibly\`, or \`!unlikely\`

${msg.author} - When you're done, use \`!archive\` to clean up this category!
**Mission Data is the only channel that will be preserved**`)
  await msg.delete()
  await saveChannelSafety
}

commands.archive = async (msg) => {
  const channelInfo = channelSafety[msg.channel.parentID]
  if(!channelInfo) return
  if(channelInfo.creator !== msg.author.id) return
  const missionData = await client.channels.fetch(channelInfo.missionId)
  const archiveCategory = await msg.guild.channels.cache.find(channel => channel.name === "archives" && channel.type === "category");
  await missionData.edit({
    name: msg.channel.parent.name,
    parentID: archiveCategory.id
  })
  for(let o of channelInfo.channels){
    let channel = await client.channels.fetch(o)
    await channel.delete()
  }
}

commands.event = async (msg) => { await msg.reply(generateEpisodeEvent()) }
commands.scuffle = async (msg) => { await msg.reply(generateEpisodeEvent('scuffle')) }
commands.social = async (msg) => { await msg.reply(generateEpisodeEvent('social')) }
commands.encounter = async (msg) => { await msg.reply(generateEpisodeEvent('encounter')) }
commands.difficulty = async (msg) => { await msg.reply(generateEpisodeEvent('difficulty')) }
commands.complex = async (msg) => { await msg.reply(generateEpisodeEvent('complex')) }
commands.flavor = async (msg) => { await msg.reply(generateEpisodeEvent('flavor')) }

commands.likely = async (msg) => { await msg.reply(getAIHelp('likely')) }
commands.possibly = async (msg) => { await msg.reply(getAIHelp('possibly')) }
commands.unlikely = async (msg) => { await msg.reply(getAIHelp('unlikely')) }

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async (msg) => {
  const prefix = '!'
  if (!msg.content.startsWith(prefix) || msg.author.bot) return

  const args = msg.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()

  if (!commands[command]) return

  try {
    await commands[command](msg)
  } catch (e) {
    console.error(e)
    msg.reply('Something went wrong!')
  }
}
)

client.login(process.env.DISCORD_TOKEN)
