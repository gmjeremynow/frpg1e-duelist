/**
 * The duelist (Arthur Collins, "The Duelist", Dragon #73, May 1983, p.7-9).
 * Pure data and functions, no Foundry calls, so the tests can load it directly.
 */
export const KEY = "duelist";
export const MID = "frpg1e-duelist";
export const SRC = "Dragon #73 p.7-9";

/** Experience level table (p.8). The class ends at 15th (Grand Fencingmaster). */
export const XP = [0, 2501, 5001, 10001, 20001, 40001, 80001, 160001, 320001, 640001, 960001, 1290001, 1600001, 1920001, 2220001];
export const MAX_LEVEL = 15;
export const TITLES = ["Beginner", "Brawler", "Fencer", "Challenger", "Gladiator", "Bladesman", "Master Bladesman", "Superior Duelist", "Expert Duelist",
  "Fencingmaster", "Fencingmaster, 11th", "Fencingmaster, 12th", "Fencingmaster, 13th", "Fencingmaster, 14th", "Grand Fencingmaster"];
export const title = L => TITLES[Math.min(MAX_LEVEL, Math.max(1, L)) - 1];
export const hpText = L => (L <= 10 ? `${Math.max(1, L)}` : `10+${2 * (Math.min(MAX_LEVEL, L) - 10)}`);

/** p.9: [AC bonus, combat bonus, combat bonus vs. same weapon] by level band. */
const BANDS = [[3, 1, 1, 1], [6, 2, 1, 2], [9, 3, 2, 3], [12, 4, 2, 4], [15, 5, 3, 5]];
export function bonuses(L) {
  const b = BANDS.find(([max]) => Math.max(1, L) <= max) ?? BANDS.at(-1);
  return { ac: b[1], combat: b[2], same: b[3] };
}
/** Identify magic weapons: 5% a level, from 10th. */
export const identifyChance = L => (L >= 10 ? 5 * L : 0);

export const MINIMUMS = { str: 9, int: 10, dex: 15, con: 9 };
/** 9th level and higher needs dexterity 17; 10th and higher, 18. */
export const dexLimit = dex => (dex >= 18 ? MAX_LEVEL : dex >= 17 ? 9 : 8);
export const ALLOWED_WEAPONS = /^(dagger|scimitar|cutlass|sabre|saber|staff, quarter|quarterstaff|sword, (bastard|broad|long|short))/i;

export const OPPONENT = { hand: "Opponent uses a hand-held weapon", same: "Opponent uses the same weapon", other: "Other (natural weapons, missiles, spells)" };
/** The attack dialog fields and bonuses (system 0.38.0 attackRules). */
export const attackRules = {
  dialog: (actor, item) => {
    if (!item || item.system?.attackType === "missile") return "";
    return `<div class="row"><span class="lbl">Duelist</span><select name="x-duelOpp">${Object.entries(OPPONENT).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></div>`;
  },
  bonus: ({ item, level, missile, extra }) => {
    if (missile || !item) return null;
    const opp = extra?.duelOpp ?? "hand";
    if (opp === "other") return null;
    const b = bonuses(level);
    const v = opp === "same" ? b.same : b.combat;
    return { mods: [{ label: opp === "same" ? "Duelist, same weapon" : "Duelist", hit: v, dmg: v }],
      notes: [`Duelist: armor class ${b.ac} better against this opponent's hand-held weapon.`] };
  }
};

export function classDef() {
  return {
    label: "Duelist (Dragon #73)", source: "Dragon #73", src: "Dragon #73",
    hitDie: 12, firstDice: 1, maxHD: 10, afterHP: 2, matrix: "fighter", save: "fighter",
    fighterCon: true, exceptionalStr: true, nonProf: -2, maxLevel: MAX_LEVEL,
    attacksPerRound: [[4, "1/1"], [9, "3/2"], [14, "2/1"], [null, "5/2"]],
    // 3 weapons at first, 1 more every 3 levels (p.8); nonweapon slots as a fighter
    profSlots: [3, 2, 1, 1, 3],
    xp: XP,
    attackRules
  };
}
export const ord = n => `${n}${[, "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10] ?? "th"}`;
