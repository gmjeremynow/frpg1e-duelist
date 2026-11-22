# Duelist (Dragon #73) for 1e FRPG, v0.2.0

An optional class module for the 1e FRPG system for Foundry VTT (system 0.38.0 or later). It adds the duelist: a hired sword who lives by his skill in single combat, with d12 hit dice, bonuses against opponents armed with weapons, a last-ditch parry against the killing blow, and, from 10th level, a fencing school. The article presents duelists as non-player characters. Turn the module on or off in Manage Modules.

Based on Arthur Collins' article "The Duelist: a chaotic non-player character who likes to make people pay" (Dragon #73, May 1983, p.7-9). The rules are restated in plain words; the numbers (the experience level table, the bonus table and the special abilities) follow the article. You need the article for its original text.

## Install

In Foundry's Setup screen, go to Add-on Modules, Install Module, and paste this manifest URL:

`https://github.com/gmjeremynow/frpg1e-duelist/releases/latest/download/module.json`

## What it adds

- The class "Duelist (Dragon #73)": experience and titles from Beginner to Grand Fencingmaster (15th, the class limit), d12 hit dice (10, then +2 hit points a level), fighter attack and saving throw tables, fighter constitution bonus and exceptional strength, attacks per round as printed (1/1, 3/2 from 5th, 2/1 from 10th, 5/2 at 15th), 3 weapons and 1 more every 3 levels, −2 non-proficient.
- In the attack dialog with a melee weapon: what the opponent is using (a hand-held weapon, the same weapon, or something else). The combat bonus is added to hit and damage; the card notes the armor class bonus against that opponent.
- A Duelist tab: the bonuses at this level, surprise, fear, morale and two-weapon notes, a "Parry the death blow" roll (save vs. death, counting parries in the melee, with a reset), weapon identification from 10th level, a fencing school student roll, and reminders.
- Record tab notes, which never block anything: ability minimums, race, the dexterity needed for 9th (17) and 10th+ (18), a lawful alignment, more than one class, armor other than leather or any shield, weapons not allowed.
- A compendium with the article restated in plain words.

## Choices made here

- Nonweapon proficiency slots are a fighter's; the article doesn't give them.
- The combat bonus is offered only on the duelist's melee attacks, not his missile attacks.
- Not applied automatically: the armor class bonus (it depends on the attacker's weapon), surprise, +2 vs. fear, morale, the two-weapon penalty reduction.
