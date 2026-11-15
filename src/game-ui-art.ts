/** Original game UI illustrations. Shared contours and pigments, different subjects. */
const motifs:Record<string,string>={
 map:'<path d="m9 16 15-6 16 6 15-6v39l-15 6-16-6-15 6Z" fill="var(--art-paper)"/><path d="M24 10v39m16-33v39"/><path d="m15 36 8-7 11 9 14-14" stroke-dasharray="3 3"/><path d="m44 20 5 2 2 5-5-1Z" fill="var(--art-red)"/>',
 stats:'<path d="M17 51V33h9v18m6 0V23h9v28m6 0V12h9v39" fill="var(--art-fill)"/><path d="M10 53h48M13 25l12-11 10 4 17-13"/><path d="m45 5 8-1-2 8" fill="none"/>',
 skills:'<path d="M8 17q12-7 24 0 12-7 24 0v34q-12-7-24 0-12-7-24 0Z" fill="var(--art-paper)"/><path d="M32 17v34m-18-26h11m-11 7h11m14-7h10m-10 7h10"/><path d="m30 6 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="var(--art-gold)"/>',
 shop:'<path d="M12 25h40v29H12Z" fill="var(--art-paper)"/><path d="m8 25 6-14h36l6 14q-6 10-12 0-6 10-12 0-6 10-12 0-6 10-12 0Z" fill="var(--art-fill)"/><path d="M25 54V37h13v17m-22-19h5m23 0h5M21 12l-3 13m14-13v13m11-13 3 13"/>',
 log:'<path d="M17 9h34v44H17Z" fill="var(--art-paper)"/><path d="M13 16h8m-8 10h8m-8 10h8m-8 10h8M26 20h17m-17 8h17m-17 8h12"/><path d="m39 46 15-21 5 4-15 21-7 3Z" fill="var(--art-gold)"/>',
 album:'<path d="M12 9h39v45H12Z" fill="var(--art-fill)"/><path d="M18 10v44m9-35h15v19H27Z" fill="var(--art-paper)"/><path d="m30 31 4-8 4 8 5 3H26Z"/><path d="m40 10v14l4-3 4 3V10" fill="var(--art-red)"/>',
 coin:'<ellipse cx="32" cy="48" rx="22" ry="7" fill="var(--art-gold)"/><path d="M10 40v8m44-8v8"/><ellipse cx="32" cy="40" rx="22" ry="7" fill="var(--art-gold)"/><path d="M12 31v8m40-8v8"/><ellipse cx="32" cy="31" rx="20" ry="7" fill="var(--art-gold)"/><circle cx="35" cy="19" r="12" fill="var(--art-gold)"/><path d="m35 11 2 5 5 3-5 2-2 5-2-5-5-2 5-3Z" fill="var(--art-paper)"/>',
 xp:'<path d="M16 51q-4-27 31-42 7 27-24 40Z" fill="var(--art-fill)"/><path d="m15 55 29-40M24 43l-2-14m9 6-1-15m7 7 12-5"/>',
 hp:'<path d="M32 53C-6 28 13 5 32 22 51 5 70 28 32 53Z" fill="var(--art-red)"/><path d="M20 27q-5-2-5 5" stroke="var(--art-paper)"/>',
 sp:'<path d="M42 10C15 6 2 44 27 53c11 4 23-1 27-9-29 7-36-18-12-34Z" fill="var(--art-fill)"/><path d="m47 14 3 6 7 2-7 3-3 7-2-7-6-3 6-2Z" fill="var(--art-gold)"/>',
 atk:'<path d="m17 48 27-36 10-4-1 12-27 35Z" fill="var(--art-paper)"/><path d="m15 37 17 13M17 46 9 56l6 3 9-10M42 21l-17 23"/><path d="m15 15 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="var(--art-gold)"/>',
 def:'<path d="m32 7 22 9v15q-3 16-22 27C13 47 10 31 10 31V16Z" fill="var(--art-fill)"/><path d="m32 14 15 6v11q-4 11-15 19-11-8-15-19V20Z" fill="var(--art-paper)"/><path d="M32 20v22m-9-11h18"/>',
 agi:'<path d="M41 8q8 16-1 32-7 12-25 15l9-14-13 2 18-13-14-3 22-9Z" fill="var(--art-fill)"/><path d="m13 55 28-43M8 20h14M6 33h13"/>',
 item:'<path d="M25 9h14v10l12 14v18q-19 8-38 0V33l12-14Z" fill="var(--art-paper)"/><path d="M23 9h18v7H23Z" fill="var(--art-gold)"/><path d="M16 38q16-8 32 0v11q-16 7-32 0Z" fill="var(--art-red)"/><path d="m29 29 4-5 3 5-3 4Z" fill="var(--art-fill)"/>',
 run:'<path d="M19 52V13l25-5v44Z" fill="var(--art-paper)"/><path d="M14 53h37M26 34h29m-8-8 8 8-8 8"/><circle cx="38" cy="30" r="1.5" fill="var(--art-gold)"/>',
 lock:'<path d="M18 28h28v26H18Z" fill="var(--art-fill)"/><path d="M24 28V18a8 8 0 0 1 16 0v10" fill="none"/><circle cx="32" cy="39" r="3" fill="var(--art-paper)"/><path d="M32 41v5"/>',
 crown:'<path d="m9 20 13 9L32 9l10 20 13-9-6 27H15Z" fill="var(--art-gold)"/><path d="M16 52h32M18 39h28"/><circle cx="32" cy="36" r="4" fill="var(--art-red)"/>',
 star:'<path d="m32 8 7 15 17 3-12 13 2 18-14-8-15 8 3-18L7 26l18-3Z" fill="var(--art-gold)"/><path d="m32 16 3 12 13 1m-16 3v11"/>',
 fracture:'<path d="m32 8 23 9-4 22-19 18-20-18-4-22Z" fill="var(--art-fill)"/><path d="m35 9-10 18 12 5-10 23M46 22l-9 10 11 9" fill="none"/>',
 sweep:'<path d="M12 45Q16 12 53 12 30 23 25 49Z" fill="var(--art-paper)"/><path d="M8 55q21-25 49-23M10 47q17-23 40-24" fill="none"/>',
 echo:'<path d="m21 16 9 17-11 18-9-18Z" fill="var(--art-fill)"/><path d="m36 11 14 22-13 23-13-23Z" fill="var(--art-paper)"/><path d="M47 15q17 17 0 35" fill="none"/>',
 comet:'<path d="M12 41Q19 14 50 8L34 30l18-10-14 26Z" fill="var(--art-fill)"/><path d="m23 34 6 9 11 2-9 7-2 9-7-7-10 1 5-10-4-7Z" fill="var(--art-gold)"/>',
 absorb:'<path d="M19 20a18 18 0 1 1-4 23" fill="none"/><path d="m11 21 8-1 2-9M29 19v25m-8-14 9-10 9 10"/><path d="M20 49h23"/>',
 grit:'<path d="m16 53 5-27 10 10 10-23 8 40Z" fill="var(--art-fill)"/><path d="m27 43 5 10 5-10M11 15l7 8m34 1 6-9"/>',
 triple:'<path d="m8 44 8-31 7 5-8 30Zm20 3 7-39 7 5-6 38Zm20 6 5-32 7 4-5 32Z" fill="var(--art-paper)"/>',
 venom:'<path d="m32 8 13 24q9 22-13 25-22-3-13-25Z" fill="var(--art-fill)"/><path d="m26 28 11 13-13 4m11-16-8 20"/><path d="m8 10 3 5 6 2-6 3-3 6-2-6-5-3 5-2Z" fill="var(--art-gold)"/>',
 cut:'<path d="m14 19 38 7-8 28-34-6Z" fill="var(--art-paper)"/><path d="m23 21-6 24m17-22-7 23m17-20-7 23" stroke="var(--art-red)" stroke-width="3"/>',
 eye:'<path d="M5 33Q32 5 59 33 32 57 5 33Z" fill="var(--art-paper)"/><circle cx="32" cy="32" r="11" fill="var(--art-fill)"/><circle cx="33" cy="31" r="4" fill="var(--art-ink)"/><path d="M14 16l4 5m28-5-4 5M32 6v8"/>',
 harvest:'<path d="M16 53 36 19m-1-1q-10-10-3-12 29 1 25 24-5-13-22-12Z" fill="var(--art-paper)"/><path d="m10 36 12 7m-3-20 9 9" stroke="var(--art-red)"/>',
 arrow:'<path d="M9 49 48 10m-19 4 20-5-4 20M9 33l1 15 14 3m-8-29 4 12 13 4" fill="none"/>',
 heal:'<path d="M12 15q12-7 20 5 8-12 20-5 16 17-20 39C-4 32-4 32 12 15Z" fill="var(--art-red)"/><path d="M32 25v17m-8-9h16" stroke="var(--art-paper)"/>',
 brace:'<path d="M14 49V22l18-12 18 12v27Z" fill="var(--art-fill)"/><path d="M21 49V26l11-8 11 8v23M8 54h48"/><path d="M26 32h12m-6-6v18"/>',
 counter:'<path d="M19 51V15l21-8 8 29-17 20Z" fill="var(--art-fill)"/><path d="M12 32h29m-10-9 10 9-10 9M49 9l7 5m-4 9 8 1" fill="none"/>',
 jar:'<path d="M19 10h26v8H19Zm3 8-9 16v20q19 6 38 0V34l-9-16" fill="var(--art-paper)"/><path d="m31 28 3 8 9 1-7 5 2 9-7-5-8 5 3-9-7-5 9-1Z" fill="var(--art-gold)"/>',
 wave:'<path d="M8 41q4-19 16-11t18-12q21 25 9 35H10Z" fill="var(--art-fill)"/><path d="M12 47q9-11 20-4t20-7M15 14l4 6m13-14 1 9m15-7-3 9" fill="none"/>',
 tower:'<path d="M14 54V18h9V9h8v9h8V9h8v9h7v36Z" fill="var(--art-fill)"/><path d="M27 54V39a7 7 0 0 1 14 0v15M22 26h5m12 0h6"/>',
 spark:'<path d="m32 6 8 19 18 7-18 8-8 18-8-18-18-8 18-7Z" fill="var(--art-gold)"/><path d="M32 18v27m-14-13h27" stroke="var(--art-paper)"/>',
 flame:'<path d="M37 5q1 16 12 25 14 26-16 29C7 58 6 39 20 24q-2 15 7 14Z" fill="var(--art-red)"/><path d="M34 33q-16 18 0 21 10-2 0-21Z" fill="var(--art-gold)"/>',
 meditate:'<circle cx="32" cy="32" r="20" fill="var(--art-fill)"/><path d="M32 15a17 17 0 1 0 15 25M11 32h11m20 0h11M32 11v11m0 20v11" fill="none"/>',
 overload:'<circle cx="32" cy="32" r="13" fill="var(--art-gold)"/><path d="m7 7 15 15m20 20 15 15M7 57l15-15m20-20L57 7M7 22v-15h15m20 0h15v15m0 20v15H42M22 57H7V42"/>',
 ward:'<path d="m32 6 23 12v20L32 58 9 38V18Z" fill="var(--art-fill)"/><path d="m32 17 5 11 12 4-12 5-5 11-5-11-12-5 12-4Z" fill="var(--art-paper)"/>',
 blood:'<path d="m32 7 15 26q12 24-15 25-27-1-15-25Z" fill="var(--art-red)"/><path d="M32 27v20m-9-10h18" stroke="var(--art-paper)"/>',
};
const skillMotif:Record<string,string>=Object.fromEntries(['cleave:star','sunder:fracture','sweep:sweep','follow:echo','executioner:comet','battleflow:absorb','grit:grit','flurry:triple','venomcut:venom','serration:cut','foresight:eye','harvest:harvest','pursuit:arrow','siphon:heal','shieldstrike:def','brace:brace','riposte:counter','reservoir:jar','shockwave:wave','fortitude:grit','aegis:tower','spark:spark','firstaid:heal','ember:flame','meditation:meditate','overload:overload','spellward:ward','bloodcast:blood'].map(s=>s.split(':')));
export function gameIcon(name:string,frame=false):string {
 const motif=motifs[skillMotif[name]??name]??motifs.skills;
 return `<svg class="game-icon ${frame?'icon-medallion':''}" viewBox="0 0 64 64" aria-hidden="true">${frame?'<path class="icon-surround" d="M32 2 58 17v30L32 62 6 47V17Z" fill="var(--art-ground)" stroke="var(--art-rim)" stroke-width="1.5"/>':''}<g fill="none" stroke="var(--art-ink)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" ${frame?'transform="translate(8 8) scale(.75)"':''}>${motif}</g></svg>`;
}

