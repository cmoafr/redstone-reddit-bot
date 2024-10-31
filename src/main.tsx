// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redis: true,
});

Devvit.addMenuItem({
  location: 'post',
  label: 'Confirm QC post',
  onPress: async (event, context) => {
    // Add to Redis
    // TODO: Make global
    const nbAdded = await context.redis.zAdd("QCposts", {
      member: `${context.subredditName ?? ''}:${context.postId!}`,
      score: 0 // TODO: Replace with timestamp
    });

    // Check validity
    if (nbAdded <= 0) {
      context.ui.showToast('Already registed as QC.');
      return;
    }

    // Post has been confirmed as QC
    context.ui.showToast('QC post confirmed!');
    // TODO: Send message (explaination, meme image, infos) and pin it
  },
});

export default Devvit;
