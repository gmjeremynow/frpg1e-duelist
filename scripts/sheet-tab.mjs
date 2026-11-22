/** Duelist tab on the character and NPC sheets: bonuses, parrying the death blow, identification, school and reminders. */
import * as DU from "./rules.mjs";

const MID = DU.MID;
const esc = s => (globalThis.foundry?.utils?.escapeHTML ? foundry.utils.escapeHTML(String(s ?? "")) : String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]));
const box = (title, body) => `<div class="box"><h3 class="box-title">${title}</h3>${body}</div>`;
const flag = (actor, k) => actor.getFlag?.(MID, k) ?? actor.flags?.[MID]?.[k];

export function renderDuelistTab(app, element) {
  const root = element instanceof HTMLElement ? element : element?.[0] ?? app.element;
  const actor = app.actor ?? app.document;
  if (!root || !actor || !["character", "npc"].includes(actor.type)) return;
  const tabs = root.querySelector(".sheet-tabs"), scroll = root.querySelector(".tab-scroll");
  root.querySelector(".tab-body[data-tab='duelist']")?.remove();
  tabs?.querySelector("[data-tab='duelist']")?.remove();
  const html = tabHTML(actor);
  if (!tabs || !scroll || !html) return;
  const btn = document.createElement("button");
  btn.type = "button"; btn.dataset.action = "sheetTab"; btn.dataset.tab = "duelist"; btn.textContent = "Duelist";
  tabs.append(btn);
  const sec = document.createElement("section");
  sec.className = "tab-body du-tab"; sec.dataset.tab = "duelist"; sec.innerHTML = html;
  scroll.append(sec);
  if (app._tab === "duelist") { btn.classList.add("active"); sec.classList.add("active"); }
  sec.querySelector("[data-du='parry']")?.addEventListener("click", () => rollParry(actor));
  sec.querySelector("[data-du='reset']")?.addEventListener("click", () => actor.setFlag(MID, "parries", 0));
  sec.querySelector("[data-du='identify']")?.addEventListener("click", () => rollIdentify(actor));
  sec.querySelector("[data-du='students']")?.addEventListener("click", () => rollStudents(actor));
}

const duelLevel = actor => (actor.system.classInfo ?? []).find(x => x.key === DU.KEY)?.level ?? 0;

