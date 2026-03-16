/**
 * Founder Journey Final — Data (structural blueprint).
 * Fixed map: viewBox 1600×900, 80px safe margin. Node IDs and journey order unchanged.
 * Roads: three-layer design. Two roundabouts: Hospital (600,420) r80, Recovery (520,640) r70.
 */
(function (global) {
  "use strict";

  var VIEWBOX_W = 1600;
  var VIEWBOX_H = 900;

  // Roundabout R1: center (600,420) r80. R2: center (520,640) r70.
  // All paths use smooth curves (Q) so the network reads as one fluid road; same start/end for routing.
  var ROADS = [
    // GP / Entry district — gentle curves
    { id: "GP1", d: "M180 180 Q250 172 320 180", type: "main" },
    { id: "GP2", d: "M180 180 Q180 240 180 300", type: "main" },
    { id: "GP3", d: "M320 180 Q320 240 320 300", type: "main" },
    { id: "GP4", d: "M180 300 Q250 308 320 300", type: "main" },
    { id: "DE_NEWNHAM", d: "M180 300 Q140 300 100 300", type: "dead-end" },
    { id: "DE_HUNTINGDON", d: "M320 300 Q360 300 400 300", type: "dead-end" },
    // GP → Diagnosis — flowing arc
    { id: "L1", d: "M320 180 Q440 140 560 160", type: "main" },
    { id: "L2", d: "M560 160 Q660 178 760 200", type: "main" },
    { id: "L3", d: "M560 160 Q580 250 600 340", type: "main" },
    // Hospital roundabout R1 — smooth arcs (unchanged)
    { id: "R1", d: "M680 420 A80 80 0 0 1 600 340", type: "roundabout" },
    { id: "R1b", d: "M600 340 A80 80 0 0 1 520 420", type: "roundabout" },
    { id: "R1c", d: "M520 420 A80 80 0 0 1 600 500", type: "roundabout" },
    { id: "R1d", d: "M600 500 A80 80 0 0 1 680 420", type: "roundabout" },
    // Hospital spokes — smooth curves into/out of roundabout
    { id: "H_ADDEN", d: "M520 420 Q540 400 560 380", type: "side" },
    { id: "H_ALCOHOL", d: "M520 420 Q530 400 540 380", type: "side" },
    { id: "DE_ADDENBROOKES", d: "M560 380 Q580 370 600 360", type: "dead-end" },
    { id: "H_NORTH", d: "M680 420 Q700 400 720 380", type: "side" },
    { id: "H_CASTLE", d: "M680 420 Q700 470 720 520", type: "side" },
    { id: "H_NIGHT", d: "M600 500 Q580 510 560 520", type: "side" },
    { id: "H_LA", d: "M720 380 Q800 358 880 340", type: "side" },
    // Hospital → Recovery — flowing link
    { id: "X1", d: "M600 500 Q560 535 520 570", type: "main" },
    // Recovery roundabout R2 — smooth arcs (unchanged)
    { id: "R2", d: "M590 640 A70 70 0 0 1 520 570", type: "roundabout" },
    { id: "R2b", d: "M520 570 A70 70 0 0 1 450 640", type: "roundabout" },
    { id: "R2c", d: "M450 640 A70 70 0 0 1 520 710", type: "roundabout" },
    { id: "R2d", d: "M520 710 A70 70 0 0 1 590 640", type: "roundabout" },
    // Recovery spokes — smooth curves
    { id: "REC_PWS", d: "M450 640 Q345 632 240 620", type: "side" },
    { id: "REC_CGL", d: "M450 640 Q435 630 420 620", type: "side" },
    { id: "REC_CJ", d: "M420 620 Q380 620 340 620", type: "side" },
    { id: "REC_CRS", d: "M590 640 Q595 630 600 620", type: "side" },
    { id: "REC_HELP", d: "M600 620 Q630 620 660 620", type: "side" },
    { id: "REC_SMART", d: "M520 710 Q470 735 420 760", type: "side" },
    { id: "REC_AA", d: "M520 710 Q560 735 600 760", type: "side" },
    { id: "REC_INT", d: "M600 620 Q690 690 780 760", type: "side" },
    // Partner district — flowing
    { id: "PRT_MIND", d: "M720 380 Q860 380 1000 380", type: "main" },
    { id: "PRT_SUN", d: "M1000 380 Q1080 398 1160 420", type: "side" },
    { id: "PRT_WORK", d: "M720 520 Q860 520 1000 520", type: "main" },
    { id: "PRT_111", d: "M720 520 Q800 540 880 560", type: "side" },
    // Consequence district — gentle curves
    { id: "CON1", d: "M1000 520 Q1140 520 1280 520", type: "side" },
    { id: "CON2", d: "M1280 520 Q1280 580 1280 640", type: "side" },
    { id: "CON3", d: "M1280 520 Q1340 510 1400 500", type: "side" },
    { id: "CON4", d: "M1280 640 Q1340 630 1400 620", type: "side" }
  ];

  var BREAKS = [
    { x: 600, y: 420 },
    { x: 520, y: 640 }
  ];

  // —— Canonical nodes: blueprint coordinates. Same IDs and attributes.
  var NODES = [
    { id: "N01_GP_SUTTON", label: "GP Sutton, Ely", nodeType: "organisation", secondaryType: "GP / Primary Care", roadRole: "beside-road", x: 180, y: 180, district: "GP", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: null },
    { id: "N02_GP_COMBERTON", label: "GP Comberton & Eversden", nodeType: "organisation", secondaryType: "GP / Shared Care", roadRole: "beside-road", x: 320, y: 180, district: "GP", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: null },
    { id: "N03_GP_NEWNHAM", label: "GP Newnham, Cambridge", nodeType: "organisation", secondaryType: "GP / Primary Care", roadRole: "beside-road", x: 180, y: 300, district: "GP", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: "Registration refused; dead end" },
    { id: "N04_GP_HUNTINGDON", label: "GP Huntingdon Road, Cambridge", nodeType: "organisation", secondaryType: "GP / Primary Care", roadRole: "beside-road", x: 320, y: 300, district: "GP", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: "Shared care collapse; dead end" },
    { id: "N05_PSYMPLICITY", label: "Psymplicity Healthcare, London", nodeType: "partner", secondaryType: "ADHD assessment / medication", roadRole: "beside-road", x: 560, y: 160, district: "Diagnosis", brokenVisible: true, otosVisible: false, consequenceNode: false, interventionOpportunity: false, demoNumber: null, knownCost: 900, costNote: "Original diagnosis ~£900; review ~£600; prescriptions ~£200/month" },
    { id: "N06_CPFT_ADHD", label: "CPFT ADHD Team", nodeType: "organisation", secondaryType: "ADHD service", roadRole: "beside-road", x: 760, y: 200, district: "Diagnosis", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: "Medication review waiting list since 2019" },
    { id: "N07_CPFT_PWS", label: "CPFT Psychological Wellbeing Service", nodeType: "support", secondaryType: "therapy / wellbeing", roadRole: "beside-road", x: 240, y: 620, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: 360, costNote: "£360; paid by CPFT; likely GP referral" },
    { id: "N08_CPFT_ALCOHOL_INT", label: "CPFT Alcohol Intervention (Addenbrooke's)", nodeType: "intervention", secondaryType: "hospital alcohol support", roadRole: "on-road", x: 540, y: 380, district: "hospital", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 1, knownCost: null, costNote: null },
    { id: "N09_ADDENBROOKES", label: "Addenbrooke's A&E", nodeType: "hospital", secondaryType: "acute care", roadRole: "on-road", x: 560, y: 380, district: "hospital", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: "Event overlays: refusal, admission, ICU assault, ICU balcony fall" },
    { id: "N10_NORTHAMPTON_GENERAL", label: "Northampton General A&E", nodeType: "hospital", secondaryType: "acute care", roadRole: "on-road", x: 720, y: 380, district: "hospital", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: null },
    { id: "N11_NIGHTINGALE", label: "Nightingale Hospital", nodeType: "hospital", secondaryType: "treatment", roadRole: "on-road", x: 560, y: 520, district: "hospital", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: 22000, costNote: "£22,000; self funded" },
    { id: "N12_HELP_ME_STOP", label: "Help Me Stop DayHab", nodeType: "support", secondaryType: "dayhab programme", roadRole: "on-road", x: 660, y: 620, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: 4500, costNote: "£4,500; self funded" },
    { id: "N13_CGL_CRIMINAL_JUSTICE", label: "CGL Criminal Justice", nodeType: "support", secondaryType: "justice pathway", roadRole: "beside-road", x: 340, y: 620, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: null },
    { id: "N14_CGL", label: "CGL Drug & Alcohol Service", nodeType: "support", secondaryType: "addiction treatment", roadRole: "beside-road", x: 420, y: 620, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 2, knownCost: null, costNote: null },
    { id: "N15_CRS", label: "Cambridge Recovery Service (CRS)", nodeType: "support", secondaryType: "recovery / aftercare", roadRole: "beside-road", x: 600, y: 620, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 3, knownCost: null, costNote: null },
    { id: "N16_SMART", label: "SMART Recovery Meeting", nodeType: "support", secondaryType: "CBT-based fellowship", roadRole: "beside-road", x: 420, y: 760, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 4, knownCost: null, costNote: null },
    { id: "N17_AA", label: "AA Fellowship", nodeType: "support", secondaryType: "peer support", roadRole: "beside-road", x: 600, y: 760, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: false, demoNumber: null, knownCost: null, costNote: null },
    { id: "N18_CASTLE_CRAIG", label: "Castle Craig Dual-Diagnosis Hospital", nodeType: "hospital", secondaryType: "residential rehab", roadRole: "on-road", x: 720, y: 520, district: "hospital", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: 90000, costNote: "£90,000; CGL funded; high-cost partial-success / failure" },
    { id: "N19_INTEGRATED_THERAPIST", label: "Integrated Therapist", nodeType: "support", secondaryType: "therapy", roadRole: "beside-road", x: 780, y: 760, district: "recovery", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 5, knownCost: 360, costNote: "~£360; paid via MIND / WorkWell route" },
    { id: "N20_MIND", label: "MIND", nodeType: "partner", secondaryType: "mental health charity", roadRole: "beside-road", x: 1000, y: 380, district: "partner", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 6, knownCost: null, costNote: null },
    { id: "N21_WORKWELL", label: "WorkWell", nodeType: "partner", secondaryType: "employment / wellbeing support", roadRole: "beside-road", x: 1000, y: 520, district: "partner", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: 6, knownCost: null, costNote: null },
    { id: "N22_SUN_NETWORK", label: "Sun Network", nodeType: "strategic_partner", secondaryType: "lived experience network", roadRole: "off-road", x: 1160, y: 420, district: "partner", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: "Reports to commissioners; co-promotions; lived experience work" },
    { id: "N23_PROBATION", label: "Probation", nodeType: "consequence", secondaryType: "justice", roadRole: "off-road", x: 1280, y: 640, district: "consequence", brokenVisible: true, otosVisible: true, consequenceNode: true, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: null },
    { id: "N24_COURTS", label: "Courts", nodeType: "consequence", secondaryType: "justice", roadRole: "off-road", x: 1280, y: 520, district: "consequence", brokenVisible: true, otosVisible: false, consequenceNode: true, interventionOpportunity: false, demoNumber: null, knownCost: null, costNote: null },
    { id: "N25_POLICE_999", label: "999 – Police", nodeType: "consequence", secondaryType: "justice / crisis event", roadRole: "off-road", x: 1400, y: 500, district: "consequence", brokenVisible: true, otosVisible: true, consequenceNode: true, interventionOpportunity: true, demoNumber: null, knownCost: 250, costNote: "~£250 per event; multiple callouts" },
    { id: "N26_AMBULANCE_999", label: "999 – Ambulance", nodeType: "consequence", secondaryType: "emergency response event", roadRole: "off-road", x: 1400, y: 620, district: "consequence", brokenVisible: true, otosVisible: true, consequenceNode: true, interventionOpportunity: true, demoNumber: null, knownCost: 300, costNote: "~£300 per event; multiple callouts" },
    { id: "N27_SANCTUARY_111", label: "111 / CPFT Sanctuary", nodeType: "support", secondaryType: "crisis telephone service", roadRole: "beside-road", x: 880, y: 560, district: "partner", brokenVisible: true, otosVisible: true, consequenceNode: false, interventionOpportunity: true, demoNumber: null, knownCost: null, costNote: null },
    { id: "N28_LA_LINEA", label: "La Linea Hospital Spain", nodeType: "hospital", secondaryType: "overseas acute emergency", roadRole: "on-road", x: 880, y: 340, district: "hospital", brokenVisible: true, otosVisible: false, consequenceNode: false, interventionOpportunity: false, demoNumber: null, knownCost: null, costNote: "Must remain in map" }
  ];

  // —— Journey steps: unchanged order or nodeIds
  var JOURNEY_STEPS = [
    { id: "s1", sequence: 1, nodeId: "N05_PSYMPLICITY", title: "Private ADHD diagnosis", eventType: "normal", knownCost: 900, calloutId: "c1" },
    { id: "s2", sequence: 2, nodeId: "N09_ADDENBROOKES", title: "Suicide attempt", eventType: "normal", knownCost: null, calloutId: "c2" },
    { id: "s3", sequence: 3, nodeId: "N02_GP_COMBERTON", title: "Shared care arrangement", eventType: "normal", knownCost: null, calloutId: "c3" },
    { id: "s4", sequence: 4, nodeId: "N09_ADDENBROOKES", title: "Neighbour assault — ICU admission (assault)", eventType: "crisis", knownCost: null, calloutId: "c4" },
    { id: "s5", sequence: 5, nodeId: "N25_POLICE_999", title: "Police arrest", eventType: "normal", knownCost: null, calloutId: "c5" },
    { id: "s6", sequence: 6, nodeId: "N04_GP_HUNTINGDON", title: "Social housing move; GP change", eventType: "normal", knownCost: null, calloutId: "c6" },
    { id: "s7", sequence: 7, nodeId: "N04_GP_HUNTINGDON", title: "Shared care collapse (dead end)", eventType: "dead_end", knownCost: null, calloutId: "c6a", routeSegmentIds: ["DE_HUNTINGDON"] },
    { id: "s8", sequence: 8, nodeId: "N10_NORTHAMPTON_GENERAL", title: "Withdrawal seizures", eventType: "normal", knownCost: null, calloutId: "c7" },
    { id: "s9", sequence: 9, nodeId: "N09_ADDENBROOKES", title: "Crisis presentation — detox admission", eventType: "normal", knownCost: null, calloutId: "c8" },
    { id: "s10", sequence: 10, nodeId: "N11_NIGHTINGALE", title: "Detox programme (16 days)", eventType: "normal", knownCost: 22000, calloutId: "c9" },
    { id: "s11", sequence: 11, nodeId: "N12_HELP_ME_STOP", title: "Dayhab programme (6 weeks)", eventType: "normal", knownCost: 4500, calloutId: "c10" },
    { id: "s12", sequence: 12, nodeId: "N25_POLICE_999", title: "Drink driving arrest", eventType: "normal", knownCost: null, calloutId: "c11" },
    { id: "s13", sequence: 13, nodeId: "N24_COURTS", title: "Court appearance", eventType: "normal", knownCost: null, calloutId: "c12" },
    { id: "s14", sequence: 14, nodeId: "N23_PROBATION", title: "Community service; probation", eventType: "normal", knownCost: null, calloutId: "c13" },
    { id: "s15", sequence: 15, nodeId: "N14_CGL", title: "CGL engagement (1)", eventType: "normal", knownCost: null, calloutId: "c14" },
    { id: "s16", sequence: 16, nodeId: "N18_CASTLE_CRAIG", title: "Residential rehab (Castle Craig)", eventType: "normal", knownCost: 90000, calloutId: "c15" },
    { id: "s17", sequence: 17, nodeId: "N07_CPFT_PWS", title: "Psychological wellbeing (6 weeks)", eventType: "normal", knownCost: 360, calloutId: "c16" },
    { id: "s18", sequence: 18, nodeId: "N04_GP_HUNTINGDON", title: "Counselling skills L1/L2", eventType: "normal", knownCost: null, calloutId: "c17" },
    { id: "s19", sequence: 19, nodeId: "N07_CPFT_PWS", title: "Recovery advocacy; AA / peer support", eventType: "recovery", knownCost: null, calloutId: "c18" },
    { id: "s20", sequence: 20, nodeId: "N07_CPFT_PWS", title: "Relapse experiment (9 months)", eventType: "normal", knownCost: null, calloutId: "c19" },
    { id: "s21", sequence: 21, nodeId: "N09_ADDENBROOKES", title: "ICU admission — balcony fall", eventType: "crisis", knownCost: null, calloutId: "c20" },
    { id: "s22", sequence: 22, nodeId: "N09_ADDENBROOKES", title: "A&E detox — successful discharge", eventType: "normal", knownCost: null, calloutId: "c21" },
    { id: "s23", sequence: 23, nodeId: "N07_CPFT_PWS", title: "Alcohol use returns", eventType: "normal", knownCost: null, calloutId: "c22" },
    { id: "s24", sequence: 24, nodeId: "N04_GP_HUNTINGDON", title: "Family intervention", eventType: "normal", knownCost: null, calloutId: "c23" },
    { id: "s25", sequence: 25, nodeId: "N05_PSYMPLICITY", title: "ADHD psychiatric review", eventType: "normal", knownCost: 600, calloutId: "c24" },
    { id: "s26", sequence: 26, nodeId: "N09_ADDENBROOKES", title: "A&E return — turned away (refusal)", eventType: "refusal", knownCost: null, calloutId: "c25" },
    { id: "s27", sequence: 27, nodeId: "N09_ADDENBROOKES", title: "Addenbrooke's refusal (dead end)", eventType: "dead_end", knownCost: null, calloutId: "c25a", routeSegmentIds: ["DE_ADDENBROOKES"] },
    { id: "s28", sequence: 28, nodeId: "N09_ADDENBROOKES", title: "Addenbrooke's — detox confirmation", eventType: "normal", knownCost: null, calloutId: "c26" },
    { id: "s29", sequence: 29, nodeId: "N14_CGL", title: "CGL re-engagement (2)", eventType: "handoff", knownCost: null, calloutId: "c27" },
    { id: "s30", sequence: 30, nodeId: "N05_PSYMPLICITY", title: "Medication decision; Elvanse titration", eventType: "normal", knownCost: 400, calloutId: "c28" },
    { id: "s31", sequence: 31, nodeId: "N15_CRS", title: "Referral onward CGL → CRS", eventType: "handoff", knownCost: null, calloutId: "c29" },
    { id: "s32", sequence: 32, nodeId: "N07_CPFT_PWS", title: "Hub wellbeing services", eventType: "normal", knownCost: null, calloutId: "c30" },
    { id: "s33", sequence: 33, nodeId: "N03_GP_NEWNHAM", title: "Shared care refused; registration refused (dead end)", eventType: "dead_end", knownCost: null, calloutId: "c31", routeSegmentIds: ["DE_NEWNHAM"] },
    { id: "s34", sequence: 34, nodeId: "N06_CPFT_ADHD", title: "ADHD team contact", eventType: "normal", knownCost: null, calloutId: "c32" },
    { id: "s35", sequence: 35, nodeId: "N04_GP_HUNTINGDON", title: "Records retrieval", eventType: "normal", knownCost: null, calloutId: "c33" },
    { id: "s36", sequence: 36, nodeId: "N21_WORKWELL", title: "GP → WorkWell + MIND handoff", eventType: "handoff", knownCost: null, calloutId: "c34" },
    { id: "s37", sequence: 37, nodeId: "N20_MIND", title: "Research follow-up", eventType: "normal", knownCost: null, calloutId: "c35" },
    { id: "s38", sequence: 38, nodeId: "N19_INTEGRATED_THERAPIST", title: "Therapy period (6 weeks)", eventType: "recovery", knownCost: null, calloutId: "c36" }
  ];

  var CALLOUTS = {};
  JOURNEY_STEPS.forEach(function (step) {
    if (step.calloutId) CALLOUTS[step.calloutId] = { title: step.title, subtitle: "", note: "", cost: step.knownCost };
  });
  function getNodeLabel(nodeId) {
    var n = NODES.filter(function (o) { return o.id === nodeId; })[0];
    return n ? n.label : nodeId;
  }
  CALLOUTS.c2 = { title: "Suicide attempt", subtitle: "Ambulance → Addenbrooke's A&E", note: "Attendance only (not detox/stay)", cost: null };
  CALLOUTS.c4 = { title: "Neighbour assault", subtitle: "Addenbrooke's ICU admission (assault)", note: "Crisis event", cost: null };
  CALLOUTS.c9 = { title: "Detox programme", subtitle: "Nightingale Hospital (16 days)", note: "Private", cost: 22000 };
  CALLOUTS.c10 = { title: "Dayhab programme", subtitle: "Help Me Stop (6 weeks)", note: "Private", cost: 4500 };
  CALLOUTS.c15 = { title: "Residential rehab", subtitle: "Castle Craig (dual diagnosis)", note: "CGL funded; ADHD meds removed on entry", cost: 90000 };
  CALLOUTS.c20 = { title: "ICU admission — balcony fall", subtitle: "Addenbrooke's A&E", note: "Crisis event", cost: null };
  CALLOUTS.c24 = { title: "ADHD psychiatric review", subtitle: "Psymplicity", note: "+ £200/month ongoing", cost: 600 };
  CALLOUTS.c34 = { title: "GP → WorkWell + MIND handoff", subtitle: "Signposting; therapy arranged", note: "SMS 'message waiting'", cost: null };
  CALLOUTS.c35 = { title: "Research follow-up", subtitle: "Research team contacts", note: "Not care continuity; silence periods remain", cost: null };
  CALLOUTS.c36 = { title: "Therapy period", subtitle: "Integrated Therapist (6 weeks)", note: "Continuity discussed", cost: null };
  CALLOUTS.c6a = { title: "Dead end: shared care collapse", subtitle: "GP Huntingdon Road", note: "Path reverses back to network", cost: null };
  CALLOUTS.c25a = { title: "Dead end: turned away", subtitle: "Addenbrooke's A&E refusal", note: "Path reverses; later admitted", cost: null };
  CALLOUTS.c31 = { title: "Dead end: registration refused", subtitle: "GP Newnham", note: "Path reverses back to network", cost: null };

  var EVENT_MARKERS = [
    { id: "ev1", type: "crisis", nodeId: "N09_ADDENBROOKES", label: "ICU admission (assault)", stepSequence: 4, x: 560, y: 380 },
    { id: "ev2", type: "crisis", nodeId: "N09_ADDENBROOKES", label: "ICU admission (balcony fall)", stepSequence: 21, x: 560, y: 380 }
  ];

  var COSTS = [
    { stepSequence: 1, label: "Psymplicity diagnosis", amount: 900 },
    { stepSequence: 10, label: "Nightingale", amount: 22000 },
    { stepSequence: 11, label: "Help Me Stop DayHab", amount: 4500 },
    { stepSequence: 16, label: "Castle Craig", amount: 90000 },
    { stepSequence: 17, label: "CPFT PWS", amount: 360 },
    { stepSequence: 25, label: "Psymplicity review", amount: 600 },
    { stepSequence: 30, label: "Medication", amount: 400 }
  ];

  // Continuity path (gold neural network) — connects key nodes in new coordinates
  var CONTINUITY_PATH = { d: "M560 160 L600 340 L520 420 L560 380 L680 420 L720 380 L1000 380 L1160 420 L1000 520 L720 520 L600 620 L520 710 L450 640 L240 620 L420 620 L600 620 L780 760 L320 180 L320 300 L560 160" };

  var CONSEQUENCE_NODE_IDS = ["N23_PROBATION", "N24_COURTS", "N25_POLICE_999", "N26_AMBULANCE_999"];

  var MINI_ROUTES = [
    { id: "demo1", demoNumber: 1, title: "Hospital bedside referral", description: "CPFT Alcohol Intervention (Addenbrooke's). Mobile/tablet. Continuity thread from crisis moment.", nodeId: "N08_CPFT_ALCOHOL_INT", path: "M520 420 L540 380 L560 380", device: "mobile", isQbTest: false },
    { id: "demo2", demoNumber: 2, title: "CGL intake / addiction handoff", description: "CGL Drug & Alcohol. Desktop. Parallel needs visible; not siloed.", nodeId: "N14_CGL", path: "M450 640 L420 620 L520 710 L420 760", device: "desktop", isQbTest: false },
    { id: "demo3", demoNumber: 3, title: "CRS aftercare monitoring", description: "Cambridge Recovery Service. Desktop. Drift signals and continuity thread remain active.", nodeId: "N15_CRS", path: "M590 640 L600 620", device: "desktop", isQbTest: false },
    { id: "demo4", demoNumber: 4, title: "SMART / recovery support", description: "SMART Recovery. Desktop/tablet. Continuity visible beyond formal treatment.", nodeId: "N16_SMART", path: "M450 640 L520 710 L420 760", device: "tablet", isQbTest: false },
    { id: "demo5", demoNumber: 5, title: "Integrated therapist route", description: "Therapy handoff and continuity visibility; not in isolation.", nodeId: "N19_INTEGRATED_THERAPIST", path: "M600 620 L780 760", device: "desktop", isQbTest: false },
    { id: "demo6", demoNumber: 6, title: "MIND / WorkWell / GP signposting", description: "Partner referral; GP handoff. Blind signposting becomes visible continuity.", nodeId: "N20_MIND", path: "M720 380 L1000 380 L1000 520 L320 300", device: "desktop", isQbTest: false },
    { id: "qb-throughput", demoNumber: null, title: "Earlier ADHD assessment (QbTest throughput)", description: "Faster assessment throughput and shared information; part of ideal pathway. Not OTOS diagnosing.", nodeId: "N06_CPFT_ADHD", path: "M760 200 L560 160 L320 180", device: "desktop", isQbTest: true }
  ];

  var STATES = [
    { id: 1, label: "State 1: System map", phaseLabel: "System map" },
    { id: 2, label: "State 2: Founder journey", phaseLabel: "Journey" },
    { id: 3, label: "State 3: OTOS continuity", phaseLabel: "With continuity" },
    { id: 4, label: "State 4: Intervention routes", phaseLabel: "Intervention demos" }
  ];

  var R1_LOOP_PATH = "M680 420 A80 80 0 0 1 600 340 A80 80 0 0 1 520 420 A80 80 0 0 1 600 500 A80 80 0 0 1 680 420";
  var R2_LOOP_PATH = "M590 640 A70 70 0 0 1 520 570 A70 70 0 0 1 450 640 A70 70 0 0 1 520 710 A70 70 0 0 1 590 640";

  global.FounderJourneyFinalData = {
    VIEWBOX_W: VIEWBOX_W,
    VIEWBOX_H: VIEWBOX_H,
    ROADS: ROADS,
    R1_LOOP_PATH: R1_LOOP_PATH,
    R2_LOOP_PATH: R2_LOOP_PATH,
    BREAKS: BREAKS,
    NODES: NODES,
    JOURNEY_STEPS: JOURNEY_STEPS,
    CALLOUTS: CALLOUTS,
    EVENT_MARKERS: EVENT_MARKERS,
    COSTS: COSTS,
    CONTINUITY_PATH: CONTINUITY_PATH,
    CONSEQUENCE_NODE_IDS: CONSEQUENCE_NODE_IDS,
    MINI_ROUTES: MINI_ROUTES,
    STATES: STATES
  };
})(typeof window !== "undefined" ? window : this);
