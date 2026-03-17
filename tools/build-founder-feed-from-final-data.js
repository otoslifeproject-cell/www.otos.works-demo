/* Build founder-story feed JSON from FounderJourneyFinalData.
 * Uses JOURNEY_STEPS + NODES + CALLOUTS + COSTS to prefill the editor feed.
 */

const fs = require("fs");
const path = require("path");

// Execute data file (attaches FounderJourneyFinalData to window/global)
global.window = global;
require(path.join(__dirname, "..", "js", "founder-journey-final-data.js"));

const data = global.FounderJourneyFinalData;
if (!data) {
  throw new Error("FounderJourneyFinalData not found on global");
}

const nodesById = {};
for (const n of data.NODES) {
  nodesById[n.id] = n;
}

const costsBySeq = {};
for (const c of data.COSTS || []) {
  costsBySeq[c.stepSequence] = c.amount;
}

function defaultGlobals() {
  return {
    storyHeader: "Story",
    moneyHeader: "Money",
    phaseLabelHeader: "Phase",
    runningTotalLabel: "Running total"
  };
}

function inferPhase(sequence) {
  if (sequence <= 10) return "1";
  if (sequence <= 24) return "2";
  if (sequence <= 32) return "3";
  return "4";
}

function inferType(node, step) {
  const event = step.eventType || "";
  const label = (node && node.label) || "";
  const nodeType = (node && node.nodeType) || "";
  const district = (node && node.district) || "";
  const sec = (node && node.secondaryType) || "";
  const low = (label + " " + nodeType + " " + district + " " + sec + " " + event).toLowerCase();

  if (event === "crisis") return "crisis";
  if (event === "dead_end") return "relapse";
  if (event === "handoff") return "waiting_list_admin";
  if (event === "recovery") return "recovery";

  if (low.includes("999") && low.includes("police")) return "police";
  if (low.includes("999") && low.includes("ambulance")) return "ambulance";
  if (low.includes("a&e") || low.includes("icu")) return "a_and_e";
  if (low.includes("rehab") || low.includes("detox") || low.includes("hospital")) return "rehab_detox";
  if (low.includes("gp")) return "gp";
  if (low.includes("court") || low.includes("probation")) return "court_probation";
  if (low.includes("cgl") || low.includes("service")) return "nhs_service";
  if (low.includes("mind") || low.includes("aa") || low.includes("smart") || low.includes("fellowship")) return "charity";
  if (low.includes("psymplicity") || low.includes("private")) return "private_provider";
  if (low.includes("therap") || low.includes("coach")) return "therapy_coaching";

  if (district.toLowerCase() === "consequence") return "crisis";
  if (district.toLowerCase() === "recovery") return "recovery";

  return "other";
}

function buildItems() {
  const items = [];
  const globals = defaultGlobals();

  for (const step of data.JOURNEY_STEPS) {
    const node = nodesById[step.nodeId] || {};
    const callout = (step.calloutId && data.CALLOUTS[step.calloutId]) || {};

    const sequence = step.sequence;
    const cost =
      typeof costsBySeq[sequence] === "number"
        ? costsBySeq[sequence]
        : typeof step.knownCost === "number"
        ? step.knownCost
        : null;

    const storyOrg = node.label || step.nodeId || "";
    const storyTitle = callout.title || step.title || "";
    const storyBodyParts = [];
    if (callout.subtitle) storyBodyParts.push(callout.subtitle);
    if (callout.note) storyBodyParts.push(callout.note);
    const storyBody = storyBodyParts.join("\n\n");

    const moneyTitle = storyTitle;
    const moneyOrg = storyOrg;
    const moneyBody = storyBody;

    items.push({
      id: step.id,
      order: sequence - 1,
      drawioId: null,
      type: inferType(node, step),
      story: {
        header: globals.storyHeader,
        org: storyOrg,
        title: storyTitle,
        body: storyBody
      },
      money: {
        header: globals.moneyHeader,
        phaseLabelHeader: globals.phaseLabelHeader,
        runningTotalLabel: globals.runningTotalLabel,
        phase: inferPhase(sequence),
        title: moneyTitle,
        org: moneyOrg,
        body: moneyBody,
        cost: typeof cost === "number" ? cost : 0,
        personalCost: 0,
        nodeIndex: Object.keys(nodesById).indexOf(step.nodeId)
      },
      tags: [step.eventType || "", node.district || "", node.nodeType || ""].filter(Boolean)
    });
  }

  return items;
}

function main() {
  const payload = {
    schema: "otos.founderStory.feed.v1",
    exportedAt: new Date().toISOString(),
    globals: defaultGlobals(),
    items: buildItems()
  };

  const outPath = path.join(__dirname, "..", "continuity", "founder-story-feed.prefilled.json");
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
  console.log("Wrote", outPath);
}

main();

