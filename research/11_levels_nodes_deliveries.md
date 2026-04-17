# Research Gap Fill #11 — Levels, Expansion Nodes, Deliveries, Chores

All data extracted from the official Sunflower Land repository, `main` branch, as of 2026-04-11. Source URLs cite the files Claude actually read.

---

## GAP 1 — Bumpkin XP level table (levels 1–200)

Source: `src/features/game/lib/level.ts` → `LEVEL_EXPERIENCE` (lines 203–404).
GitHub: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/level.ts#L203-L404

`LEVEL_EXPERIENCE[level]` is the total cumulative XP required to reach that level (so level 1 = 0, level 2 = 2 XP total, etc.). `MAX_BUMPKIN_LEVEL = 200` (line 406). Delta column = `LEVEL_EXPERIENCE[n] - LEVEL_EXPERIENCE[n-1]`.

| Level | Cumulative XP | Delta XP from previous |
|---|---|---|
| 1 | 0 | — |
| 2 | 2 | 2 |
| 3 | 22 | 20 |
| 4 | 205 | 183 |
| 5 | 555 | 350 |
| 6 | 1,155 | 600 |
| 7 | 2,155 | 1,000 |
| 8 | 3,405 | 1,250 |
| 9 | 5,405 | 2,000 |
| 10 | 7,905 | 2,500 |
| 11 | 10,905 | 3,000 |
| 12 | 14,405 | 3,500 |
| 13 | 18,405 | 4,000 |
| 14 | 22,905 | 4,500 |
| 15 | 27,905 | 5,000 |
| 16 | 33,655 | 5,750 |
| 17 | 40,155 | 6,500 |
| 18 | 47,405 | 7,250 |
| 19 | 55,405 | 8,000 |
| 20 | 64,155 | 8,750 |
| 21 | 73,905 | 9,750 |
| 22 | 84,655 | 10,750 |
| 23 | 96,405 | 11,750 |
| 24 | 109,155 | 12,750 |
| 25 | 122,905 | 13,750 |
| 26 | 137,405 | 14,500 |
| 27 | 152,905 | 15,500 |
| 28 | 169,405 | 16,500 |
| 29 | 186,905 | 17,500 |
| 30 | 205,405 | 18,500 |
| 31 | 225,405 | 20,000 |
| 32 | 246,905 | 21,500 |
| 33 | 269,905 | 23,000 |
| 34 | 294,405 | 24,500 |
| 35 | 320,405 | 26,000 |
| 36 | 348,405 | 28,000 |
| 37 | 378,405 | 30,000 |
| 38 | 410,405 | 32,000 |
| 39 | 444,405 | 34,000 |
| 40 | 480,405 | 36,000 |
| 41 | 518,905 | 38,500 |
| 42 | 559,905 | 41,000 |
| 43 | 603,405 | 43,500 |
| 44 | 649,405 | 46,000 |
| 45 | 697,905 | 48,500 |
| 46 | 749,405 | 51,500 |
| 47 | 803,905 | 54,500 |
| 48 | 861,405 | 57,500 |
| 49 | 921,905 | 60,500 |
| 50 | 985,405 | 63,500 |
| 51 | 1,053,905 | 68,500 |
| 52 | 1,127,405 | 73,500 |
| 53 | 1,205,905 | 78,500 |
| 54 | 1,289,405 | 83,500 |
| 55 | 1,377,905 | 88,500 |
| 56 | 1,476,405 | 98,500 |
| 57 | 1,584,905 | 108,500 |
| 58 | 1,703,405 | 118,500 |
| 59 | 1,831,905 | 128,500 |
| 60 | 1,970,405 | 138,500 |
| 61 | 2,128,905 | 158,500 |
| 62 | 2,287,405 | 158,500 |
| 63 | 2,485,905 | 198,500 |
| 64 | 2,704,405 | 218,500 |
| 65 | 2,942,905 | 238,500 |
| 66 | 3,221,405 | 278,500 |
| 67 | 3,539,905 | 318,500 |
| 68 | 3,898,405 | 358,500 |
| 69 | 4,296,905 | 398,500 |
| 70 | 4,735,405 | 438,500 |
| 71 | 5,233,905 | 498,500 |
| 72 | 5,743,905 | 510,000 |
| 73 | 6,263,905 | 520,000 |
| 74 | 6,793,905 | 530,000 |
| 75 | 7,333,905 | 540,000 |
| 76 | 7,883,905 | 550,000 |
| 77 | 8,443,905 | 560,000 |
| 78 | 9,013,905 | 570,000 |
| 79 | 9,593,905 | 580,000 |
| 80 | 10,183,905 | 590,000 |
| 81 | 10,783,905 | 600,000 |
| 82 | 11,393,905 | 610,000 |
| 83 | 12,013,905 | 620,000 |
| 84 | 12,643,905 | 630,000 |
| 85 | 13,283,905 | 640,000 |
| 86 | 13,933,905 | 650,000 |
| 87 | 14,593,905 | 660,000 |
| 88 | 15,263,905 | 670,000 |
| 89 | 15,943,905 | 680,000 |
| 90 | 16,633,905 | 690,000 |
| 91 | 17,333,905 | 700,000 |
| 92 | 18,043,905 | 710,000 |
| 93 | 18,763,905 | 720,000 |
| 94 | 19,493,905 | 730,000 |
| 95 | 20,233,905 | 740,000 |
| 96 | 20,983,905 | 750,000 |
| 97 | 21,743,905 | 760,000 |
| 98 | 22,513,905 | 770,000 |
| 99 | 23,293,905 | 780,000 |
| 100 | 24,083,905 | 790,000 |
| 101 | 24,893,905 | 810,000 |
| 102 | 25,723,905 | 830,000 |
| 103 | 26,573,905 | 850,000 |
| 104 | 27,443,905 | 870,000 |
| 105 | 28,333,905 | 890,000 |
| 106 | 29,243,905 | 910,000 |
| 107 | 30,173,905 | 930,000 |
| 108 | 31,123,905 | 950,000 |
| 109 | 32,093,905 | 970,000 |
| 110 | 33,083,905 | 990,000 |
| 111 | 34,093,905 | 1,010,000 |
| 112 | 35,123,905 | 1,030,000 |
| 113 | 36,173,905 | 1,050,000 |
| 114 | 37,243,905 | 1,070,000 |
| 115 | 38,333,905 | 1,090,000 |
| 116 | 39,443,905 | 1,110,000 |
| 117 | 40,573,905 | 1,130,000 |
| 118 | 41,723,905 | 1,150,000 |
| 119 | 42,893,905 | 1,170,000 |
| 120 | 44,083,905 | 1,190,000 |
| 121 | 45,293,905 | 1,210,000 |
| 122 | 46,523,905 | 1,230,000 |
| 123 | 47,773,905 | 1,250,000 |
| 124 | 49,043,905 | 1,270,000 |
| 125 | 50,333,905 | 1,290,000 |
| 126 | 51,653,905 | 1,320,000 |
| 127 | 53,003,905 | 1,350,000 |
| 128 | 54,383,905 | 1,380,000 |
| 129 | 55,793,905 | 1,410,000 |
| 130 | 57,233,905 | 1,440,000 |
| 131 | 58,708,905 | 1,475,000 |
| 132 | 60,218,905 | 1,510,000 |
| 133 | 61,763,905 | 1,545,000 |
| 134 | 63,343,905 | 1,580,000 |
| 135 | 64,958,905 | 1,615,000 |
| 136 | 66,613,905 | 1,655,000 |
| 137 | 68,308,905 | 1,695,000 |
| 138 | 70,043,905 | 1,735,000 |
| 139 | 71,818,905 | 1,775,000 |
| 140 | 73,633,905 | 1,815,000 |
| 141 | 75,493,905 | 1,860,000 |
| 142 | 77,398,905 | 1,905,000 |
| 143 | 79,348,905 | 1,950,000 |
| 144 | 81,343,905 | 1,995,000 |
| 145 | 83,383,905 | 2,040,000 |
| 146 | 85,473,905 | 2,090,000 |
| 147 | 87,613,905 | 2,140,000 |
| 148 | 89,803,905 | 2,190,000 |
| 149 | 92,043,905 | 2,240,000 |
| 150 | 94,333,905 | 2,290,000 |
| 151 | 95,662,605 | 1,328,700 |
| 152 | 97,031,166 | 1,368,561 |
| 153 | 98,440,783 | 1,409,617 |
| 154 | 99,892,688 | 1,451,905 |
| 155 | 101,388,150 | 1,495,462 |
| 156 | 102,928,475 | 1,540,325 |
| 157 | 104,515,009 | 1,586,534 |
| 158 | 106,149,139 | 1,634,130 |
| 159 | 107,832,292 | 1,683,153 |
| 160 | 109,565,939 | 1,733,647 |
| 161 | 111,351,595 | 1,785,656 |
| 162 | 113,190,820 | 1,839,225 |
| 163 | 115,085,221 | 1,894,401 |
| 164 | 117,036,454 | 1,951,233 |
| 165 | 119,046,223 | 2,009,769 |
| 166 | 121,116,285 | 2,070,062 |
| 167 | 123,248,448 | 2,132,163 |
| 168 | 125,444,575 | 2,196,127 |
| 169 | 127,706,585 | 2,262,010 |
| 170 | 130,036,455 | 2,329,870 |
| 171 | 132,436,221 | 2,399,766 |
| 172 | 134,907,979 | 2,471,758 |
| 173 | 137,453,889 | 2,545,910 |
| 174 | 140,076,176 | 2,622,287 |
| 175 | 142,777,131 | 2,700,955 |
| 176 | 145,559,114 | 2,781,983 |
| 177 | 148,424,556 | 2,865,442 |
| 178 | 151,375,961 | 2,951,405 |
| 179 | 154,415,908 | 3,039,947 |
| 180 | 157,547,053 | 3,131,145 |
| 181 | 160,772,132 | 3,225,079 |
| 182 | 164,093,963 | 3,321,831 |
| 183 | 167,515,448 | 3,421,485 |
| 184 | 171,039,577 | 3,524,129 |
| 185 | 174,669,429 | 3,629,852 |
| 186 | 178,408,176 | 3,738,747 |
| 187 | 182,259,085 | 3,850,909 |
| 188 | 186,225,521 | 3,966,436 |
| 189 | 190,310,950 | 4,085,429 |
| 190 | 194,518,941 | 4,207,991 |
| 191 | 198,853,171 | 4,334,230 |
| 192 | 203,317,427 | 4,464,256 |
| 193 | 207,915,610 | 4,598,183 |
| 194 | 212,651,738 | 4,736,128 |
| 195 | 217,529,949 | 4,878,211 |
| 196 | 222,554,506 | 5,024,557 |
| 197 | 227,729,799 | 5,175,293 |
| 198 | 233,060,350 | 5,330,551 |
| 199 | 238,550,817 | 5,490,467 |
| 200 | 244,206,000 | 5,655,183 |

