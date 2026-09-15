window.VERMIN_DATA = {
  "generated": "2026-09-15T12:15:45.454Z",
  "source": "/home/wnder/Documents/repos/obsVault",
  "tags": [
    "Ace",
    "Attack",
    "Crit",
    "Darkness",
    "Debuff",
    "Deck-manipulation",
    "Defense",
    "Discard",
    "Draw",
    "Exploit",
    "Frost",
    "MV",
    "Overfill",
    "Radiance",
    "Retaliation",
    "Sacrifice",
    "Summon",
    "Support",
    "Versatility"
  ],
  "keywords": [
    {
      "slug": "clubs",
      "name": "Clubs",
      "color": "blue",
      "terms": [
        "Clubs",
        "club",
        "clubs",
        "♣"
      ],
      "explanation": "Clubs are one of the two blue suits. EDIT ME — this is placeholder text."
    },
    {
      "slug": "diamonds",
      "name": "Diamonds",
      "color": "red",
      "terms": [
        "Diamonds",
        "diamond",
        "diamonds",
        "♦"
      ],
      "explanation": "Diamonds are one of the two red suits. EDIT ME — this is placeholder text."
    },
    {
      "slug": "hearts",
      "name": "Hearts",
      "color": "red",
      "terms": [
        "Hearts",
        "heart",
        "hearts",
        "♥"
      ],
      "explanation": "Hearts are one of the two red suits. EDIT ME — this is placeholder text."
    },
    {
      "slug": "magic",
      "name": "Magic",
      "color": "red",
      "terms": [
        "Magic",
        "magic",
        "arcane"
      ],
      "explanation": "Classes marked Magic draw on the Arcane deck. They tend to trade raw stats for reach and utility, and scale off MV. EDIT ME — this is placeholder text."
    },
    {
      "slug": "power",
      "name": "Power",
      "color": "blue",
      "terms": [
        "Power",
        "power",
        "martial"
      ],
      "explanation": "Classes marked Power win through the board rather than through spells. They lean on stats, tempo and direct damage. EDIT ME — this is placeholder text."
    },
    {
      "slug": "spades",
      "name": "Spades",
      "color": "blue",
      "terms": [
        "Spades",
        "spade",
        "spades",
        "♠"
      ],
      "explanation": "Spades are one of the two blue suits. EDIT ME — this is placeholder text."
    }
  ],
  "classes": [
    {
      "slug": "barbarian",
      "name": "Barbarian",
      "affiliation": "Power",
      "mechanic": "As an attack, you can attack with a random draw of 2 cards from the Life deck instead",
      "playstyle": "Blind attacks give you a Risk-Reward playstyle, with offensive and defensive tools to Overwhelm enemies, while tanking all the damage.",
      "ratings": [],
      "skills": [
        {
          "name": "Cull the Weak",
          "file": "Cull the Weak",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Crit"
          ],
          "effect": "Blind attacks gain a flat +3 MV bonus if the target enemy is currently below half of its maximum Life."
        },
        {
          "name": "Heavy Momentum",
          "file": "Stagger",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Defense"
          ],
          "effect": "If both cards revealed during a blind attack are Black suits, the target enemy is staggered and cannot execute its round-end attack."
        },
        {
          "name": "Instinctive Guard",
          "file": "Thick hide",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Defense"
          ],
          "effect": "When defending against an enemy counter-attack, flip 1 card from the top of the Life deck and add its MV to your defense total before discarding cards from your hand."
        },
        {
          "name": "Relentless volly",
          "file": "Relentless volly",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Discard"
          ],
          "effect": "When performing a blind attack, reveal 3 cards from the deck instead of 2; choose 2 to combine for the strike and discard the third to the Death deck."
        },
        {
          "name": "Retaliatory Strike",
          "file": "Unforgiving Vengance",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Defense"
          ],
          "effect": "When you take non-counter-attack damage (such as round-end enemy assaults or hazard strikes), immediately retaliate with a 1-card blind attack against the attacking enemy."
        },
        {
          "name": "Wild Cleave",
          "file": "Voilent momentum",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Crit"
          ],
          "effect": "Excess damage dealt beyond a target enemy's remaining Life during a blind attack carries over directly to an adjacent enemy."
        },
        {
          "name": "Blood Rage",
          "file": "Reckless offense",
          "tier": 2,
          "trigger": "Passive",
          "tags": [
            "Discard"
          ],
          "effect": "Permanently decrease your maximum hand size by 1. All your blind attacks gain a flat +2 MV bonus."
        },
        {
          "name": "Endless Frenzy",
          "file": "Endless vollie",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Crit"
          ],
          "effect": "If a blind attack results in a critical hit (Life die wins or doubles roll), you may immediately perform a second blind attack this turn."
        },
        {
          "name": "Shatter Guard",
          "file": "Flawless stance",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Crit"
          ],
          "effect": "If a blind attack reveals two cards of the exact same value (a pair), the strike automatically crits (+highest card MV). If the attack already contains a Spade, it deals guaranteed 2x damage instead."
        },
        {
          "name": "Unbridled Fury",
          "file": "Vangfull rage",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Crit"
          ],
          "effect": "Discard 2 cards from your hand before a blind attack to treat both drawn cards as Spades (triggering the 2d12 critical check)."
        },
        {
          "name": "Berserker Nova",
          "file": "Dystractive behivior",
          "tier": 3,
          "trigger": "Action",
          "tags": [
            "Discard"
          ],
          "effect": "Discard your entire hand (minimum 2 cards) to execute an overwhelming 3-card blind attack, combining all three drawn cards into a single strike without paying extra card costs."
        },
        {
          "name": "Rampage",
          "file": "Life of Battle",
          "tier": 3,
          "trigger": "Passive",
          "tags": [
            "Crit"
          ],
          "effect": "When your attack lands the killing blow on an enemy, immediately perform a free blind attack targeting another active enemy."
        }
      ]
    },
    {
      "slug": "cleric",
      "name": "Cleric",
      "affiliation": "Magic",
      "mechanic": "Draws triggered by your Hearts over fill 1 card for each player.",
      "playstyle": "Take full advantage of card draws, keeping the team safe, buffing allies, debuffing enemies using frost, or turning draws into an offensive tool.",
      "ratings": [],
      "skills": [
        {
          "name": "beacon of light",
          "file": "beacon of light",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Support"
          ],
          "effect": "Attacks using Diamonds heal the Life deck by an additional +2 MV if your current hand is completely full."
        },
        {
          "name": "Beacon of Vitality",
          "file": "Beacon of Vitality",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Support"
          ],
          "effect": "When you play a Heart, you choose which player receives the first draw, regardless of turn order."
        },
        {
          "name": "Blessed Vigor",
          "file": "Blessed Vigor",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Overfill"
          ],
          "effect": "Allies holding an overfilled hand deal +1 flat MV on their first attack each round."
        },
        {
          "name": "Frostbite",
          "file": "Frostbite",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Frost"
          ],
          "effect": "Playing a Club applies a 2 MV Frostbite debuff to the target enemy, permanently reducing its counter-attack MV by 2."
        },
        {
          "name": "Martyr's Intercession",
          "file": "Martyr's Intercession",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Sacrifice"
          ],
          "effect": "Discard 1 card from your hand to absorb up to 4 incoming counter-attack damage aimed at an adjacent ally."
        },
        {
          "name": "Swords of fallen alies",
          "file": "Swords of fallen alies",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Radiance"
          ],
          "effect": "When drawing cards using the Heart suit. drawn spades immediately discard for 2 damage against the enemy"
        },
        {
          "name": "Wages of sin",
          "file": "Wages of sin",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Radiance"
          ],
          "effect": "When you play a Diamond, the next player in turn order gains +2 MV to their attack this round."
        },
        {
          "name": "Consecrated Strike",
          "file": "Radiant smite",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Radiance"
          ],
          "effect": "Your attacks with Diamonds also deal splash damage to secondary enemies equal to half MV."
        },
        {
          "name": "Mercy's Boon",
          "file": "Mercy's Boon",
          "tier": 2,
          "trigger": "Reaction",
          "tags": [
            "Support"
          ],
          "effect": "If an ally's attack fails to defeat an enemy, you may immediately play a low-rank Heart (1–3) from hand as a reaction to heal the party without triggering an extra counter-attack."
        },
        {
          "name": "Purifying Nova",
          "file": "Bables fall",
          "tier": 2,
          "trigger": "Action",
          "tags": [
            "Radiance"
          ],
          "effect": "Upon reaching a full hand, you may immediately discard your entire hand to deal 6 flat damage to an enemy without triggering a counter-attack."
        },
        {
          "name": "Vow of Poverty",
          "file": "Vow of Poverty",
          "tier": 2,
          "trigger": "Passive",
          "tags": [
            "Sacrifice"
          ],
          "effect": "Permanently reduce your own maximum hand size by 1. in turn, you can now over fill +1."
        },
        {
          "name": "Winters plauge",
          "file": "Winters plauge",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Frost"
          ],
          "effect": "Enemies applied with frost will roll 2D12 before counter attacking, rolling the Death die will make them loss control, attaking thier allies or themselvs, the cleansing the frost effect. rolling a double will cause them to hit without the frost debuff"
        },
        {
          "name": "Snow grave",
          "file": "Snow grave",
          "tier": 3,
          "trigger": "Attack",
          "tags": [
            "Frost"
          ],
          "effect": "Playing the 10 of spades (or higher) casts Snow grave, turning all opponets MV to 0 until your next turn. can be cast once pre battle."
        }
      ]
    },
    {
      "slug": "lich",
      "name": "Lich",
      "affiliation": "Magic",
      "mechanic": "At battle start and preparation phase, you can discard 2 cards to draw one of the 3 top death deck cards",
      "playstyle": "Utilise the Death deck, summon powerful units, and hit enemies with big numbers.",
      "ratings": [],
      "skills": [
        {
          "name": "Bastion of Bone",
          "file": "Bastion of Bone",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Defense"
          ],
          "effect": "When you defend against an incoming attack using exactly one card, that card provides +5 additional MV toward your defense total."
        },
        {
          "name": "Blood Tithe",
          "file": "Blood Tithe",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Discard"
          ],
          "effect": "When making an attack, you may discard any number of cards from your hand to add +2 MV to the strike for each card discarded."
        },
        {
          "name": "Bone Remnant",
          "file": "Bone Remnant",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Summon"
          ],
          "effect": "When defending against an attack, the lowest-value card used to pay the defense cost is summoned to the board as an Undead bound to the attacking enemy instead of being discarded."
        },
        {
          "name": "Corpse Awakening",
          "file": "Corpse Awakening",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Summon"
          ],
          "effect": "When you play a Diamond card, the first card revived from the Death deck is summoned onto the board as an Undead bound to your target instead of returning to the Life deck."
        },
        {
          "name": "Cursed Blood",
          "file": "Cursed Blood",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "MV"
          ],
          "effect": "While holding 2 or fewer cards in your hand, all attacks made by you gain a flat +3 MV bonus."
        },
        {
          "name": "Death's Due",
          "file": "Death's Due",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Crit"
          ],
          "effect": "Spades played by you trigger their 2d12 critical check using your base affiliation, ignoring off-suit critical restrictions."
        },
        {
          "name": "Doom Mark",
          "file": "Doom Mark",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Darkness"
          ],
          "effect": "The last enemy you attacked becomes Marked. Whenever you discard a card from your hand for any reason, that Marked enemy takes 1 Darkness damage."
        },
        {
          "name": "Grim Harvest",
          "file": "Grim Harvest",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Darkness"
          ],
          "effect": "Whenever you trigger a Heart draw, every Black card drawn deals 2 Darkness damage to a target enemy instead of being added to your hand."
        },
        {
          "name": "Reanimate Thrall",
          "file": "Reanimate Thrall",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Summon"
          ],
          "effect": "When you use your class mechanic to draw from the Death deck by discarding, play that card onto the board as an Undead bound to a target instead of adding it to your hand. On your turn, the Undead attacks its target for its printed MV without triggering a counter-attack. When its target dies, the Undead is sent to the Death deck."
        },
        {
          "name": "Siphon Soul",
          "file": "Siphon Soul",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Draw"
          ],
          "effect": "When attacking with Diamonds, you may choose to revive 1 card from the Death deck straight into your hand instead of returning it to the Life deck."
        },
        {
          "name": "Soul Harvest",
          "file": "Soul Harvest",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Discard"
          ],
          "effect": "Whenever an enemy dies, look at the top 3 cards of the Death deck and add 1 directly into your hand; return the rest to the top of the Death deck."
        },
        {
          "name": "Danse Macabre",
          "file": "Danse Macabre",
          "tier": 2,
          "trigger": "Reaction",
          "tags": [
            "Summon"
          ],
          "effect": "When any active enemy dies, you may immediately play that defeated enemy card onto the board as an Undead summon bound to another active enemy."
        },
        {
          "name": "Dark Conjuration",
          "file": "Dark Conjuration",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Summon"
          ],
          "effect": "You may play any attack card from your hand onto the board as an Undead summon instead of attacking directly, dealing its MV as summon damage without triggering an enemy counter-attack."
        },
        {
          "name": "Death Toll",
          "file": "Death Toll",
          "tier": 2,
          "trigger": "Action",
          "tags": [
            "Discard"
          ],
          "effect": "Discard an Ace from your hand: Reveal the top 5 cards of the Death deck, choose 1 card to give to each player, and return any unchosen cards to the top of the Death deck."
        },
        {
          "name": "Death Trance",
          "file": "Death Trance",
          "tier": 2,
          "trigger": "Action",
          "tags": [
            "Discard"
          ],
          "effect": "Instead of attacking, discard your entire hand to draw that exact number of cards directly from the top of the Death deck."
        },
        {
          "name": "Grave Robbery",
          "file": "Grave Robbery",
          "tier": 2,
          "trigger": "Reaction",
          "tags": [
            "Discard"
          ],
          "effect": "When an ally plays a card of rank 8 or higher that is sent to the Death deck, you may discard 2 Diamond cards from your hand to immediately intercept that high-rank card into your own hand."
        },
        {
          "name": "Legion of the Damned",
          "file": "Legion of the Damned",
          "tier": 2,
          "trigger": "Action",
          "tags": [
            "Summon"
          ],
          "effect": "Cards with an MV of 1–5 can be played from your hand onto the board as Undead summons without consuming your turn's attack action."
        },
        {
          "name": "Morbid Hunger",
          "file": "Morbid Hunger",
          "tier": 2,
          "trigger": "Reaction",
          "tags": [
            "Draw"
          ],
          "effect": "If your hand is completely empty immediately after successfully defending against an incoming attack, draw 1 card directly from the Death deck."
        },
        {
          "name": "Offering to the Void",
          "file": "Offering to the Void",
          "tier": 2,
          "trigger": "Preparation",
          "tags": [
            "Discard"
          ],
          "effect": "During your Preparation phase, instead of drawing a card or swapping, discard 4 cards from your hand to search the Death deck and take any 1 card of your choice directly into your hand."
        },
        {
          "name": "Ossuary Battery",
          "file": "Ossuary Battery",
          "tier": 2,
          "trigger": "Passive",
          "tags": [
            "Darkness"
          ],
          "effect": "Whenever an ally discards Black cards to defend, you may take any of those cards with an MV of 1–5 and place them into your personal Ossuary pile. On your turn, you may purge this pile to deal 2 Darkness damage per stored card to an enemy without triggering a counter-attack."
        },
        {
          "name": "Vampiric Drain",
          "file": "Vampiric Drain",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Draw"
          ],
          "effect": "Dealing 8 or more MV in a single strike allows you to immediately draw 2 cards directly from the Death deck into your hand."
        },
        {
          "name": "Cataclysm of the Void",
          "file": "Cataclysm of the Void",
          "tier": 3,
          "trigger": "Passive",
          "tags": [
            "Darkness"
          ],
          "effect": "If the Death deck is completely emptied, immediately deal 25 flat Darkness damage to an enemy. Then, re-separate the initial Life (1–5) and Death (6–10) decks and reset the encounter draw piles."
        },
        {
          "name": "Lichdom",
          "file": "Lichdom",
          "tier": 3,
          "trigger": "Action",
          "tags": [
            "Summon"
          ],
          "effect": "Discard 4 cards of rank 10 or higher to achieve Lichdom for the remainder of the battle. All attacks made by you and your Undead summons have their damage rounded up to 10 MV, and all Darkness damage dealt by your skills is doubled."
        }
      ]
    },
    {
      "slug": "mage",
      "name": "Mage",
      "affiliation": "Magic",
      "mechanic": "The mage attacks do not deal damage to enemies. Instead, the mage can cast power full spells using specific card combinations.",
      "playstyle": "",
      "ratings": [],
      "skills": []
    },
    {
      "slug": "monk",
      "name": "Monk",
      "affiliation": "Magic",
      "mechanic": "If you draw after attacking, you are able to add any 2, 3 or a matching attacking card to the attack, adding MV to the attack. this will triger another draw. max 2 reflexes per turn",
      "playstyle": "",
      "ratings": [],
      "skills": []
    },
    {
      "slug": "ranger",
      "name": "Ranger",
      "affiliation": "Magic & Power",
      "mechanic": "Duality: take advantage of both power and magic suits",
      "playstyle": "Jack of all trades: stack suits effects, utilise Aces, and exploit enemy vulnerabilities",
      "ratings": [],
      "skills": [
        {
          "name": "Animal Call",
          "file": "Animal Call",
          "tier": 1,
          "trigger": "Preparation",
          "tags": [
            "Ace"
          ],
          "effect": "During your Preparation phase, instead of your standard swap or draw, you may search the Life deck for any 1 chosen Ace and add it to your hand, then shuffle."
        },
        {
          "name": "Beast Companion",
          "file": "Beast Companion",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Summon"
          ],
          "effect": "Any Ace you play may remain on the board face-up as a Beast companion. While active, add +1 flat MV to all your attacks and parries. You may discard the Beast at any time to absorb 3 counter-attack damage."
        },
        {
          "name": "Called Shot",
          "file": "Called Shot",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Exploit"
          ],
          "effect": "If an enemy has a Red printed suit, your attacks against it deal +2 flat MV. If an enemy has a Black printed suit, your parries against it gain +2 flat MV."
        },
        {
          "name": "Camouflage",
          "file": "Camouflage",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Defense"
          ],
          "effect": "If the suit of your attack card matches the defending enemy's printed suit, that enemy cannot counter-attack you this turn."
        },
        {
          "name": "Feral Instinct",
          "file": "Feral Instinct",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Defense"
          ],
          "effect": "Aces in your hand can be discarded for defense against incoming counter-attacks as if they have an MV equal to the highest card currently in your hand."
        },
        {
          "name": "First Hunt",
          "file": "First Hunt",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Ace"
          ],
          "effect": "At the start of battle, search the Life deck and draw 1 Ace of your choice directly into your starting hand before taking opening actions."
        },
        {
          "name": "Greater Beasts",
          "file": "Greater Beasts",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Ace"
          ],
          "effect": "All Aces played by you count as 5 base MV instead of 1 MV."
        },
        {
          "name": "Hawkeye",
          "file": "Hawkeye",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Crit"
          ],
          "effect": "When you roll a critical miss (the Death die wins the 2d12 roll on a Spade attack), you may reroll one of the two dice."
        },
        {
          "name": "Quarry's Weakness",
          "file": "Quarry's Weakness",
          "tier": 1,
          "trigger": "Attack",
          "tags": [
            "Exploit"
          ],
          "effect": "When you attack an enemy, you may apply that enemy's printed suit effect to the attack in addition to your card's effect, regardless of what suit you attacked with."
        },
        {
          "name": "Resourceful Scavenger",
          "file": "Resourceful Scavenger",
          "tier": 1,
          "trigger": "Reaction",
          "tags": [
            "Ace"
          ],
          "effect": "When an ally discards an Ace to defend, you may immediately intercept it into your own hand instead of sending it to the Death deck."
        },
        {
          "name": "Tracker's Eye",
          "file": "Tracker's Eye",
          "tier": 1,
          "trigger": "Preparation",
          "tags": [
            "Deck-manipulation"
          ],
          "effect": "During Preparation, if you attacked an enemy on your previous turn, reveal the top 3 cards of the Life deck. You may swap any of your hand cards with any revealed cards that match the enemy's printed suit, returning the rest."
        },
        {
          "name": "Wild Adaptability",
          "file": "Wild Adaptability",
          "tier": 1,
          "trigger": "Passive",
          "tags": [
            "Versatility"
          ],
          "effect": "When playing a card, you may declare it to count as either its printed suit or the opposite color's paired suit (Heart to Club, Diamond to Spade) before resolving its effects."
        },
        {
          "name": "Apex Predator",
          "file": "Apex Predator",
          "tier": 2,
          "trigger": "Passive",
          "tags": [
            "Draw"
          ],
          "effect": "When an enemy dies, search the Life or Death deck for an Ace matching that enemy's printed suit and add it directly to your hand, then shuffle the deck."
        },
        {
          "name": "Counter Shot",
          "file": "Counter Shot",
          "tier": 2,
          "trigger": "Reaction",
          "tags": [
            "Retaliation"
          ],
          "effect": "Fully parrying an enemy counter-attack to 0 damage allows you to immediately play 1 card from your hand as bonus damage back to the attacker without triggering suit effects or counter-attacks."
        },
        {
          "name": "Crippling Arrow",
          "file": "Crippling Arrow",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Debuff"
          ],
          "effect": "Attacking with a card matching the enemy's printed suit applies a permanent 2 MV Frostbite debuff to that enemy, reducing its counter-attack MV by 2."
        },
        {
          "name": "Heartseeker",
          "file": "Heartseeker",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Attack"
          ],
          "effect": "When attacking with a Heart card, convert half of the total drawn MV into bonus attack damage dealt directly to the target enemy."
        },
        {
          "name": "Mark of the Hunter",
          "file": "Mark of the Hunter",
          "tier": 2,
          "trigger": "Action",
          "tags": [
            "Crit"
          ],
          "effect": "Spend an Ace from hand to Mark a target enemy. Whenever any ally attacks that Marked enemy using a card matching the enemy's printed suit, that strike automatically triggers a 2d12 critical check."
        },
        {
          "name": "Pack Revival",
          "file": "Pack Revival",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Draw"
          ],
          "effect": "When reviving cards from the Death deck using Diamonds, immediately draw all Aces residing in the Death deck directly into your hand."
        },
        {
          "name": "Prism Shot",
          "file": "Prism Shot",
          "tier": 2,
          "trigger": "Attack",
          "tags": [
            "Ace"
          ],
          "effect": "When you play an Ace as an attack, choose to trigger either both Magic effects (Heart Draw + Diamond Recycle) or both Power effects (Club Parry + Spade Crit) simultaneously."
        }
      ]
    },
    {
      "slug": "rogue",
      "name": "Rogue",
      "affiliation": "Power",
      "mechanic": "Same value cards that can be combined in attacks, do not take extra hand space. 3 twos take 1 hand space, 2 fours take 1 hand space. Additional combos can be learned",
      "playstyle": "",
      "ratings": [],
      "skills": []
    },
    {
      "slug": "tactician",
      "name": "Tactician",
      "affiliation": "Power",
      "mechanic": "During your preparation phase, you may choose not to swap a card with another player. Instead, place 1 card from your hand face down in front of any player as a Trap.",
      "playstyle": "",
      "ratings": [],
      "skills": []
    }
  ]
};
