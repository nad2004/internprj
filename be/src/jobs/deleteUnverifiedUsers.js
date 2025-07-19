import cron from 'node-cron';
import User from '../models/User.js';
import Credential from '../models/Credential.js';
cron.schedule('* * * * *', async () => {
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;

  const result = await User.deleteMany({
    verified: false,
    otpExpire: { $lt: now },
  });
  await Credential.deleteMany({
    userId: { $in: result.deletedCount > 0 ? result.map((user) => user._id) : [] },
    provider: 'local',
  });
  if (result.deletedCount > 0) {
    console.log(`[CRON] Đã xoá ${result.deletedCount} user chưa xác thực sau 5 phút.`);
  }
});
