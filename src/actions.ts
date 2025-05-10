import { Context, MenuItemOnPressEvent } from "@devvit/public-api";
import { register } from "./db.js";
import { addComment, addFlair } from "./post.js";
import { isUserMod } from "./tools.js";

export async function markAsQC(event: MenuItemOnPressEvent, context: Context) {
    if (!await isUserMod(context))
        return;

    const registered = await register(context);
    if (!registered) {
      context.ui.showToast('Already registed as QC.');
      return;
    }

    await addFlair(context);
    const comment = await addComment(context, event.targetId);
    await comment.distinguish(true);

    context.ui.showToast('QC post confirmed!');
}