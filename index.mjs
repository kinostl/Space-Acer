import Discord from "discord.js";
import _ from "lodash";
import { customAlphabet } from "nanoid/async";
const client = new Discord.Client();
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 9);


function generate_mission() {
  const faction = [
    "Order of Shadow (stay hidden)",
    "Galactic Congress (maintain control)",
    "Stellar Alliance (stop oppression)",
    "Freetrader Syndicate (defy authority)",
    "Explor-A-Corp (boldly go)",
    "Species 4774 (who knows...)",
  ];
  const mission = [
    "Destroy or Defend",
    "Deliver or Steal",
    "Capture or Escort",
    "Aid or Investigate",
    "Save or Negotiate",
    "Retrieve or Infiltrate",
  ];
  const objective = [
    "Friend or Frenemy",
    "Gizmo or Treasure",
    "Discovery or Beasty",
    "Massive Monster",
    "Message or Secret",
    "Space Hulk or Mech",
  ];
  const location = [
    "Planet or Deep Space",
    "Station or Colony",
    "Starship or Shipyard",
    "Asteroid Field",
    "Badlands or Nebula",
    "Strange Anomaly",
  ];
  const location_aspect = [
    "Enclave (congregate)",
    "Archive (contain info)",
    "Fortification (protect)",
    "Den (harbor danger)",
    "Wonder (inspire awe)",
    "Ruins (hidden things)",
  ];
  const opposition = [
    "Pirate or Bounty",
    "Monster or Invasion",
    "Friend or Rival",
    "Time or Puzzle",
    "Viral or Corporation",
    "Environment or Law",
  ];
  const their_agenda = [
    "Sow Chaos",
    "Gain Wealth",
    "Increase Power",
    "Infest & Spread",
    "Enact Revenge",
    "Destroy Enemy",
  ];
  const the_snag = [
    "Tough Decision or Trap",
    "Creature or Enemy",
    "Theft or Abduction",
    "Mistaken or Manipulated",
    "Countdown or Betrayal",
    "Disaster or Malfunction",
  ];

  return `**Faction** ${_.sample(faction)}
**The Mission** ${_.sample(mission)}
**The Objective** ${_.sample(objective)}
**The Location** ${_.sample(location)}
**Location Aspect** ${_.sample(location_aspect)}
**The Opposition** ${_.sample(opposition)}
**Their Agenda** ${_.sample(their_agenda)}
**The Snag** ${_.sample(the_snag)}`;
}

const commands = {
  start: async (msg) => {
    const guild = msg.guild;
    const channel_id = await nanoid();
    const new_channel = await guild.channels.create(channel_id);
    await guild.channels.create(channel_id, { type: "voice" });
    const mission = generate_mission();
    await new_channel.send(mission);
    await new_channel.send(`${msg.author} your play rooms have been created!
You should ping your players and start interpreting the mission parameters!
Make a three step plan, use the \`!event\` command to make some Episode Events to fit in between those steps!
Finally, use \`!difficulty\` to start ‘in medias res’ and you’ve got the adventure! 

When in doubt, Ask the AI with \`!likely\`, \`!possibly\`, or \`!unlikely\``);
    await msg.delete()
  },
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (msg) => {
  if (msg.content === "!start") {
    try {
      await commands['start'](msg);
    } catch (e) {
      console.error(e)
      msg.reply('Something went wrong!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
