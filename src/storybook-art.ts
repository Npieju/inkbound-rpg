import { illustratedHero, illustratedScene, illustratedEnemy } from './illustrated.ts';
export function storyScenery(world:'academy'|'library',stage:number,_restored=0):string { return illustratedScene(world,stage); }
export function storyFighter(world:'academy'|'library',enemy:boolean,boss:boolean,id:string):string { return enemy?illustratedEnemy(world,boss,id):illustratedHero(world); }

export function findArt(icon:'sweet'|'book'|'flower'|'key',index=0):string {
  const sweets:Record<number,string>={
    0:'<ellipse cx="30" cy="45" rx="22" ry="5" fill="var(--paper)"/><path d="m14 41 5-22h22l5 22q-16 8-32 0Z" fill="#f2d39d"/><path d="m19 19 22 0-2 8q-5 4-9 0-5 4-9 0Z" fill="#d5987d"/><path d="m22 16-2-9 8 4 3-8 4 8 8-4-3 10Z" fill="#ebc178"/>',
    1:'<path d="M12 30q-6-23 18-24 25 3 19 27-3 21-24 19-17-1-13-22Z" fill="#e9c59e"/><path d="m22 22 4 2m11-5 3 2m-18 14 4 1m13-4 2 4m-10 4 2 2" fill="none" stroke-width="3"/>',
    3:'<path d="m15 19 20-8 15 10-4 25-21 7-13-11Z" fill="#fff2cd"/><path d="m15 19 14 10 21-8M29 29l-4 24" fill="none"/><path d="m20 15 1-9 7 4 5-7 3 8 8-3-1 8" fill="#ebc178"/>',
    4:'<path d="m25 36 6 18 7-18" fill="#e5c1aa"/><path d="M16 36q-14-12-2-20-2-17 15-13 13-5 16 9 16 3 9 16 2 15-18 13-10 6-20-5Z" fill="#ecd1df"/><path d="M16 21q10-7 21-2m-16 9 17 2" fill="none" opacity=".4"/>',
    9:'<path d="m14 19-2-14 14 10 10-1L49 5l-2 17q12 25-15 31-29 1-22-24Z" fill="#eac59f"/><circle cx="23" cy="30" r="2"/><circle cx="38" cy="30" r="2"/><path d="m27 39 4 2 4-2M12 35l-8-3m8 8-8 3m45-8 8-3m-9 8 8 3" fill="none"/>',
    12:'<path d="m30 3 6 12 14-5-3 15 11 7-13 6 2 14-14-6-10 11-5-14-15-2 10-11L5 18l16-1Z" fill="#f0d4a3"/>',
    15:'<path d="m10 18 37-3 6 7-38 5Zm2 15 36-4 6 7-38 5Zm2 15 36-4 6 7-38 5Z" fill="#d5a97f"/><path d="m14 27 36-4-2 7-36 4Zm2 14 36-4-2 7-36 4Z" fill="#fff1c8"/><path d="m26 15 3-10 9 1 3 9" fill="#d9909f"/>',
  };
  if(icon==='sweet'&&sweets[index])return `<svg viewBox="0 0 60 60" class="find-illustration find-${index%4}" aria-hidden="true"><g stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">${sweets[index]}</g></svg>`;
  const marks=icon==='sweet'?`<path d="m12 27 5-9h26l5 9-5 10H17Z" fill="var(--find-fill,#f0bcc6)"/><path d="M17 26h26m-25 4h24" fill="none"/><path d="m10 23-7-4v16l8-5m39-7 7-4v16l-8-5" fill="var(--find-fill,#f0bcc6)"/>`:icon==='flower'?'<path d="M30 32v20m0-9-10-6m10 9 10-8" fill="none"/><path d="M30 31q-18 6-15-6-11-13 2-15 4-15 13-5 12-10 15 5 13 2 2 15 3 12-17 6Z" fill="var(--find-fill,#edd2a2)"/><circle cx="30" cy="20" r="6" fill="var(--paper)"/>':icon==='key'?'<path d="M30 31v19h8v-6h-8m0-6h10" fill="none" stroke-width="3"/><circle cx="30" cy="20" r="12" fill="var(--find-fill,#ead2a9)"/><path d="m25 20 5-5 5 5-5 5Z" fill="var(--paper)"/>':`<path d="M13 9h31l4 39H15Z" fill="var(--find-fill,#c4cfbf)"/><path d="M17 11v33h30m-24-23h15m-15 6h12" fill="none"/><path d="M31 10v13l4-3 4 3V10" fill="var(--accent)"/>`;
  return `<svg viewBox="0 0 60 60" class="find-illustration find-${index%4}" aria-hidden="true"><g stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">${marks}</g></svg>`;
}
