import cron from 'node-cron';
import User from '../models/User.js';
import Credential from '../models/Credential.js';

cron.schedule('* * * * *', async () => {
  const now = Date.now();
  const users = await User.find({
    verified: false,
    otpExpire: { $lt: now },
  });

  if (users.length === 0) return;

  const userIds = users.map((user) => user._id);

  const userResult = await User.deleteMany({
    _id: { $in: userIds },
  });
  const credResult = await Credential.deleteMany({
    userId: { $in: userIds },
    provider: 'local',
  });

  console.log(
    `[CRON] Đã xoá ${userResult.deletedCount} user chưa xác thực và ${credResult.deletedCount} credential sau 5 phút.`,
  );
});
