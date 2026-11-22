/**
 * Duelist (Dragon #73) for 1e FRPG (Table Edition). An optional add-on: enable or disable it in Manage Modules.
 * Registers the duelist from "The Duelist" (Arthur Collins, Dragon #73, May 1983),
 * adds a Duelist tab, and builds a world compendium with the rules.
 */
import * as DU from "./rules.mjs";
import { renderDuelistTab } from "./sheet-tab.mjs";
import { offerImport, importCompendia } from "./compendia.mjs";

const MID = DU.MID;
let API = null;

Hooks.once("frpg1e.init", api => {
  API = api;
  if (!api.hideClasses) { console.error(`${MID} | needs 1e FRPG 0.38.0 or later`); return; }
  api.registerClass(DU.KEY, DU.classDef());
});

Hooks.once("init", () => {
  game.settings.register(MID, "compendiaVersion", { scope: "world", config: false, type: String, default: "" });
  game.settings.registerMenu(MID, "rebuild", { name: "Duelist compendium", label: "Rebuild the duelist compendium", icon: "fa-solid fa-book",
    type: class extends foundry.applications.api.ApplicationV2 { render() { importCompendia({ confirm: true }); return this; } }, restricted: true });
  game.duelist = { importCompendia, rules: DU };
});

Hooks.once("ready", () => {
  if (!API?.hideClasses) ui.notifications.error("Duelist needs 1e FRPG (Table Edition) 0.38.0 or later.", { permanent: true });
  else if (game.user.isGM) offerImport();
});

/** Requirement notes on the Record tab. Nothing here changes the numbers. */
export function prepareDuelist(sys, items = []) {
  const classes = sys.classInfo ?? [];
  const c = classes.find(x => x.key === DU.KEY);
  if (!c) return;
  const notes = sys.settingNotes ?? (sys.settingNotes = []);
  const T = "Duelist (Dragon #73)";
  const ab = sys.abilities ?? {};
  const L = c.level ?? 1;
  const low = Object.entries(DU.MINIMUMS).filter(([k, m]) => (ab[k]?.value ?? 0) < m).map(([k, m]) => `${k.toUpperCase()} ${m}`);
  if (low.length) notes.push(`${T}: below the minimum ability scores (${low.join(", ")}).`);
  const race = String(sys.details?.race ?? "");
  if (race && !/^(human|half-elf)/.test(race)) notes.push(`${T}: duelists are human or half-elf.`);
  if (L > DU.dexLimit(ab.dex?.value ?? 0)) notes.push(`${T}: ${L >= 10 ? "10th level and higher needs dexterity 18" : "9th level needs dexterity 17"}.`);
  if (L > DU.MAX_LEVEL) notes.push(`${T}: the class ends at 15th level (Grand Fencingmaster).`);
  if (classes.length > 1) notes.push(`${T}: the article gives no multi-classed duelists.`);
  const al = String(sys.details?.alignment ?? "").toLowerCase();
  if (al && /lawful|^l[gne]$/.test(al)) notes.push(`${T}: duelists are never lawful.`);
  const list = Array.isArray(items) ? items : [...(items ?? [])];
  for (const a of list.filter(i => i.type === "armor" && i.system?.equipped && !/^leather armor/i.test(i.name)))
    notes.push(`${T}: leather armor only, no shield (${a.name}).`);
  for (const w of list.filter(i => i.type === "weapon" && !i.system?.natural && !DU.ALLOWED_WEAPONS.test(i.name)))
    notes.push(`${T}: ${w.name} is not a duelist's weapon (dagger, scimitar, quarterstaff, bastard, broad, long or short sword).`);
}
Hooks.on("frpg1e.prepareCharacter", (sys, items) => prepareDuelist(sys, items));
Hooks.on("renderCharacterSheet", (app, element) => renderDuelistTab(app, element));
