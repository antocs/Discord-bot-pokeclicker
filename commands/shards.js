const { MessageEmbed } = require('discord.js');
const { PokemonType, GameConstants, pokemonTypeIcons, RouteShardTypes, findShardRoutes, findShardBestRoute, stringDistance } = require('../helpers.js');

module.exports = {
  name        : 'shards',
  aliases     : ['s', 'shard'],
  description : 'Get a list of routes where you can obtain a particular type of shard',
  args        : ['type', 'order(chance|route)?'],
  guildOnly   : true,
  cooldown    : 3,
  botperms    : ['SEND_MESSAGES'],
  userperms   : ['SEND_MESSAGES'],
  execute     : async (msg, args) => {
    let [type, order] = args;
    type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    if (!(PokemonType[type] >= 0)) {
      let newType = '';
      let newDistance = 10;
      Object.keys(PokemonType).forEach(typ => {
        const distance = stringDistance(type.toLowerCase(), typ.toLowerCase());
        if (isNaN(typ) && PokemonType[typ] >= 0 && distance <= Math.ceil(typ.length / 2) && (distance < newDistance || typ.startsWith(type))) {
          newDistance = distance;
          newType = typ;
        }
      });
      if (!newType) return msg.reply(`Invalid type: \`${type}\``);
      type = newType;
    }
    
    const sortFunc = order == 'chance' ? (a, b) => b[1] - a[1] : (a, b) => a[0] - b[0];

    const embed = new MessageEmbed()
      .setTitle(`${pokemonTypeIcons[type]} ${type} Shard Routes`)
      //.setThumbnail(`https://pokeclicker-dev.github.io/pokeclicker/assets/images/${shiny ? 'shiny' : ''}pokemon/${pokemon.id}.png`)
      .setColor('#3498db')
      .setFooter('Data is up to date as of v0.4.12');

    const shardRoutes = findShardRoutes(RouteShardTypes, PokemonType[type]);
    Object.entries(shardRoutes).forEach(([region, routes]) => {
      if (!Object.entries(routes).length) return;
      const bestShardRoute = findShardBestRoute(RouteShardTypes, PokemonType[type], region);
      const description = ['Best Route:', `${`[${bestShardRoute.route}]`.padEnd(4, ' ')} ${bestShardRoute.chance.toFixed(1).padStart(4,' ')}%`, '\nAll Routes:'];
      
      Object.entries(routes).sort(sortFunc).forEach(([route, chance]) => {
        description.push(`${`[${route}]`.padEnd(4, ' ')} ${chance.toFixed(1).padStart(4,' ')}%`);
      });
      embed.addField(`❯ ${GameConstants.Region[region].toUpperCase()}`, `\`\`\`ini\n${description.join('\n')}\n\`\`\``, true);
    });

    // Spacing for the footer
    embed.addField('\u200b', '\u200b');

    msg.channel.send({ embed });
  },
};