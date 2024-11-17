// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redis: true,
  redditAPI: true,
});

Devvit.addMenuItem({
  location: 'post',
  label: 'Confirm QC post',
  onPress: async (event, context) => {
    // TODO: Trusted members only

    // Get creating timestamp
    const postId = context.postId!;
    const post = await context.reddit.getPostById(postId);
    const creationTimestamp = post.createdAt.getTime();

    // Add to Redis
    // TODO: Make global
    const nbAdded = await context.redis.zAdd("QCposts", {
      member: `${context.subredditName ?? ''}:${postId}`,
      score: creationTimestamp,
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
