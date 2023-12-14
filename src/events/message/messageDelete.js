const { EmbedBuilder } = require("discord.js");
const { getSettings } = require("@schemas/Guild");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message|import('discord.js').PartialMessage} message
 */
module.exports = async (client, message) => {
  if (message.partial) return;
  if (message.author.bot || !message.guild) return;

  const settings = await getSettings(message.guild);
  if (!settings.automod.anti_ghostping || !settings.modlog_channel) return;
  const { members, roles, everyone } = message.mentions;

  // Check message if it contains mentions
  if (members.size > 0 || roles.size > 0 || everyone) {
    const logChannel = message.guild.channels.cache.get(settings.modlog_channel);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setAuthor({ name: "Phát hiện Ghost-ping" })
      .setDescription(
        `**Tin nhắn:**\n${message.content}\n\n` +
          `**Người gửi:** ${message.author.tag} \`${message.author.id}\`\n` +
          `**Kênh:** ${message.channel.toString()}`
      )
      .addFields(
        {
          name: "Members",
          value: members.size.toString(),
          inline: true,
        },
        {
          name: "Roles",
          value: roles.size.toString(),
          inline: true,
        },
        {
          name: "Everyone?",
          value: everyone ? "Yes" : "No",
          inline: true,
        }
      )
      .setFooter({ text: `Gửi lúc: ${message.createdAt}` });

    logChannel.safeSend({ embeds: [embed] });
  }
  
  client.on("messageDelete", async (message) => {
    if (!message.author || message.author.bot || !message.guild) return;
    messageclient.snipes.set(message.channel.id, {
      content: message.content,
      author: message.author.tag,
      name: message.attachments.first() ? message.attachments.array()[0].name: null,
      image: message.attachments.first()
        ? message.attachments.first().proxyURL
        : null
    });
  })
};
