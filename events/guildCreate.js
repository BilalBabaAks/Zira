'use strict';

exports.Run = async function Run(caller, guild) {
  if (!process.env.WEBHOOK_ID || !process.env.WEBHOOK_TOKEN) return;
  const owner = caller.bot.users.get(guild.ownerID);
  caller.logger.info(`[guildCreate] ${guild.id} ${guild.name} ${guild.memberCount}`);
  const bots = guild.members.filter(m => m.user.bot).length;
  caller.bot.executeWebhook(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN, {
    embeds: [{
      color: 0x00d62e,
      title: 'Joined Server',
      description: `**Name:** ${guild.name}\n**ID:** ${guild.id}\n**Owner:** ${owner.username}#${owner.discriminator} (${guild.ownerID})\n**Count:** ${guild.memberCount}\n**Users:** ${(guild.memberCount - bots)}\n**Bots:** ${bots}\n**Percent:** ${((bots / (guild.memberCount)) * 100).toFixed(2)} %\n**Created:** ${caller.utils.snowflakeDate(guild.id)}`,
      thumbnail: {
        url: guild.iconURL,
      },
      timestamp: new Date(),
    }],
  }).catch(console.error);
  const shards = await caller.db.get('shards');
  const res = shards.findOne({ id: 0 });
  res[`guilds_${caller.id}`] = caller.bot.guilds.map(g => g.id);
  await shards.findOneAndUpdate({ id: 0 }, res);
};
