const { MessageEmbed } = require('discord.js');
const { getDB, getUserID, addAmount } = require('../database.js');

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const getLastClaimTime = async (user) => {
  const [
    db,
    user_id,
  ] = await Promise.all([
    getDB(),
    getUserID(user),
  ]);

  const { last_claim } = await db.get('SELECT last_claim FROM coins WHERE user=?', user_id) || { last_claim: '0' };
  db.close();
  return new Date(last_claim);
};

const setLastClaimTime = async (user) => {
  const [
    db,
    user_id,
  ] = await Promise.all([
    getDB(),
    getUserID(user),
  ]);

  const data = {
    $user_id: user_id,
    $date: new Date().toJSON(),
  };

  await db.run('UPDATE coins SET last_claim=$date WHERE user=$user_id', data);
  db.close();
};

module.exports = {
  name        : 'claim',
  aliases     : ['daily', 'timely'],
  description : 'Short description',
  args        : [],
  guildOnly   : true,
  cooldown    : 3,
  botperms    : ['SEND_MESSAGES'],
  userperms   : ['SEND_MESSAGES'],
  execute     : async (msg, args) => {
    // Check if user claimed within the last 24 hours
    const lastClaim = await getLastClaimTime(msg.author);
    if (lastClaim >= (Date.now() - DAY)) {
      const timeLeft = (+lastClaim + DAY) - Date.now();
      const hours = Math.floor(timeLeft % DAY / HOUR).toString().padStart(2, '0');
      const minutes = Math.floor(timeLeft % HOUR / MINUTE).toString().padStart(2, '0');
      const seconds = Math.floor(timeLeft % MINUTE / SECOND).toString().padStart(2, '0');
      let timeRemaining = '';
      if (+hours) timeRemaining += `${hours} hours `;
      if (+hours || +minutes) timeRemaining += `${minutes} minutes `;
      timeRemaining += `${seconds} seconds`;
      return msg.channel.send({
        embed: new MessageEmbed().setColor('#e74c3c').setDescription(`${msg.author}\nYou've already claimed your <:money:737206931759824918> for today\nYou can claim again in ${timeRemaining}`),
      });
    }

    // Add the coins to the users balance, set last claimed time
    const dailyAmount = 100;
    // Add the balance then set last claim time (incase the user doesn't exist yet)
    const balance = await addAmount(msg.author, dailyAmount, 'coins');
    await setLastClaimTime(msg.author);
    return msg.channel.send({
      embed: new MessageEmbed().setColor('#2ecc71').setDescription(`${msg.author}\n**+${dailyAmount.toLocaleString('en-US')}** <:money:737206931759824918>\n\nCurrent Balance: **${balance.toLocaleString('en-US')}** <:money:737206931759824918>`),
    });
  },
};