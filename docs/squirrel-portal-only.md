# Squirrel entry and exit refinement

Only the squirrel's portal presentation changes. It initially peeks from inside the existing circular opening. Exit begins with the head at that same doorway position instead of starting fully hidden off to one side. Entry uses the previously generated approach, rear-body and rump/tail poses, a small perspective change, and a short completely hidden pause before the front-facing indoor peek returns.

The current click-driven navigation behavior, running frames, bark paths, character size on the branch, scene, layout and all environment assets remain unchanged. No automatic animation loop is added. The pose-only asset is `public/images/navigation/squirrel-entry-poses.webp`, reused from the earlier character generation; it contains no wooden ring or environment.

`node scripts/verify-squirrel-portals.mjs` validates initial presence inside, entry and exit on both sides, the real circular mask, trailing tail, hidden pause and return to the indoor peek at mobile and desktop widths. Build and type checks also pass.