Observation: the file contains a small arithmetic quirk at levels 61→62 (both deltas equal 158,500) which reproduces exactly what is committed upstream.

---

## GAP 2 — Expansion node layouts (cumulative counts)

Source: `src/features/game/expansion/lib/expansionNodes.ts` → `TOTAL_EXPANSION_NODES` (starts line 58).
GitHub: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/expansion/lib/expansionNodes.ts

The structure is `TOTAL_EXPANSION_NODES[island][expansionNumber]`. Values are CUMULATIVE: the total number of each node present on the island when the player has unlocked expansion `N`. The `Nodes` interface (lines 8–20) lists the 12 node keys — all tables below use that exact order.

### Spring Island (`spring`)

Source lines 355–594.

| Exp | Crop Plot | Tree | Stone | Iron | Gold | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil Reserve | Lava Pit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 31 | 9 | 7 | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 0 | 0 |
| 5 | 33 | 11 | 9 | 5 | 3 | 0 | 0 | 3 | 0 | 0 | 0 | 0 |
| 6 | 33 | 12 | 10 | 5 | 3 | 0 | 0 | 4 | 1 | 1 | 0 | 0 |
| 7 | 35 | 13 | 11 | 5 | 3 | 1 | 0 | 4 | 1 | 1 | 0 | 0 |
| 8 | 37 | 13 | 12 | 6 | 4 | 1 | 0 | 5 | 1 | 1 | 0 | 0 |
| 9 | 37 | 14 | 12 | 6 | 4 | 1 | 1 | 6 | 1 | 1 | 0 | 0 |
| 10 | 37 | 14 | 12 | 7 | 5 | 1 | 1 | 7 | 2 | 2 | 0 | 0 |
| 11 | 39 | 15 | 13 | 7 | 5 | 1 | 1 | 8 | 2 | 2 | 0 | 0 |
| 12 | 41 | 15 | 13 | 7 | 5 | 1 | 1 | 8 | 2 | 2 | 0 | 0 |
| 13 | 41 | 16 | 14 | 8 | 5 | 1 | 2 | 9 | 2 | 2 | 0 | 0 |
| 14 | 43 | 16 | 14 | 8 | 5 | 1 | 2 | 10 | 2 | 2 | 0 | 0 |
| 15 | 44 | 17 | 15 | 9 | 5 | 2 | 2 | 11 | 2 | 2 | 0 | 0 |
| 16 | 45 | 18 | 15 | 9 | 6 | 2 | 2 | 11 | 3 | 3 | 0 | 0 |
| 17 | 46 | 18 | 16 | 10 | 6 | 2 | 2 | 12 | 3 | 3 | 0 | 0 |
| 18 | 46 | 18 | 16 | 10 | 6 | 2 | 3 | 12 | 3 | 3 | 0 | 0 |
| 19 | 48 | 18 | 16 | 10 | 6 | 3 | 3 | 12 | 3 | 3 | 0 | 0 |
| 20 | 50 | 18 | 16 | 10 | 6 | 3 | 4 | 12 | 3 | 3 | 0 | 0 |

