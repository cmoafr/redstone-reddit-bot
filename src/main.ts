import { Devvit } from '@devvit/public-api';
import { markAsQC } from './actions.js';
import { isUserMod } from './tools.js';

Devvit.configure({
  media: true,
  redis: true,
  redditAPI: true,
});

Devvit.addMenuItem({
  location: 'post',
  label: 'Confirm QC post',
  onPress: markAsQC,
});

Devvit.addMenuItem({
  location: 'post',
  label: 'Remove from DB',
  onPress: async (event, context) => {
    if (!isUserMod(context))
        return;
    await context.redis.del("QCposts");
  },
});

export default Devvit;
