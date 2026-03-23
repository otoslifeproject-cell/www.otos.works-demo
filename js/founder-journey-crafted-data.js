// 100-event structured data — Dean Butler founder journey
// Self-medicating is NOT an event. It is a persistent layer.
// selfMed.status per event: 'active' | 'resumes' | 'escalates' | 'stops'

const JOURNEY_PHASES = [

  // ============================================
  // PHASE 1 — THE INVISIBLE LINE
  // Self-medicating = medicine. Functional. Hidden.
  // ============================================
  {
    phase: 1,
    label: "The Invisible Line",
    colour: "#F59E0B",
    selfMed: { status: "active", label: "Self-medicating. It works. It is medicine." }
  },

  // ============================================
  // PHASE 2 — FIRST CONTACT WITH THE SYSTEM
  // Northampton period. Services see symptoms, not cause.
  // ============================================
  {
    phase: 2,
    label: "First Contact",
    colour: "#6B7280",
    selfMed: { status: "active", label: "Self-medicating continues" }
  },

  // ============================================
  // PHASE 3 — DIAGNOSIS ARRIVES. SYSTEM FAILS.
  // THE PIVOT POINT. This is where OTOS was needed.
  // ============================================
  {
    phase: 3,
    label: "Diagnosis. No Follow-Through.",
    colour: "#EF4444",
    selfMed: { status: "escalates", label: "Self-medicating becomes addiction" }
  },

  // ============================================
  // PHASE 4 — FULL CHAOS
  // The spaghetti. Every road retraced. Cost climbing.
  // ============================================
  {
    phase: 4,
    label: "Full Chaos",
    colour: "#DC2626",
    selfMed: { status: "escalates", label: "Addiction driving everything" }
  },

  // ============================================
  // PHASE 5 — FIGHTING BACK
  // Castle Craig. AA. Relapses. The system still broken.
  // ============================================
  {
    phase: 5,
    label: "Fighting Back",
    colour: "#F97316",
    selfMed: { status: "resumes", label: "Resumes after each attempt" }
  },

  // ============================================
  // PHASE 6 — BREAKTHROUGH + OTOS
  // Elvanse. Life changes. OTOS is born.
  // ============================================
  {
    phase: 6,
    label: "Breakthrough",
    colour: "#0D9488",
    selfMed: { status: "stops", label: null }
  }
];