export function locationArt(world:'academy'|'library',stage:number,index:number):string {
 const library=world==='library',variant=(stage+index)%4;
 const drawings=library?[
 '<path d="M18 61h64v7H18Zm6 7v14m52-14v14M31 59l-3-27 21 4 4 26m-4-26 22-5-3 28" fill="var(--art-paper)"/><path d="M31 40l13 3m-12 4 12 3m12-9 11-4m-12 11 11-4"/>',
 '<path d="M20 18h61v65H20Z" fill="var(--art-fill)"/><path d="M25 39h51M25 61h51M31 22v15m9-15v15m8-14 5 13m10-14v15m-32 7v15m10-15v15m11-14 4 14m8-14v14m-36 6v15m10-15v15m11-15v15m11-14 5 14"/>',
 '<path d="M19 78h64M27 77V29h50v48Z" fill="var(--art-fill)"/><path d="M33 34h38v18H33Zm0 24h38v13H33Z" fill="var(--art-paper)"/><path d="M43 43h17m-9 19h6M39 17h29v12H39Z"/>',
 '<path d="m23 72 3-46 23 5 24-7 6 47-27 8Z" fill="var(--art-paper)"/><path d="m49 31 3 48m-19-39 10 2m-10 7 10 2m15-13 10-3m-10 12 10-2"/><path d="m41 15 9-7 10 7-10 9Z" fill="var(--art-gold)"/>',
 ]:[
 '<path d="M19 80V36h63v44H19Z" fill="var(--art-fill)"/><path d="m13 36 38-24 38 24Z" fill="var(--art-red)"/><path d="M42 80V57q9-13 18 0v23M26 45h9v14h-9m41-14h9v14h-9" fill="var(--art-paper)"/><path d="M9 83h84"/>',
 '<path d="M16 75q35 17 70 0v7q-35 16-70 0Z" fill="var(--art-fill)"/><path d="M25 63q26 12 52 0v9q-26 12-52 0Zm19-9V26h14v28" fill="var(--art-paper)"/><path d="M38 26q13-17 26 0M52 25V9m-4 11-6-8m14 8 7-8M29 54Q9 32 18 28m56 27q20-22 11-27" fill="none"/>',
 '<path d="M15 81V43q3-28 36-31 34 3 36 31v38Z" fill="var(--art-fill)"/><path d="M16 45h70M51 13v68M28 25v55m46-55v55M15 62h72"/><path d="M38 81V64h27v17" fill="var(--art-paper)"/><path d="m41 65-9-13m25 13 12-15"/>',
 '<path d="M31 82V30h42v52Z" fill="var(--art-fill)"/><path d="m26 30 26-22 26 22Z" fill="var(--art-red)"/><circle cx="52" cy="47" r="12" fill="var(--art-paper)"/><path d="M52 38v10h8M45 82V68h14v14M22 83h61"/>',
 ];
 return `<svg class="location-art" viewBox="0 0 100 94" aria-hidden="true"><ellipse cx="51" cy="84" rx="40" ry="5" fill="var(--art-shadow)"/><g fill="none" stroke="var(--art-ink)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${drawings[variant]}</g></svg>`;
}

export function panelFlourish():string {return '<svg class="panel-flourish" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true"><path d="M1 13V4h52m194 0h52v9M64 4h63m46 0h63M137 4l13-3 13 3-13 4Z" fill="none" stroke="var(--art-rim)" stroke-width="1"/><circle cx="58" cy="4" r="1.5" fill="var(--art-rim)"/><circle cx="242" cy="4" r="1.5" fill="var(--art-rim)"/></svg>';}