Spring Island range in source: expansions 4–20 (not 5–20). Expansion 4 is the first Spring entry; expansions 1–3 are still Basic Island and live in `TOTAL_EXPANSION_NODES.basic`.

### Desert Island (`desert`)

Source lines 596–906.

| Exp | Crop Plot | Tree | Stone | Iron | Gold | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil Reserve | Lava Pit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 4 | 45 | 18 | 15 | 9 | 6 | 2 | 2 | 11 | 3 | 3 | 0 | 0 |
| 5 | 46 | 18 | 16 | 10 | 6 | 2 | 2 | 11 | 3 | 3 | 1 | 0 |
| 6 | 46 | 18 | 16 | 10 | 6 | 2 | 3 | 12 | 3 | 3 | 1 | 0 |
| 7 | 48 | 18 | 16 | 10 | 6 | 3 | 3 | 12 | 3 | 3 | 1 | 0 |
| 8 | 50 | 18 | 16 | 10 | 6 | 3 | 4 | 12 | 3 | 3 | 1 | 0 |
| 9 | 50 | 19 | 17 | 10 | 6 | 3 | 4 | 12 | 3 | 3 | 1 | 0 |
| 10 | 51 | 19 | 17 | 11 | 6 | 3 | 4 | 12 | 3 | 3 | 1 | 0 |
| 11 | 52 | 19 | 17 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 12 | 54 | 19 | 17 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 13 | 54 | 20 | 17 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 14 | 55 | 20 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 1 | 0 |
| 15 | 56 | 20 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 16 | 57 | 21 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 17 | 59 | 21 | 18 | 11 | 6 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 18 | 60 | 21 | 18 | 11 | 7 | 3 | 4 | 13 | 3 | 3 | 2 | 0 |
| 19 | 61 | 21 | 18 | 11 | 7 | 3 | 4 | 14 | 3 | 3 | 2 | 0 |
| 20 | 61 | 22 | 19 | 11 | 7 | 3 | 4 | 14 | 3 | 3 | 3 | 0 |
| 21 | 62 | 22 | 19 | 12 | 7 | 3 | 5 | 14 | 3 | 3 | 3 | 0 |
| 22 | 62 | 23 | 19 | 12 | 7 | 3 | 5 | 15 | 3 | 3 | 3 | 0 |
| 23 | 63 | 23 | 19 | 12 | 7 | 4 | 5 | 15 | 3 | 3 | 3 | 0 |
| 24 | 64 | 23 | 19 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |
| 25 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |

