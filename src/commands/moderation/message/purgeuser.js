const { purgeMessages } = require("@helpers/ModUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purgeuser",
  description: "xóa số lượng tin nhắn được chỉ định",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "<@user|ID> [amount]",
    aliases: ["purgeusers"],
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0]);
    if (!target) return message.safeReply(`Không tìm thấy người dùng ${args[0]}`);
    const amount = (args.length > 1 && args[1]) || 99;

    if (amount) {
      if (isNaN(amount)) return message.safeReply("Chỉ có thể là số");
      if (parseInt(amount) > 100) return message.safeReply("Số lượng tin nhắn tối đa mà tớ có thể xóa là 100");
    }

    const { channel } = message;
    const response = await purgeMessages(message.member, message.channel, "USER", amount, target);

    if (typeof response === "number") {
      return channel.safeSend(`Đã xóa ${response} tin nhắn`, 5);
    } else if (response === "BOT_PERM") {
      return message.safeReply("Tớ không có quyền `Đọc lịch sử tin nhắn` & `Quản lý tin nhắn` để xóa", 5);
    } else if (response === "MEMBER_PERM") {
      return message.safeReply("Cậu không có quyền `Đọc lịch sử tin nhắn` & `Quản lý tin nhắn` để xóa tin nhắn", 5);
    } else if (response === "NO_MESSAGES") {
      return channel.safeSend("Không tìm thấy tin nhắn để xóa", 5);
    } else {
      return message.safeReply(`Đã xảy ra lỗi! Xóa tin nhắn thất bại`);
    }
  },
};
