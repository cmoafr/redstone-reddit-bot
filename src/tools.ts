import { Context } from "@devvit/public-api";

export async function isUserMod(context: Context): Promise<boolean> {
    if (!context.subredditName)
        return false;

    const mods = await context.reddit.getModerators({subredditName: context.subredditName}).all();
    const isMod = mods.some(mod => mod.id == context.userId);
    if (!isMod)
      context.ui.showToast('You do not have the sufficient permissions to do that.');

    return isMod;
}