Desert Island range in source: expansions 4–25. (The inline comment at line 597 says "Spring island level 16" — it refers to the in-game NPC level cap at which Desert unlocks, not the expansion index.)

### Volcano Island (`volcano`)

Source lines 907–1272.

| Exp | Crop Plot | Tree | Stone | Iron | Gold | Crimstone | Sunstone | Fruit Patch | Flower Bed | Beehive | Oil Reserve | Lava Pit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 5 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |
| 6 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 0 |
| 7 | 65 | 23 | 20 | 12 | 7 | 4 | 6 | 15 | 3 | 3 | 3 | 1 |
| 8 | 65 | 23 | 20 | 12 | 7 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 9 | 65 | 23 | 20 | 12 | 7 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 10 | 65 | 23 | 20 | 12 | 8 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 11 | 65 | 23 | 20 | 12 | 8 | 4 | 7 | 15 | 3 | 3 | 3 | 1 |
| 12 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 1 |
| 13 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 1 |
| 14 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 1 |
| 15 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 3 | 2 |
| 16 | 65 | 23 | 20 | 12 | 8 | 4 | 8 | 15 | 3 | 3 | 4 | 2 |
| 17 | 65 | 23 | 20 | 12 | 8 | 4 | 9 | 15 | 3 | 3 | 4 | 2 |
| 18 | 65 | 23 | 20 | 12 | 8 | 4 | 9 | 15 | 3 | 3 | 4 | 2 |
| 19 | 65 | 23 | 20 | 12 | 8 | 4 | 10 | 15 | 3 | 3 | 4 | 2 |
| 20 | 65 | 23 | 20 | 12 | 8 | 4 | 10 | 15 | 3 | 3 | 4 | 2 |
| 21 | 65 | 23 | 20 | 12 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 2 |
| 22 | 65 | 23 | 20 | 12 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 2 |
| 23 | 65 | 23 | 20 | 13 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 2 |
| 24 | 65 | 23 | 20 | 13 | 8 | 4 | 11 | 15 | 3 | 3 | 4 | 3 |
| 25 | 65 | 23 | 20 | 13 | 8 | 5 | 11 | 15 | 3 | 3 | 4 | 3 |
| 26 | 65 | 23 | 20 | 13 | 8 | 5 | 11 | 15 | 3 | 3 | 4 | 3 |
| 27 | 65 | 23 | 20 | 13 | 8 | 5 | 11 | 15 | 3 | 3 | 4 | 3 |
| 28 | 65 | 23 | 20 | 13 | 8 | 5 | 12 | 15 | 3 | 3 | 4 | 3 |
| 29 | 65 | 23 | 20 | 13 | 8 | 5 | 12 | 15 | 3 | 3 | 4 | 3 |
| 30 | 65 | 23 | 20 | 13 | 8 | 5 | 13 | 15 | 3 | 3 | 4 | 3 |