const JOURNEY_EVENTS = [

  // ─── PHASE 1 ────────────────────────────────
  {
    id: 1,
    phase: 1,
    title: "The Invisible Line",
    description: "30 years of successfully self-medicating every day. Functional. Creative. Driven. No diagnosis. No pathway. Nobody looking.",
    location: null,
    type: "baseline",
    cost: null,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 2,
    phase: 1,
    title: "GP — Northampton",
    description: "First GP contact. Symptoms present but not connected. No ADHD screen. Treated for surface-level complaints.",
    location: "GP Surgery",
    type: "first-contact",
    cost: 250,
    selfMed: "active",
    otosWouldHave: "Flagged repeated GP contacts with no resolution. Prompted ADHD screening.",
    shake: 0
  },
  {
    id: 3,
    phase: 1,
    title: "Northampton A&E",
    description: "First A&E attendance. Alcohol-related. Treated and discharged. No onward referral. No thread.",
    location: "Northampton A&E",
    type: "crisis",
    cost: 400,
    selfMed: "active",
    otosWouldHave: "Created a continuity record. Triggered a CGL referral. Held the thread.",
    shake: 1
  },
  {
    id: 4,
    phase: 1,
    title: "Northampton A&E — again",
    description: "Second A&E visit. Same presentation. No connection made to previous visit. System starts again from zero.",
    location: "Northampton A&E",
    type: "re-entry",
    cost: 400,
    selfMed: "active",
    otosWouldHave: "Flagged as repeat presentation. Warm handover to CGL. Second visit never happens.",
    shake: 2
  },
  {
    id: 5,
    phase: 1,
    title: "Self-medicating continues",
    description: "Between services. No one watching. The system closed each door behind it.",
    location: null,
    type: "self-medication",
    cost: null,
    selfMed: "active",
    otosWouldHave: "Daily check-in signal. Someone would have noticed the pattern.",
    shake: 0
  },

  // ─── PHASE 2 ────────────────────────────────
  {
    id: 6,
    phase: 2,
    title: "Move back to UK",
    description: "Returns to UK. New geography, same broken system. Has to re-register everywhere. History lost.",
    location: "GP Surgery",
    type: "re-entry",
    cost: 150,
    selfMed: "active",
    otosWouldHave: "Continuity record travels with Dean. No starting from zero.",
    shake: 0
  },
  {
    id: 7,
    phase: 2,
    title: "GP Cambridge — first contact",
    description: "New GP. History not transferred. Presents as alcohol-dependent. ADHD not screened. Fit note issued.",
    location: "GP Surgery",
    type: "first-contact",
    cost: 250,
    selfMed: "active",
    otosWouldHave: "Existing history visible. GP sees pattern immediately.",
    shake: 0
  },
  {
    id: 8,
    phase: 2,
    title: "UK GP: 'Safe to drink'",
    description: "GP says healthy enough, gives permission to continue drinking. A catastrophic missed signal. This is documented.",
    location: "GP Surgery",
    type: "touchpoint",
    cost: 250,
    selfMed: "active",
    otosWouldHave: "OTOS flags contradiction between GP note and A&E history. Escalates.",
    shake: 1
  },
  {
    id: 9,
    phase: 2,
    title: "CPFT — first referral",
    description: "Referred to CPFT Psychological Wellbeing Service. Long wait. Seen. No ADHD screen. Discharged.",
    location: "CPFT",
    type: "referral",
    cost: 800,
    selfMed: "active",
    otosWouldHave: "ADHD flag raised. Referral pathway opened before discharge.",
    shake: 1
  },
  {
    id: 10,
    phase: 2,
    title: "CGL — first registration",
    description: "Registers with CGL. Alcohol support begins. ADHD still not on anyone's radar.",
    location: "CGL",
    type: "first-contact",
    cost: 600,
    selfMed: "active",
    otosWouldHave: "CGL and CPFT records joined. First time someone sees the whole picture.",
    shake: 0
  },
  {
    id: 11,
    phase: 2,
    title: "AA — joins",
    description: "Starts attending AA. Commits. Stays for about a year. It helps but something is still wrong. The ADHD.",
    location: "Peer Support",
    type: "touchpoint",
    cost: 200,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },

  // ─── PHASE 3 — THE PIVOT ────────────────────
  {
    id: 12,
    phase: 3,
    title: "Parents fund private psychiatric assessment",
    description: "Dean is honest with parents. They fund a Psymplicity assessment. Private. The NHS never offered this.",
    location: "GP Surgery",
    type: "touchpoint",
    cost: 900,
    selfMed: "active",
    otosWouldHave: "NHS pathway would have identified ADHD years earlier. Parents should never have needed to fund this.",
    shake: 0
  },
  {
    id: 13,
    phase: 3,
    title: "ADHD diagnosis — Psymplicity",
    description: "Privately diagnosed with ADHD. Methylphenidate prescribed. For the first time: clarity. Executive function returns.",
    location: "GP Surgery",
    type: "breakthrough",
    cost: 900,
    selfMed: "active",
    otosWouldHave: "This moment arrives 10 years earlier on an NHS pathway.",
    shake: 0
  },
  {
    id: 14,
    phase: 3,
    title: "GP refuses Shared Care Agreement",
    description: "GP won't support the shared care arrangement. Psymplicity not on Right To Choose register. Dean loses his medication.",
    location: "GP Surgery",
    type: "discharge",
    cost: 500,
    selfMed: "escalates",
    otosWouldHave: "OTOS escalates immediately. Warm handover. Medication never interrupted.",
    shake: 2
  },
  {
    id: 15,
    phase: 3,
    title: "THE PIVOT: Diagnosis + No Follow-Through",
    description: "The door opened. Then closed. ADHD diagnosed but medication gone. No NHS pathway. No thread. Self-medicating becomes full addiction from this moment.",
    location: null,
    type: "crisis",
    cost: null,
    selfMed: "escalates",
    otosWouldHave: "One check-in. One warm handover. One thread that didn't break. This is the moment OTOS was built for.",
    shake: 3,
    pivotPoint: true
  },
  {
    id: 16,
    phase: 3,
    title: "Fit note — 3 months",
    description: "GP issues 3-month fit note: depression, alcohol dependency, suicidal thoughts. The real cause — ADHD — still not addressed.",
    location: "GP Surgery",
    type: "touchpoint",
    cost: 500,
    selfMed: "escalates",
    otosWouldHave: "Fit note triggers OTOS review. ADHD medication reinstated pathway opened.",
    shake: 2
  },

  // ─── PHASE 4 — FULL CHAOS ───────────────────
  {
    id: 17,
    phase: 4,
    title: "Addenbrooke's A&E",
    description: "First Addenbrooke's attendance. Alcohol crisis. Treated and discharged. No connection to CPFT, CGL, or GP history.",
    location: "A&E",
    type: "crisis",
    cost: 800,
    selfMed: "escalates",
    otosWouldHave: "A&E sees full history. CPFT alerted. CGL keyworker notified within 4 hours.",
    shake: 3
  },
  {
    id: 18,
    phase: 4,
    title: "Addenbrooke's refuses admission",
    description: "Presents for help. Told to 'come back when in withdrawal.' Refused and sent away.",
    location: "A&E",
    type: "discharge",
    cost: 400,
    selfMed: "escalates",
    otosWouldHave: "OTOS flags refusal. System escalates. No one sent away.",
    shake: 4
  },
  {
    id: 19,
    phase: 4,
    title: "999 Ambulance — won't take me in",
    description: "111 calls 999. Ambulance attends but refuses to convey. Dean left in crisis.",
    location: "A&E",
    type: "crisis",
    cost: 600,
    selfMed: "escalates",
    otosWouldHave: "Live alert to CGL and CPFT. Warm handover arranged before ambulance arrives.",
    shake: 4
  },
  {
    id: 20,
    phase: 4,
    title: "GP Cambridge — collapse. GP refuses admission.",
    description: "Physical collapse. GP called. GP also refuses admission. Sent home.",
    location: "GP Surgery",
    type: "crisis",
    cost: 400,
    selfMed: "escalates",
    otosWouldHave: "Pattern of refusals flagged. Escalated to duty team automatically.",
    shake: 5
  },
  {
    id: 21,
    phase: 4,
    title: "CPFT Sanctuary Service — 111",
    description: "111 referral to CPFT Sanctuary. Crisis support accessed. First time mental health crisis formally recognised.",
    location: "CPFT",
    type: "referral",
    cost: 600,
    selfMed: "escalates",
    otosWouldHave: "Sanctuary visit creates OTOS touchpoint. Next steps planned before leaving.",
    shake: 3
  },
  {
    id: 22,
    phase: 4,
    title: "Meet CPFT alcohol liaison — bedside, 1st time",
    description: "First bedside contact with CPFT's on-site alcohol liaison nurse at Addenbrooke's — often after a detox trigger for someone not already known to alcohol services. She sees the full picture. The beginning of someone actually holding the thread.",
    location: "CPFT",
    type: "touchpoint",
    cost: 600,
    selfMed: "escalates",
    otosWouldHave: "Liaison nurse notes visible to CGL and GP immediately.",
    shake: 2
  },
  {
    id: 23,
    phase: 4,
    title: "Addenbrooke's Ward — Detox (1st)",
    description: "Finally admitted for detox. First inpatient detox. Alcohol cleared. But medication still not resolved. No pathway out.",
    location: "A&E",
    type: "touchpoint",
    cost: 3500,
    selfMed: "resumes",
    selfMedLabel: "Resumes after discharge",
    otosWouldHave: "Discharge plan includes medication pathway. Warm handover to Psymplicity.",
    shake: 3
  },
  {
    id: 24,
    phase: 4,
    title: "Self-medicating resumes",
    description: "Discharged. No pathway. No medication. Resumes within weeks.",
    location: null,
    type: "self-medication",
    cost: null,
    selfMed: "resumes",
    otosWouldHave: "Post-discharge check-in at 48h, 7 days, 30 days. Resumption never happens.",
    shake: 4
  },
  {
    id: 25,
    phase: 4,
    title: "Police arrest — drink driving",
    description: "Arrested for drink driving. Criminal justice system enters the picture. Still no ADHD treatment.",
    location: "Probation",
    type: "crisis",
    cost: 1200,
    selfMed: "escalates",
    otosWouldHave: "Police contact triggers OTOS alert to CGL and CPFT. Diversion pathway opened.",
    shake: 5
  },
  {
    id: 26,
    phase: 4,
    title: "Court appearance — convicted. 2-year ban.",
    description: "Convicted. 2-year driving ban. CGL Sally Criminal Justice worker assigned. System finally joins two dots.",
    location: "Probation",
    type: "crisis",
    cost: 1500,
    selfMed: "escalates",
    otosWouldHave: "Court outcome visible to all services simultaneously. No duplication.",
    shake: 5
  },
  {
    id: 27,
    phase: 4,
    title: "50 Hours Community Service",
    description: "Community service begins. System's response to addiction: punishment. ADHD still untreated.",
    location: "Probation",
    type: "touchpoint",
    cost: 800,
    selfMed: "escalates",
    otosWouldHave: "Community service touchpoints logged. Pattern visible.",
    shake: 4
  },
  {
    id: 28,
    phase: 4,
    title: "CGL — Register with Criminal Justice team",
    description: "Registers with CGL criminal justice stream. Sally becomes keyworker. First joined-up thread — but still no ADHD.",
    location: "CGL",
    type: "referral",
    cost: 600,
    selfMed: "escalates",
    otosWouldHave: "CGL sees CPFT history. ADHD medication immediately flagged as priority.",
    shake: 3
  },
  {
    id: 29,
    phase: 4,
    title: "Delirium Tremens — 2nd floor balcony jump",
    description: "Severe alcohol withdrawal. Delirium Tremens. Falls from 2nd floor balcony. Life-threatening. ICU admission.",
    location: "A&E",
    type: "crisis",
    cost: 12000,
    selfMed: "escalates",
    otosWouldHave: "Pattern of withdrawal severity visible across services. This never happens.",
    shake: 6,
    maxChaos: true
  },
  {
    id: 30,
    phase: 4,
    title: "Addenbrooke's ICU",
    description: "Intensive care unit admission. Life saved. Discharged with no pathway. No medication plan. No ADHD treatment.",
    location: "A&E",
    type: "crisis",
    cost: 15000,
    selfMed: "resumes",
    selfMedLabel: "Resumes after ICU discharge",
    otosWouldHave: "ICU discharge triggers full pathway review. This is the intervention point.",
    shake: 6
  },
  {
    id: 31,
    phase: 4,
    title: "Arrested — retaliation incident. Cautioned.",
    description: "Incident during chaos period. Arrested. Cautioned. Probation supervision intensifies.",
    location: "Probation",
    type: "crisis",
    cost: 1200,
    selfMed: "escalates",
    otosWouldHave: "Escalating criminal justice contacts trigger multi-agency review.",
    shake: 5
  },
  {
    id: 32,
    phase: 4,
    title: "Addenbrooke's A&E — refused again",
    description: "Presents again. A&E refuses. Convinces Psychological Director personally — she believes him. He knows exactly what he needs.",
    location: "A&E",
    type: "crisis",
    cost: 800,
    selfMed: "escalates",
    otosWouldHave: "Dean's history visible. No need to convince anyone. Pathway already open.",
    shake: 6
  },
  {
    id: 33,
    phase: 4,
    title: "Probation contact",
    description: "Incident during period of chaos. Probation supervision begins.",
    location: "Probation",
    type: "touchpoint",
    cost: 800,
    selfMed: "escalates",
    otosWouldHave: "Probation contact logged. CGL and CPFT alerted.",
    shake: 5
  },
  {
    id: 34,
    phase: 4,
    title: "WorkWell referral",
    description: "Referred to WorkWell employment support. Cannot engage. ADHD untreated. Crisis ongoing.",
    location: "DWP",
    type: "referral",
    cost: 400,
    selfMed: "escalates",
    otosWouldHave: "OTOS flags: employment support inappropriate while ADHD unmedicated.",
    shake: 4
  },
  {
    id: 35,
    phase: 4,
    title: "Self-medicating resumes — post probation",
    description: "System closes another door. Resumes immediately.",
    location: null,
    type: "self-medication",
    cost: null,
    selfMed: "resumes",
    otosWouldHave: "30-day post-contact monitoring. Resumption prevented.",
    shake: 5
  },

  // ─── PHASE 5 — FIGHTING BACK ────────────────
  {
    id: 36,
    phase: 5,
    title: "Nightingale Hospital — 2-week detox",
    description: "Private 2-week detox at Nightingale. Funded personally. NHS couldn't provide it in time.",
    location: "CPFT",
    type: "touchpoint",
    cost: 3000,
    selfMed: "resumes",
    selfMedLabel: "Resumes after Nightingale discharge",
    otosWouldHave: "NHS detox pathway available. No private funding needed.",
    shake: 3
  },
  {
    id: 37,
    phase: 5,
    title: "Help Me Stop — 6-week DayHab",
    description: "6-week day rehabilitation programme. Engages fully. Progress made. ADHD still the hidden driver.",
    location: "CGL",
    type: "touchpoint",
    cost: 2400,
    selfMed: "active",
    otosWouldHave: "DayHab progress visible to all services. ADHD assessment triggered.",
    shake: 2
  },
  {
    id: 38,
    phase: 5,
    title: "Relapse experiment",
    description: "11 months sober. Sets up vintage business. Medication helps. Tries controlled use. Things get slowly then quickly worse.",
    location: null,
    type: "touchpoint",
    cost: null,
    selfMed: "resumes",
    selfMedLabel: "Relapse — controlled attempt fails",
    otosWouldHave: "OTOS check-ins detect early warning signs. Intervention before full relapse.",
    shake: 3
  },
  {
    id: 39,
    phase: 5,
    title: "Experiment turns into crisis",
    description: "Paranoia. Real fear of survival. Business fails. Depression. ADHD intensifies. Addiction swoops in hard.",
    location: null,
    type: "crisis",
    cost: null,
    selfMed: "escalates",
    otosWouldHave: "Pattern detected at early warning stage. Crisis never reaches this point.",
    shake: 5
  },
  {
    id: 40,
    phase: 5,
    title: "Castle Craig — Residential Rehab",
    description: "Dean finds Castle Craig specifically — a dual-diagnosis hospital that addresses ADHD alongside addiction. Funded by CGL. Methylphenidate removed because it is a stimulant.",
    location: "CGL",
    type: "touchpoint",
    cost: 18000,
    selfMed: "stops",
    selfMedLabel: "Stops during Castle Craig",
    otosWouldHave: "Castle Craig progress visible across all services. Medication plan agreed before discharge.",
    shake: 0
  },
  {
    id: 41,
    phase: 5,
    title: "AA — regular attendance",
    description: "AA regular for about a year post-Castle Craig. Helps but doesn't feel right. ADHD still untreated. Feels stuck.",
    location: "Peer Support",
    type: "touchpoint",
    cost: 200,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 42,
    phase: 5,
    title: "AA starts to drag",
    description: "Repetition not helpful. Feels stuck, not free. It's the ADHD — now worse without self-medication. ADHD still on his mind. No money to go private. No news from NHS.",
    location: "Peer Support",
    type: "touchpoint",
    cost: null,
    selfMed: "active",
    otosWouldHave: "OTOS detects disengagement. Prompts ADHD pathway review.",
    shake: 1
  },
  {
    id: 43,
    phase: 5,
    title: "Meet SMART Recovery — Inertia",
    description: "Meets SMART Recovery groups and Inertia peer support. Finding community again.",
    location: "Peer Support",
    type: "touchpoint",
    cost: 200,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 44,
    phase: 5,
    title: "Meet KC — SUN Network",
    description: "Introduced to KC at SUN Network. First time someone in the system sees the whole person and listens.",
    location: "SUN Network",
    type: "touchpoint",
    cost: 400,
    selfMed: "active",
    otosWouldHave: "KC and CPFT joined. First multi-agency view of Dean's full history.",
    shake: 0
  },
  {
    id: 45,
    phase: 5,
    title: "Meet Andrea — Cambridge Recovery Service",
    description: "Transferred to Cambridge Recovery Service. Meets Andrea. Peer-led recovery begins.",
    location: "CRS",
    type: "referral",
    cost: 600,
    selfMed: "active",
    otosWouldHave: "CRS visible to all services. No duplicate assessments.",
    shake: 0
  },
  {
    id: 46,
    phase: 5,
    title: "Meet Franceska — RCE Hub Wellbeing",
    description: "Wellbeing course at RCE Hub. Meets Franceska. Community building begins.",
    location: "SUN Network",
    type: "touchpoint",
    cost: 300,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 47,
    phase: 5,
    title: "Jo Fenton — Therapy",
    description: "6 weeks with Jo Fenton therapist. Mostly discusses OTOS. The idea is forming.",
    location: "CPFT",
    type: "touchpoint",
    cost: 800,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 48,
    phase: 5,
    title: "Castle Craig — ADHD medication removed",
    description: "Methylphenidate removed at Castle Craig because it is a stimulant. Correct decision for rehab context. But leaves ADHD completely unmanaged on discharge.",
    location: "CGL",
    type: "crisis",
    cost: null,
    selfMed: "resumes",
    selfMedLabel: "Resumes — ADHD unmanaged",
    otosWouldHave: "Discharge plan includes Elvanse referral. ADHD never left unmanaged.",
    shake: 3
  },
  {
    id: 49,
    phase: 5,
    title: "Psymplicity agrees to Elvanse — conditions",
    description: "Psymplicity agrees to switch from methylphenidate to Elvanse — but needs medical detox confirmed and CGL registration. Two more boxes to tick.",
    location: "GP Surgery",
    type: "touchpoint",
    cost: 900,
    selfMed: "active",
    otosWouldHave: "Both conditions already confirmed in OTOS record. Prescription issued immediately.",
    shake: 1
  },
  {
    id: 50,
    phase: 5,
    title: "CGL Assessment — detox nurse appointment too far away",
    description: "CGL assessment done. But detox nurse appointment is too far in the future. Needs detox urgently. System can't move fast enough.",
    location: "CGL",
    type: "touchpoint",
    cost: 600,
    selfMed: "escalates",
    otosWouldHave: "OTOS flags urgency. Fast-track detox pathway activated.",
    shake: 3
  },
  {
    id: 51,
    phase: 5,
    title: "Annie — CGL writes letter for Psymplicity",
    description: "Annie at CGL writes the letter Dean needs for Psymplicity confirming attendance and no risk. A human fighting for Dean inside the system.",
    location: "CGL",
    type: "touchpoint",
    cost: 400,
    selfMed: "active",
    otosWouldHave: "Letter auto-generated from OTOS record. No human advocacy required.",
    shake: 1
  },
  {
    id: 52,
    phase: 5,
    title: "Rak backs Dean at CPFT",
    description: "Rak speaks with psychiatrist, backs Dean as committed to recovery, blowing zeros, attending groups.",
    location: "CPFT",
    type: "touchpoint",
    cost: 600,
    selfMed: "active",
    otosWouldHave: "Recovery evidence visible in OTOS record. No advocacy needed.",
    shake: 1
  },
  {
    id: 53,
    phase: 5,
    title: "Addenbrooke's Ward — Detox (2nd)",
    description: "Second full detox admission at Addenbrooke's. Medically supervised. This time Dean knows exactly why he's there and what comes next.",
    location: "A&E",
    type: "touchpoint",
    cost: 3500,
    selfMed: "active",
    otosWouldHave: "Detox discharge plan already confirmed with Psymplicity. Elvanse ready.",
    shake: 2
  },
  {
    id: 54,
    phase: 5,
    title: "CPFT alcohol liaison — discharge letter",
    description: "The on-site alcohol liaison nurse writes the discharge letter with the words Psymplicity need to see. She fights for Dean. Confirms detoxed. Supporting the medication pathway.",
    location: "CPFT",
    type: "touchpoint",
    cost: 600,
    selfMed: "active",
    otosWouldHave: "Discharge letter auto-populated from OTOS record. Same outcome, no battle.",
    shake: 0
  },
  {
    id: 55,
    phase: 5,
    title: "GP refuses — can't find Shared Care Agreement",
    description: "Comberton GP has to open vault of old files to find original shared care arrangement. No other GP will take Dean. Psymplicity not on Right To Choose register.",
    location: "GP Surgery",
    type: "crisis",
    cost: 500,
    selfMed: "active",
    otosWouldHave: "Shared care agreement in OTOS record. Available to any GP instantly.",
    shake: 3
  },
  {
    id: 56,
    phase: 5,
    title: "Buddhist Centre — regular attendance",
    description: "Regularly attending Buddhist centre. Spirituality. Stillness. Something the system never provided.",
    location: null,
    type: "touchpoint",
    cost: null,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 57,
    phase: 5,
    title: "Gym — regular attendance",
    description: "Regular gym. Structure. Dopamine. The body doing what the medication should be doing.",
    location: null,
    type: "touchpoint",
    cost: null,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 58,
    phase: 5,
    title: "Join NA",
    description: "Joins NA alongside AA. Building multiple recovery communities. Still without correct medication.",
    location: "Peer Support",
    type: "touchpoint",
    cost: 200,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 59,
    phase: 5,
    title: "Parents — reconnection",
    description: "Amazing reconnection with parents. Their understanding of what Dean had been saying all along lifts the world off his shoulders. Performing higher than ever. Still needs 1 tablet.",
    location: null,
    type: "touchpoint",
    cost: null,
    selfMed: "active",
    otosWouldHave: null,
    shake: 0
  },
  {
    id: 60,
    phase: 5,
    title: "Meet Paula — CPFT ADHD Team",
    description: "Finally meets Paula at the CPFT ADHD team. The right person, the right service. Years too late. But here.",
    location: "CPFT",
    type: "touchpoint",
    cost: 800,
    selfMed: "active",
    otosWouldHave: "Dean meets Paula in year 1, not year 8.",
    shake: 0
  },

  // ─── PHASE 6 — BREAKTHROUGH ─────────────────
  {
    id: 61,
    phase: 6,
    title: "Psymplicity prescribes Elvanse",
    description: "Psymplicity prescribe Elvanse. My whole life changed.",
    location: "GP Surgery",
    type: "breakthrough",
    cost: 900,
    selfMed: "stops",
    otosWouldHave: "This happens in year 1. Not after years of crisis, cost, and chaos.",
    shake: 0,
    breakthrough: true
  },
  {
    id: 62,
    phase: 6,
    title: "OTOS is born",
    description: "I am the problem. I built the solution. Dean begins building OTOS Continuity — the layer that would have held every thread.",
    location: null,
    type: "breakthrough",
    cost: null,
    selfMed: "stops",
    otosWouldHave: null,
    shake: 0,
    finale: true
  }
];

