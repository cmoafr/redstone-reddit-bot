// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit, RichTextBuilder } from '@devvit/public-api';

const qc0DaysUrl = 'https://i.redd.it/h97he7ckb5yd1.jpeg';

const qcDescription = `
<insert good QC description here>
`;

Devvit.configure({
  media: true,
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

    // Reuploading as each media ID can only be reused on the same post
    const response = await context.media.upload({
      url: qc0DaysUrl,
      type: 'image',
    });
    const comment = await context.reddit.submitComment({
      id: event.targetId,
      // FIXME: The text field is still required for some reason
      // Will check with the community and update as necessary
      text: 'QC post confirmation',
      richtext: new RichTextBuilder()
        .paragraph((p) => {
          // TODO: Exact content of the message has yet to be defined
          p.text({text: qcDescription});
        })
        .image({ mediaId: response.mediaId }),
    });

    await comment.distinguish(true);
  },
});

export default Devvit;
