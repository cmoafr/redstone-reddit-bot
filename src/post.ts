import { Comment, Context, FlairTemplate, RichTextBuilder } from "@devvit/public-api";

// TODO
const qcDescription = `
<insert good QC description here>
`;

export async function addComment(context: Context, commentId: string): Promise<Comment> {
    const imageUrl = await context.assets.getURL('0days.jpg');
    const response = await context.media.upload({
      url: imageUrl,
      type: 'image',
    });

    const comment = await context.reddit.submitComment({
      id: commentId,
      richtext: new RichTextBuilder()
        .paragraph((p) => {
          p.text({text: qcDescription});
        })
        .image({ mediaId: response.mediaId }),
    });

    return comment;
}

export async function addFlair(context: Context): Promise<FlairTemplate |undefined> {
    if (!context.subredditName || !context.postId)
        return;

    const flairs = await context.reddit.getPostFlairTemplates(context.subredditName);
    const flair = flairs.find(flair => flair.text.includes("QC"));
    if (!flair)
        return;

    context.reddit.setPostFlair({
        subredditName: context.subredditName,
        postId: context.postId,
        flairTemplateId: flair.id,
    });

    return flair;
}