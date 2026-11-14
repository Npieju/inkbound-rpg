import { derived, ITEMS, newGame, SKILLS, STAGES } from './game.ts';
import type { Game, Stat } from './game.ts';
export const SAVE_KEY = 'inkbound.save.v3';
const oldCosts: Record<string, number> = { heavy: 12, double: 32, charge: 28, finisher: 70, ward: 12, bash: 32, focus: 28, fortress: 70, mend: 12, regen: 28, drain: 32, renew: 70 };
/** Never trust persisted enemy parameters; interrupted combat resumes at camp. */
export function decodeSave(raw: string | null): Game | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    const integer = (n: unknown, max = 1e8) => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0 && n <= max;
    if (!v || ![2, 3].includes(v.version) || !integer(v.stage, STAGES.length - 1) ||
      !['kills', 'gold', 'xp', 'earnedXp', 'totalKills'].every(k => integer(v[k])) || !integer(v.kills, 3) ||
      !integer(v.potions, 9) || !v.stats || !['hp', 'sp', 'atk', 'def', 'agi'].every(k => integer(v.stats[k], 1000000)) ||
      !ITEMS.some(i => i.id === v.weapon && i.slot === 'weapon') || !ITEMS.some(i => i.id === v.armor && i.slot === 'armor') ||
      !['camp', 'battle', 'victory', 'defeat', 'clear', 'complete'].includes(v.phase) ||
      !Array.isArray(v.learned) || v.learned.length > SKILLS.length || new Set(v.learned).size !== v.learned.length || !v.learned.every((id: string) => SKILLS.some(s => s.id === id)) ||
      !Array.isArray(v.slots) || v.slots.length !== 4 || !v.slots.every((id: unknown) => id === null || v.learned.includes(id)) ||
      !Array.isArray(v.log) || v.log.length > 20 || !v.log.every((l: unknown) => typeof l === 'string' && l.length < 300)) return null;
    if ((v.phase === 'clear' || v.phase === 'complete') && (v.kills !== 3 || (v.phase === 'complete') !== (v.stage === STAGES.length - 1))) return null;
    const g = newGame();
    for (const key of ['stage', 'kills', 'gold', 'xp', 'earnedXp', 'totalKills', 'potions'] as const) g[key] = v[key];
    g.stats = Object.fromEntries(['hp', 'sp', 'atk', 'def', 'agi'].map(k => [k, v.stats[k]])) as Record<Stat, number>;
    g.weapon = v.weapon; g.armor = v.armor; g.phase = v.phase === 'battle' ? 'camp' : v.phase;
    g.log = [...v.log];
    if (v.version === 2) {
      g.xp += v.learned.reduce((n: number, id: string) => n + oldCosts[id], 0);
      g.owned = [...new Set(['twig', 'cloth', g.weapon, g.armor])];
      g.log.unshift('戦闘システム更新：旧スキルの費用をXPへ全額返却しました。編成し直せます。');
    } else {
      if (!integer(v.ethers, 9) || !integer(v.remedies, 9) || !Array.isArray(v.owned) || v.owned.length > ITEMS.length ||
        !v.owned.every((id: unknown) => ITEMS.some(i => i.id === id)) || !v.owned.includes(g.weapon) || !v.owned.includes(g.armor) ||
        !v.learned.every((id: string) => SKILLS.find(s => s.id === id)!.requires.every(p => v.learned.includes(p)))) return null;
      g.ethers = v.ethers; g.remedies = v.remedies; g.owned = [...new Set<string>(v.owned)];
      g.learned = [...v.learned]; g.slots = [...v.slots];
    }
    if (v.phase === 'battle') g.log.unshift('戦闘を中断し、マップに戻りました。');
    g.log = g.log.slice(0, 20); g.hp = derived(g).maxHp; g.sp = derived(g).maxSp;
    return g;
  } catch { return null; }
}
export function loadGame(storage: Pick<Storage, 'getItem'>): Game {
  try { return decodeSave(storage.getItem(SAVE_KEY)) ?? decodeSave(storage.getItem('inkbound.save.v2')) ?? newGame(); } catch { return newGame(); }
}
export function saveGame(g: Game, storage: Pick<Storage, 'setItem'>): boolean {
  try { storage.setItem(SAVE_KEY, JSON.stringify(g)); return true; } catch { return false; }
}
