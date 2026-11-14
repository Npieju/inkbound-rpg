import type { Game } from './game.ts';

/** First clears are already encoded by stage/kills. Replays grant no duplicate finds. */
export function collectionCount(game:Pick<Game,'stage'|'kills'|'phase'>):number {
  const bossCleared=game.phase==='clear'||game.phase==='complete';
  return Math.min(16,game.stage*4+game.kills+(bossCleared?1:0));
}
