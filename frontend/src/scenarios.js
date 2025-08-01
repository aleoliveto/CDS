// src/scenarios.js

export const scenariosByPhase = {
  1: {  // Pre-flight
    title: "Scenario 2 – ORY – JMK",
    text: `
You are based in ORY and departing from ORY to JMK on a Saturday and arriving into JMK at 1300Z. This is a full flight and will be busy with lots of families on holidays. The actual weather for ORY and JMK is shown below:

LFPO SA 160/25 10K SCT030 19/13 1016
LGMK SA 300/14 BKN007 2500m -RA 22/16 1009
LGMK FT 1108/1206 290/18 B008 9999 TEMPO 1111/1115 B012 3000 +RA
LGAV SA 180/18 O004 8000M -RA 19/16 1007

In the Tech LOG there are some details which advise:

MEL
22-81-03-01A FCU 1 inop
34-50-05B VOR 2 INOP
    `
  },
  2: { // Crew Briefing
    title: "OFP Details",
    text: `
OFP 2    EZY9999 / TEST    +1.00 LFPO/ORY - LGMK/JMK +2.00   OBS PROG
CALC 1109Z FOR ETD 1100Z 23NOV21

A320-CFM56-5B4/3-TI - MSN5224 - G-EZWB - PERF FACTOR +3.4

EST MAX |LFPO/ORY OUT OFF SLOT |CO RTE ORYJMK3 |ALTN |FLT NBR TEST
DOW 42300 | STD 1100Z
PYLD 20200 | .....
ZFW 62500 62500L |LGMK/JMK IN ON | CI 4
FUEL 10556 19367 | STA 1500Z | CRZ FL FL350
TOW 73056 73500 | .....
TRIP 7914 | BLK .....
LW 65142 66000 | BLK 4.00 ..... 3.05 TET | TRIP WIND T23
ULD 0 | FLT 324797
...
PREPARED BY ANTOINE FERNANDES LOPES (+44 1582 525525)
    `
  },
  // Add other phases/scenarios as needed
};