Volcano Island range in source: expansions 5–30.

---

## GAP 3 — Delivery NPCs

Note: there is no `src/features/game/types/deliveries.ts` in the repo. The canonical delivery NPC type/lookup tables live in:

- `src/features/island/delivery/lib/delivery.ts` — NPC name tiers, coin/ticket classification, unlock levels, delivery messages.
- `src/features/game/events/landExpansion/deliver.ts` — `TICKET_REWARDS` table and `QUEST_NPC_NAMES` list, which drive ticket yields.

GitHub:
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/island/delivery/lib/delivery.ts
- https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/deliver.ts

### NPC tier buckets (from `delivery.ts`)

`delivery.ts` groups NPCs into three reward families:

- **Coin NPCs** — `CoinNPCName` union (line 44) and `COIN_NPC_NAMES` array (line 55): pay coins. Also earn "bonus delivery tickets" via `getCoinDeliveryTickets(coins)` (lines 86–91): >0–999 coins → 1 ticket, 1000–4999 → 2 tickets, ≥5000 → 3 tickets.
- **Goblin (FLOWER) NPCs** — `GoblinNPCName` union (line 36) and `GOBLIN_NPC_NAMES` array (line 69): pay in SFL/FLOWER. Gated behind `GOBLINS_REQUIRING_REPUTATION` check in `deliver.ts` line 344.
- **Ticket NPCs** — `TicketNPCName` union (line 23) / `QuestNPCName` union in `deliver.ts` line 168: pay in seasonal tickets per `TICKET_REWARDS` (deliver.ts lines 39–51).