/** The tab's HTML, or "" when the actor has no duelist class. */
export function tabHTML(actor) {
  const L0 = duelLevel(actor);
  if (!L0) return "";
  const L = Math.min(DU.MAX_LEVEL, L0);
  const b = DU.bonuses(L);
  const parries = Number(flag(actor, "parries") ?? 0);
  const out = [];
  out.push(box(`Duelist ${L}: ${esc(DU.title(L))} <span class="hint">(${DU.SRC})</span>`, `
    <table class="du-table">
      <tr><th>Against hand-held weapons</th><td>AC +${b.ac}; to hit and damage +${b.combat} (+${b.same} vs. the same weapon)</td><td class="hint">Not against missiles. Choose the opponent's weapon in the attack dialog; the AC bonus is not applied automatically.</td></tr>
      <tr><th>Hit dice</th><td>${DU.hpText(L)} (d12)</td><td class="hint">10 dice at 10th level, then 2 hit points a level.</td></tr>
      <tr><th>Surprise</th><td>Surprised only on 1 (d6)</td><td class="hint">A code of “honor”: dislikes attacking by surprise in a one-on-one fight.</td></tr>
      <tr><th>Fear</th><td>Saves +2</td><td class="hint">Against fear attacks.</td></tr>
      <tr><th>Morale</th><td>+10%</td><td class="hint">Fighting size S or M humanoids hand to hand; associates too, if they know him for a duelist.</td></tr>
      <tr><th>Two weapons</th><td>Off-hand penalty 1 less</td><td class="hint">Only against other two-weaponed humanoids or plain monsters; never for an advantage over a one-weaponed opponent, except in life-or-death situations. Not applied automatically.</td></tr>
    </table>`));
  out.push(box("Parrying the death blow", `<p>When a hit from a hand-held weapon used by a weapon-user would take the duelist to 0 hit points or lower: a save vs. death. The first in a melee: success means no damage. The second (not in the same round, before any hit points are regained): success means half damage, reduced to leave 1 hit point if needed. No third save in the same melee unless hit points have been restored. Optional while the opponent's minimum damage is less than the duelist's hit points; compulsory when it is not. Only one parry a round.</p>
    <p><button type="button" data-du="parry"><i class="fa-solid fa-shield-halved"></i> Parry the death blow</button> <span class="hint">Used this melee: ${parries}</span> <button type="button" data-du="reset">New melee / healed</button></p>`));
  const ident = DU.identifyChance(L);
  const later = [[7, "May have henchmen (none before 7th level)."], [10, `Identifies the magical properties of weapons usable by duelists: ${ident || 50}% (5% a level), one try per weapon per level.`],
    [10, "Fencingmaster: may open a fencing school in a large town or city (a swordsmith is required). Students: 5d6, +1 per 3 points of charisma, at most 30; 200 g.p. a month each. Each uninterrupted month gives a student 10% (cumulative, at most 60%) to gain +1 to hit with the master's preferred weapon, rolled once at the end; failure means starting over. More than 3 days' adventuring a month interrupts the training and costs that month's income. No followers at name level."]];
  out.push(box("By level", `<ul class="du-list">${later.map(([lv, t]) => `<li class="${L >= lv ? "" : "du-later"}">${L >= lv ? "" : `<em>From ${DU.ord(lv)} level:</em> `}${t}</li>`).join("")}</ul>
    <p>${ident ? `<button type="button" data-du="identify"><i class="fa-solid fa-magnifying-glass"></i> Identify a weapon (${ident}%)</button> ` : ""}${L >= 10 ? `<button type="button" data-du="students"><i class="fa-solid fa-users"></i> Roll students</button>` : ""}</p>`));
  out.push(box("Rules to remember", `<ul class="du-list">
    <li>Always a non-player character. Strength 9, intelligence 10, dexterity 15, constitution 9 or more; dexterity 17+: +10% experience. 9th level needs dexterity 17, 10th and higher 18. Human or half-elf. Never lawful.</li>
    <li>Leather armor only, no shield. Dagger, scimitar (cutlass, sabre), quarterstaff, bastard, broad, long and short swords. No oil, no poison.</li>
    <li>Fighter combat and saving throw tables; as a fighter for psionics, magic items and anything not stated otherwise.</li>
    <li>Experience for foes from the Assassination Experience Points table (DMG) for every opponent overcome in single, open combat; the opponent must be armed with a weapon, not only natural weaponry. Only if the fight is entirely in the open, unless the victim surprised the duelist.</li>
  </ul>`));
  return out.join("");
}

async function card(actor, title, sub, roll, lines) {
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: roll ? [].concat(roll) : [],
    content: `<div class="frpg1e-card"><header class="card-head"><div><div class="card-title">${esc(actor.name)}: ${esc(title)}</div><div class="card-sub">${esc(sub)}</div></div></header>${lines.map(l => `<p>${l}</p>`).join("")}</div>` });
}

export async function rollParry(actor) {
  const used = Number(flag(actor, "parries") ?? 0);
  if (used >= 2) return ui.notifications.warn("No third parry in this melee until hit points have been restored.");
  const need = actor.system.saves?.ppd?.value ?? 20;
  const r = await new Roll("1d20").evaluate();
  const ok = r.total >= need;
  await actor.setFlag(MID, "parries", used + 1);
  const res = !ok ? "Failed: full damage." : used === 0 ? "Parried: no damage." : "Parried: half damage, reduced if needed to leave 1 hit point.";
  return card(actor, "Parrying the death blow", `${used === 0 ? "First" : "Second"} parry this melee; save vs. death ${need}`, r, [`<strong>${r.total}</strong>: ${res}`]);
}

export async function rollIdentify(actor) {
  const pct = DU.identifyChance(duelLevel(actor));
  if (!pct) return null;
  const r = await new Roll("1d100").evaluate();
  return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), rolls: [r], whisper: ChatMessage.getWhisperRecipients("GM"),
    content: `<div class="frpg1e-card"><header class="card-head"><div><div class="card-title">${esc(actor.name)}: identify weapon</div><div class="card-sub">${pct}%</div></div></header><div class="roll-line"><span class="adnd-big">${r.total}</span> <strong>${r.total <= pct ? "Identified" : "Not identified (no new try at this level)"}</strong></div></div>` });
}

export async function rollStudents(actor) {
  const cha = actor.system.abilities?.cha?.value ?? 0;
  const r = await new Roll("5d6").evaluate();
  const n = Math.min(30, r.total + Math.floor(cha / 3));
  return card(actor, "Fencing school students", `5d6 + ${Math.floor(cha / 3)} (charisma ${cha}), at most 30`, r, [`<strong>${n}</strong> students: ${(n * 200).toLocaleString()} g.p. a month.`]);
}
