import { derived, ITEMS, newGame, SKILLS, STAGES } from './game.ts';
import type { Game } from './game.ts';
export const SAVE_KEY = 'inkbound.save.v2';
/** Validate untrusted persisted JSON before it reaches game rules or HTML. */
export function decodeSave(raw: string | null): Game | null {
  if (!raw) return null;
  try {
    const g = JSON.parse(raw) as Game;
    const integer = (v: unknown, min: number, max = 1e8) => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
    if (!g || g.version !== 2 || !integer(g.stage, 0, STAGES.length - 1) || !integer(g.earnedXp, 0) ||
      !integer(g.kills, 0) || !integer(g.gold, 0) || !integer(g.xp, 0) ||
      !integer(g.potions, 0, 9) || !integer(g.totalKills, 0) || !g.stats ||
      !['hp', 'sp', 'atk', 'def', 'agi'].every(k => integer(g.stats[k as keyof typeof g.stats], 0, 1e6)) ||
      !ITEMS.some(i => i.id === g.weapon && i.slot === 'weapon') || !ITEMS.some(i => i.id === g.armor && i.slot === 'armor') ||
      !integer(g.hp, 0, derived(g).maxHp) || !integer(g.sp, 0, derived(g).maxSp) ||
      !['camp', 'battle', 'victory', 'defeat', 'clear', 'complete'].includes(g.phase) ||
      !Array.isArray(g.log) || g.log.length > 20 || !g.log.every(l => typeof l === 'string' && l.length < 300) ||
      !Array.isArray(g.learned) || g.learned.length > SKILLS.length || new Set(g.learned).size !== g.learned.length ||
      !g.learned.every(id => SKILLS.some(s => s.id === id && s.requires.every(p => g.learned.includes(p)))) ||
      !Array.isArray(g.slots) || g.slots.length !== 4 || !g.slots.every(id => id === null || g.learned.includes(id)) ||
      !Array.isArray(g.cooldowns) || g.cooldowns.length !== 4 || !g.cooldowns.every(c => integer(c, 0, 4)) ||
      !integer(g.ward, 0, 3) || !integer(g.regen, 0, 3) || !integer(g.charge, 0, 1)) return null;
    if ((g.phase === 'clear' || g.phase === 'complete') && (g.kills < 3 || (g.phase === 'clear' ? g.stage === STAGES.length - 1 : g.stage !== STAGES.length - 1))) return null;
    // Combat is atomic per click. Resume at camp to avoid trusting saved enemy parameters.
    if (g.phase === 'battle') { g.phase = 'camp'; g.log.unshift('戦闘を中断してキャンプに戻った。'); g.log = g.log.slice(0, 20); }
    g.enemy = null;
    // Existing saves and interrupted battles return to the map, ready for a fresh encounter.
    g.hp = derived(g).maxHp; g.sp = derived(g).maxSp;
    return g;
  } catch { return null; }
}
export function loadGame(storage: Pick<Storage, 'getItem'>): Game {
  try { return decodeSave(storage.getItem(SAVE_KEY)) ?? newGame(); } catch { return newGame(); }
}
export function saveGame(g: Game, storage: Pick<Storage, 'setItem'>): boolean {
  try { storage.setItem(SAVE_KEY, JSON.stringify(g)); return true; } catch { return false; }
}