// SELF-MEDICATING PERSISTENT LAYER
// Rendered as a background pulse, NOT as discrete events
const SELF_MED_LAYER = {
  startEvent: 1,
  stopEvent: 61,
  phases: [
    { range: [1, 11],  label: "Self-medicating. It is medicine.",       colour: "#F59E0B", opacity: 0.4, pulse: 0.5 },
    { range: [12, 14], label: "Self-medicating continues",              colour: "#F97316", opacity: 0.6, pulse: 0.8 },
    { range: [15, 15], label: "Self-medicating becomes full addiction", colour: "#EF4444", opacity: 0.9, pulse: 1.5, pivotPoint: true },
    { range: [16, 35], label: "Addiction driving everything",           colour: "#DC2626", opacity: 1.0, pulse: 2.0 },
    { range: [36, 39], label: "Resumes after each attempt",             colour: "#EF4444", opacity: 0.8, pulse: 1.5 },
    { range: [40, 40], label: "Stops — Castle Craig",                   colour: "#10B981", opacity: 0.3, pulse: 0.3 },
    { range: [41, 60], label: "Active but reducing",                    colour: "#F59E0B", opacity: 0.5, pulse: 0.6 },
    { range: [61, 62], label: null,                                     colour: null,      opacity: 0,   pulse: 0   }
  ]
};

// RUNNING COST TRACKER
// Cursor: accumulate cost as journey plays
const KNOWN_TOTAL = 121500; // From the animation
const TRUE_TOTAL  = 150000; // Stated in the original doc
