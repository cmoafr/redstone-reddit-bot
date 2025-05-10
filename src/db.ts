import { Context } from "@devvit/public-api";

const dbKey = "QCposts";

const getMember = (context: Context) =>
    `${context.subredditName!}:${context.postId!}`;

export async function register(context: Context): Promise<boolean> {
    const postId = context.postId;
    if (!context.subredditName || !postId)
        return false;

    const post = await context.reddit.getPostById(postId);
    const creationTimestamp = post.createdAt.getTime();

    const nbAdded = await context.redis.zAdd(dbKey, {
      member: getMember(context),
      score: creationTimestamp,
    });

    return nbAdded > 0;
}

export async function unregister(context: Context): Promise<boolean> {
    const postId = context.postId;
    if (!context.subredditName || !postId)
        return false;

    const nbRemoved = await context.redis.zRem(dbKey, [getMember(context)]);

    return nbRemoved > 0;
}