### NPC unlock levels (`NPC_DELIVERY_LEVELS`, delivery.ts lines 276–306)

| NPC | Category | Unlock Bumpkin Level |
|---|---|---|
| betty | Coin | 1 |
| blacksmith | Coin | 1 |
| peggy | Coin | 3 |
| corale | Coin | 7 |
| tango | Coin | 13 |
| old salty | Coin | 15 |
| victoria | Coin | 30 |
| grimbly | Goblin (FLOWER) | 10 |
| grimtooth | Goblin (FLOWER) | 12 |
| grubnuk | Goblin (FLOWER) | 16 |
| gambit | Goblin (FLOWER) | 25 |
| gordo | Goblin (FLOWER) | 30 |
| guria | Goblin (FLOWER) | 40 |
| pumpkin' pete | Ticket | 5 |
| bert | Ticket | 8 |
| finley | Ticket | 12 |
| raven | Ticket | 14 |
| miranda | Ticket | 15 |
| finn | Ticket | 16 |
| pharaoh | Ticket | 17 |
| cornwell | Ticket | 18 |
| timmy | Ticket | 20 |
| tywin | Ticket | 22 |
| jester | Ticket | 26 |

Mapping to the task's "basic / rare / advanced" buckets: Sunflower Land classifies NPCs by reward currency rather than basic/rare/advanced. The closest equivalent from the source is:

- "Basic" ≈ coin NPCs (betty, blacksmith, peggy, corale, tango, old salty, victoria).
- "Rare" ≈ ticket NPCs (pumpkin' pete, bert, finley, raven, miranda, finn, pharaoh, cornwell, timmy, tywin, jester).
- "Advanced" ≈ goblin/FLOWER NPCs (grimbly, grimtooth, grubnuk, gambit, gordo, guria).

### Ticket reward per delivery (`TICKET_REWARDS`, deliver.ts lines 39–51)

| NPC | Base tickets per delivery |
|---|---|
| pumpkin' pete | 1 |
| bert | 2 |
| miranda | 2 |
| finley | 2 |
| raven | 3 |
| finn | 3 |
| timmy | 4 |
| cornwell | 4 |
| jester | 4 |
| tywin | 5 |
| pharaoh | 5 |

Ticket modifiers applied in `generateDeliveryTickets` (deliver.ts lines 55–110):

- `+2` tickets if the player has VIP access.
- `+1` ticket for each chapter-boost item that is equipped or built (driven by `CHAPTER_TICKET_BOOST_ITEMS` in `completeNPCChore.ts`).
- `x2` final amount if the active calendar event is `doubleDelivery` and the NPC bonus hasn't been claimed today.

### XP / friendship

- Each completed delivery grants 3 friendship points to the NPC — `DELIVERY_FRIENDSHIP_POINTS = 3` (deliver.ts line 194).
- Delivery XP is not a separate constant — XP comes from the order's `reward.coins` converted via standard `generateRewards` flow server-side; the client file only exposes the coin / ticket numbers shown above.

### Delivery pool contents

Order contents (`Order.items`) are generated on the backend — see the comment on line 210 of `deliver.ts`: "Orders are generated on backend - use this just to show the next readyAt." The client only enforces:

- For coin NPCs: any deliverable crop/fruit/fish/cooked-good can appear; the client uses `getOrderSellPrice` (deliver.ts line 227+) to compute payout.
- For ticket NPCs: ticket yield is fixed per `TICKET_REWARDS`, regardless of items.
- For goblin NPCs: rewards are FLOWER/SFL — pool composition lives in the backend, not in this repo.

Consequently, the exact per-NPC item request pools cannot be enumerated from this file — they are randomized by the backend each slot.

### Delivery slot count (deliver.ts lines 125–166)

| Basic Land count | Delivery slots | Quest slots |
|---|---|---|
| < 5 | 3 | 1 |
| 5–7 | 4 | 2 |
| 8–11 | 5 | 3 |
| 12–13 | 6 | 4 |
| ≥ 14 | 6 | 5 |

---

## GAP 4 — Chore Board chore pool

Source: `src/features/game/types/choreBoard.ts`.
GitHub: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/choreBoard.ts

Key structural facts from this file:

- `NPC_CHORES` (line 24) is a flat `Record<string, ChoreTask>` — a single global pool of ~801 named chore templates (count obtained by grep against the file). Each entry defines only `requirement` and a `progress(game)` function; rewards are NOT attached to the template.
- `ChoreName = keyof typeof NPC_CHORES` (line 3270).
- `ChoreDetails` (line 3272) is `{ name: ChoreName; reward: { items: Partial<Record<InventoryItemName, number>>; coins?: number } }`. The actual reward is attached per-rotation by the backend, not statically encoded per NPC.
- `NpcChore = ChoreDetails & { initialProgress; startedAt; completedAt? }` (line 3277).
- `ChoreBoard = { chores: Partial<Record<NPCName, NpcChore>> }` (line 3283) — one active chore per NPC at a time, rotated from the global pool.

### Per-NPC rotation unlock levels (`NPC_CHORE_UNLOCKS`, choreBoard.ts lines 3299–3329)

All NPCs default to 0; explicit overrides:

| NPC | Chore board unlock level |
|---|---|
| pumpkin' pete | 1 |
| betty | 1 |
| blacksmith | 1 |
| peggy | 3 |
| corale | 7 |
| tango | 13 |
| old salty | 15 |
| victoria | 30 |
| grimbly | 10 |
| grimtooth | 10 |
| gambit | 10 |
| jester | 10 |
| pharaoh | 10 |
| timmy | 10 |
| tywin | 10 |
| cornwell | 10 |
| finn | 10 |
| finley | 10 |
| miranda | 10 |
| raven | 10 |
| grubnuk | 10 |
| bert | 10 |

### Chore template categories (distribution of the 801 named entries)

Counts are grouped by the first keyword of the chore name (exact grep of `NPC_CHORES`):

| Verb | # of chore templates |
|---|---|
| Cook | 239 |
| Harvest | 186 |
| Grow (flowers) | 61 |
| Prepare (juices) | 58 |
| Eat | 44 |
| Pick (fruit) | 43 |
| Craft | 37 |
| Mine | 34 |
| Collect | 31 |
| Drink | 21 |
| Fish | 15 |
| Chop | 15 |
| Dig | 8 |
| Spend | 6 |
| Drill | 3 |
| Total named templates | 801 |

Example entries (exact names from the file):

- Harvest: "Harvest Sunflowers 150 times" … "Harvest Sunflowers 350 times" (5 tiers); "Harvest Potatoes 100/125/130/150/175/200/225/250 times" (8 tiers); "Harvest Carrots 50/60/75/100/120/125/130/150/170/175/200 times" (11 tiers); similar multi-tier series for Rhubarbs, Pumpkin, Zucchini, Yam, Cabbage, Beetroot, Corn, Wheat, Kale, Barley, Pepper, Radish, Broccoli, Cauliflower, Soybeans, Olives, Artichoke, Turnip, Onion(s), Parsnips, Eggplant, Rice.
- Cook: "Cook 5 Fermented Fish", "Cook Bumpkin ganoush" series, "Cook Caprese Salad", "Cook Blue Cheese", "Cook Goblin Brunch", "Cook Spaghetti al Aglio", "Cook Sushi Roll", "Cook Pizza Margherita", "Cook Reindeer Carrot", "Cook Mashed Potatoes", "Cook Boiled Eggs", "Cook Cauliflower Burger", "Cook Honey Cheddar", "Cook Rice Bun", "Cook Fried Calamari", "Cook Bumpkin Salad", "Cook Bumpkin Roast", "Cook Steamed Red …", etc.
- Prepare (juices/smoothies): "Prepare Power Smoothie 10/12/15/20/25/30/35/45/50/60 times"; "Prepare Slow Juice 5/6/7/10/12/15 times"; "Prepare Banana Blast", "Prepare Apple …", "Prepare Purple …", "Prepare Sour …", "Prepare Carrot …", "Prepare Grape …".
- Eat: "Eat 3/5/7/10/15 Boiled Eggs", "Eat 10/15 Reindeer Carrot", "Eat 20/35/40/50/60/65 Anchovies", "Eat 10/20/25/30/50/75 Tunas", "Eat 15/30/45 Red Snappers", "Eat 5 Cauliflower Burgers / Club Sandwiches / Pancakes", "Eat 20/25/30 Chowder", "Eat 5–20 Orange Cake", "Eat 10–30 Mashed Potatoes", "Eat 20/30 Pumpkin Soup", "Eat 5 Bumpkin Salad".
- Drink: "Drink 10/15/25/35/40/45/50/55 Orange Juice"; "Drink 10/15 Apple Juice"; "Drink 15 Purple Smoothies"; "Drink 5 Power Smoothies"; "Drink 15 Sour Shakes"; "Drink 15 Banana Blast"; "Drink 5 Grape Juice"; "Drink 15 Carrot Juice".
- Pick (fruit): series for Oranges, Apples, Bananas, Grapes, Lemons, Blueberries, Tomatoes, plus minor entries.
- Grow (flowers): multi-tier counts for Red/Blue/Purple/Yellow Balloon, Purple Daffodil, Purple/Blue Cosmos, Yellow/Blue Clover, White Pansy, etc.
- Mine / Chop / Fish / Dig / Drill / Craft / Spend / Collect: smaller pools (3–37 templates each) covering resource gathering, crafting axes/pickaxes, drilling oil, spending coins, and collecting eggs/honey.

### Reward category

The `ChoreDetails.reward` shape (`{ items: Partial<Record<InventoryItemName, number>>, coins?: number }`) is the ONLY schema for chore rewards in this file. There is no static "rarity/tier" column inside `choreBoard.ts` — reward value is filled in per-rotation by the backend.

The related file `src/features/game/events/landExpansion/completeNPCChore.ts` does define seasonal tier boost items via `CHAPTER_TICKET_BOOST_ITEMS` (lines 39–115) which map each chapter to `{ basic, rare, epic }` wearable/collectible items — these act as a "reward category" multiplier on ticket chores rather than chore rewards themselves:

| Chapter | basic item | rare item | epic item |
|---|---|---|---|
| Solar Flare / Dawn Breaker / Witches' Eve / Catch the Kraken / Spring Blossom / Clash of Factions / Pharaoh's Treasure | Cow Scratcher | Cow Scratcher | Cow Scratcher |
| Bull Run | Cowboy Hat | Cowboy Shirt | Cowboy Trouser |
| Winds of Change | Acorn Hat | Igloo | Hammock |
| Great Bloom | Flower Mask | Love Charm Shirt | Heart Air Balloon |
| Better Together | Garbage Bin Hat | Raccoon Onesie | Recycle Shirt |
| Paw Prints | Pet Specialist Hat | Pet Specialist Pants | Pet Specialist Shirt |
| Crabs and Traps | Fish Hook Hat | Fish Hook Vest | Fish Hook Waders |

Source: https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/completeNPCChore.ts#L39-L115

---

## Summary of source files read

| File | GitHub URL | Used for |
|---|---|---|
| `src/features/game/lib/level.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/lib/level.ts | Gap 1 (LEVEL_EXPERIENCE) |
| `src/features/game/expansion/lib/expansionNodes.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/expansion/lib/expansionNodes.ts | Gap 2 (TOTAL_EXPANSION_NODES) |
| `src/features/island/delivery/lib/delivery.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/island/delivery/lib/delivery.ts | Gap 3 (NPC tiers, unlock levels) |
| `src/features/game/events/landExpansion/deliver.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/deliver.ts | Gap 3 (TICKET_REWARDS, quest NPCs, slot counts) |
| `src/features/game/types/choreBoard.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/choreBoard.ts | Gap 4 (NPC_CHORES pool, unlock levels) |
| `src/features/game/events/landExpansion/completeNPCChore.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/events/landExpansion/completeNPCChore.ts | Gap 4 (chapter reward tier mapping) |
| `src/features/game/types/chores.ts` | https://github.com/sunflower-land/sunflower-land/blob/main/src/features/game/types/chores.ts | Gap 4 (confirmed: `CHORES: Chore[] = []` — empty legacy file; the live pool is in `choreBoard.ts`) |
