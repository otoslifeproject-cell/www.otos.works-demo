/**
 * Founder Journey Final — Engine (road-first model).
 * Roads primary; journey on roads; nodes beside roads. No node-to-node connectors.
 * routeSegmentIds optional: when absent, auto-route along road network.
 * Founder route: faint line + animated footprints.
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var data = window.FounderJourneyFinalData;
  if (!data) {
    console.error("FounderJourneyFinalData not loaded.");
    return;
  }

  var VIEWBOX_W = data.VIEWBOX_W || 1600;
  var VIEWBOX_H = data.VIEWBOX_H || 1000;
  var ROADS = data.ROADS || [];
  var BREAKS = data.BREAKS || [];
  var NODES = data.NODES || [];
  var JOURNEY_STEPS = data.JOURNEY_STEPS || [];
  var CALLOUTS = data.CALLOUTS || {};
  var EVENT_MARKERS = data.EVENT_MARKERS || [];
  var COSTS = data.COSTS || [];
  var CONTINUITY_PATH = data.CONTINUITY_PATH || null;
  var R1_LOOP_PATH = data.R1_LOOP_PATH || null;
  var R2_LOOP_PATH = data.R2_LOOP_PATH || null;
  var CONSEQUENCE_NODE_IDS = data.CONSEQUENCE_NODE_IDS || [];
  var MINI_ROUTES = data.MINI_ROUTES || [];
  var STATES = data.STATES || [];

  // DOM refs
  var frame, routeCaption, routeCaptionTitle, routeCaptionDesc;
  var storyPanel, storyPanelStep, storyPanelTitle, storyPanelDesc, storyPanelCost, storyPanelTotal;
  var navZoneLeft, navZoneRight, btnStart, btnPrev, btnPlay, btnNext, playbackReadout;
  var roadLayer, breakLayer, islandLayer, journeyOverlay, stepMarkers, continuityOverlay, signals, interventionOverlay;
  var eventMarkersLayer;

  var currentState = 1;
  var stepIndex = 0;
  var totalKnownCost = 0;
  var interventionIndex = 0;
  var autoplayTimer = null;
  var journeyAnimId = null;
  var deadEndPhase2Timer = null;

  var TOL = 90; // snap tolerance for road graph (nodes can be beside road; 1600×900)

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
    if (btnPlay) {
      btnPlay.classList.remove("playing");
      btnPlay.textContent = "▶";
      btnPlay.title = "Play";
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (currentState !== 2) return;
    if (btnPlay) {
      btnPlay.classList.add("playing");
      btnPlay.textContent = "⏸";
      btnPlay.title = "Pause";
    }
    autoplayTimer = setInterval(function () {
      if (currentState !== 2) { stopAutoplay(); return; }
      if (stepIndex < JOURNEY_STEPS.length - 1) nextClick();
      else { nextClick(); stopAutoplay(); }
    }, 3500);
  }

  // ——— Path d parsing: extract start/end point from M/L or M/m/a path
  function parsePathEndpoints(d) {
    var pts = [];
    var parts = (d || "").replace(/,/g, " ").replace(/\s+/g, " ").trim().split(" ");
    var i = 0;
    var x = 0, y = 0;
    while (i < parts.length) {
      var cmd = parts[i];
      if (cmd === "M" || cmd === "m") {
        x = parseFloat(parts[i + 1]);
        y = parseFloat(parts[i + 2]);
        if (cmd === "m") { x += (pts.length ? pts[pts.length - 1].x : 0); y += (pts.length ? pts[pts.length - 1].y : 0); }
        pts.push({ x: x, y: y });
        i += 3;
      } else if (cmd === "L" || cmd === "l") {
        x = parseFloat(parts[i + 1]);
        y = parseFloat(parts[i + 2]);
        if (cmd === "l") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 3;
      } else if (cmd === "A" || cmd === "a") {
        var rx = parseFloat(parts[i + 1]);
        var ry = parseFloat(parts[i + 2]);
        var xAxis = parseFloat(parts[i + 5]);
        var yAxis = parseFloat(parts[i + 6]);
        if (cmd === "a") { xAxis += pts[pts.length - 1].x; yAxis += pts[pts.length - 1].y; }
        pts.push({ x: xAxis, y: yAxis });
        x = xAxis; y = yAxis;
        i += 7;
      } else if (cmd === "Q" || cmd === "q") {
        x = parseFloat(parts[i + 3]);
        y = parseFloat(parts[i + 4]);
        if (cmd === "q") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 5;
      } else if (cmd === "C" || cmd === "c") {
        x = parseFloat(parts[i + 5]);
        y = parseFloat(parts[i + 6]);
        if (cmd === "c") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 7;
      } else {
        i += 1;
      }
    }
    return pts.length >= 1 ? { start: pts[0], end: pts[pts.length - 1] } : null;
  }

  function dist(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }

  function distToSegment(p, seg) {
    var s = seg.start, e = seg.end;
    var dx = e.x - s.x, dy = e.y - s.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var t = Math.max(0, Math.min(1, ((p.x - s.x) * dx + (p.y - s.y) * dy) / (len * len)));
    var q = { x: s.x + t * dx, y: s.y + t * dy };
    return { d: dist(p, q), point: q };
  }

  // ——— Road graph: each segment has id, d, start, end. Build adjacency by proximity.
  var roadSegments = [];
  ROADS.forEach(function (r) {
    var ep = parsePathEndpoints(r.d);
    if (ep) {
      roadSegments.push({
        id: r.id,
        d: r.d,
        type: r.type || "main",
        start: ep.start,
        end: ep.end
      });
    }
  });

  function findNearestSegment(point) {
    var best = null, bestD = 1e9, bestT = 0, bestSeg = null;
    roadSegments.forEach(function (seg) {
      var r = distToSegment(point, seg);
      if (r.d < bestD) { bestD = r.d; best = r.point; bestSeg = seg; }
    });
    return bestD <= TOL * 4 ? { point: best, segment: bestSeg } : null;
  }

  function segmentsTouching(seg, tol) {
    tol = tol || TOL;
    var out = [];
    roadSegments.forEach(function (s2) {
      if (s2.id === seg.id) return;
      if (dist(seg.start, s2.start) <= tol || dist(seg.start, s2.end) <= tol ||
          dist(seg.end, s2.start) <= tol || dist(seg.end, s2.end) <= tol) {
        out.push(s2);
      }
    });
    return out;
  }

  // BFS from segment containing nearPoint to segment containing targetPoint; return ordered segment ids.
  function routeAlongRoads(fromPoint, toPoint) {
    var fromSnap = findNearestSegment(fromPoint);
    var toSnap = findNearestSegment(toPoint);
    if (!fromSnap || !toSnap) return [];
    if (fromSnap.segment.id === toSnap.segment.id) return [fromSnap.segment.id];

    var queue = [{ seg: fromSnap.segment, path: [fromSnap.segment.id], visited: {} }];
    queue[0].visited[fromSnap.segment.id] = true;
    while (queue.length) {
      var cur = queue.shift();
      if (cur.seg.id === toSnap.segment.id) return cur.path;
      var neighbours = segmentsTouching(cur.seg);
      for (var n = 0; n < neighbours.length; n++) {
        var seg = neighbours[n];
        if (cur.visited[seg.id]) continue;
        var v = Object.assign({}, cur.visited);
        v[seg.id] = true;
        queue.push({ seg: seg, path: cur.path.concat(seg.id), visited: v });
      }
    }
    return [];
  }

  function getNodePosition(nodeId) {
    var n = NODES.filter(function (o) { return o.id === nodeId; })[0];
    return n ? { x: n.x, y: n.y } : { x: VIEWBOX_W / 2, y: VIEWBOX_H / 2 };
  }

  // Build path d for a list of segment ids (in order). Concatenate segment paths (may be multi-part).
  function pathFromSegmentIds(segmentIds) {
    var out = [];
    var seen = {};
    segmentIds.forEach(function (id) {
      if (seen[id]) return;
      seen[id] = true;
      var seg = roadSegments.filter(function (s) { return s.id === id; })[0];
      if (seg && seg.d) out.push(seg.d);
    });
    return out.join(" ");
  }

  // ——— Return segment ids for a leg (for roundabout churn detection). Same logic as getLegPath.
  function getLegSegmentIds(stepIndexA, stepIndexB) {
    var stepA = JOURNEY_STEPS[stepIndexA];
    var stepB = JOURNEY_STEPS[stepIndexB];
    if (!stepA || !stepB) return [];
    var fromPos = getNodePosition(stepA.nodeId);
    var toPos = getNodePosition(stepB.nodeId);
    var segmentIds = stepB.routeSegmentIds;
    var eventType = stepB.eventType;

    if (eventType === "dead_end" && segmentIds && segmentIds.length) return segmentIds;
    if (segmentIds && segmentIds.length) return segmentIds;
    return routeAlongRoads(fromPos, toPos);
  }

  function fallbackLegPath(fromPos, toPos) {
    return "M" + fromPos.x + " " + fromPos.y + " L" + toPos.x + " " + toPos.y;
  }

  // ——— Resolve journey leg path: either from routeSegmentIds or auto-route. Dead end = in then out.
  // Always returns a path string (uses straight line if road routing returns empty).
  function getLegPath(stepIndexA, stepIndexB) {
    var stepA = JOURNEY_STEPS[stepIndexA];
    var stepB = JOURNEY_STEPS[stepIndexB];
    if (!stepA || !stepB) return null;
    var fromPos = getNodePosition(stepA.nodeId);
    var toPos = getNodePosition(stepB.nodeId);
    var segmentIds = stepB.routeSegmentIds;
    var eventType = stepB.eventType;

    if (eventType === "dead_end" && segmentIds && segmentIds.length) {
      var deadSeg = roadSegments.filter(function (s) { return s.id === segmentIds[0]; })[0];
      if (deadSeg) {
        var inPath = deadSeg.d;
        var rev = reversePathD(deadSeg.d);
        return inPath + " " + rev;
      }
    }

    if (segmentIds && segmentIds.length) {
      var pathD = pathFromSegmentIds(segmentIds);
      if (pathD) return pathD;
    }

    var ids = routeAlongRoads(fromPos, toPos);
    var pathD = pathFromSegmentIds(ids);
    if (pathD) return pathD;
    return fallbackLegPath(fromPos, toPos);
  }

  function reversePathD(d) {
    var pts = [];
    var parts = (d || "").replace(/,/g, " ").replace(/\s+/g, " ").trim().split(" ");
    var i = 0;
    var x = 0, y = 0;
    while (i < parts.length) {
      var cmd = parts[i];
      if (cmd === "M" || cmd === "m") {
        x = parseFloat(parts[i + 1]);
        y = parseFloat(parts[i + 2]);
        if (cmd === "m") { x += (pts.length ? pts[pts.length - 1].x : 0); y += (pts.length ? pts[pts.length - 1].y : 0); }
        pts.push({ x: x, y: y });
        i += 3;
      } else if (cmd === "L" || cmd === "l") {
        x = parseFloat(parts[i + 1]);
        y = parseFloat(parts[i + 2]);
        if (cmd === "l") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 3;
      } else {
        i += 1;
      }
    }
    if (pts.length < 2) return d;
    var out = "M" + pts[pts.length - 1].x + " " + pts[pts.length - 1].y;
    for (var j = pts.length - 2; j >= 0; j--) {
      out += " L" + pts[j].x + " " + pts[j].y;
    }
    return out;
  }

  // ——— Sample points along a path d (for footprints). Simple: parse to points, interpolate.
  function samplePathPoints(pathD, numSamples) {
    numSamples = numSamples || 40;
    var pts = parsePathToPoints(pathD);
    if (pts.length < 2) return pts;
    var out = [];
    var totalLen = 0;
    var i;
    for (i = 0; i < pts.length - 1; i++) {
      totalLen += dist(pts[i], pts[i + 1]);
    }
    var step = totalLen / Math.max(1, numSamples - 1);
    var soFar = 0;
    var target = 0;
    out.push(pts[0]);
    for (i = 0; i < pts.length - 1 && out.length < numSamples; i++) {
      var segLen = dist(pts[i], pts[i + 1]);
      while (target <= soFar + segLen && out.length < numSamples) {
        var t = segLen > 0 ? (target - soFar) / segLen : 0;
        t = Math.max(0, Math.min(1, t));
        out.push({ x: pts[i].x + t * (pts[i + 1].x - pts[i].x), y: pts[i].y + t * (pts[i + 1].y - pts[i].y) });
        target += step;
      }
      soFar += segLen;
    }
    if (out.length < numSamples && pts.length) out.push(pts[pts.length - 1]);
    return out;
  }

  function parsePathToPoints(d) {
    var pts = [];
    var parts = (d || "").replace(/,/g, " ").replace(/\s+/g, " ").trim().split(" ");
    var i = 0;
    var x = 0, y = 0;
    while (i < parts.length) {
      var cmd = parts[i];
      if (cmd === "M" || cmd === "m") {
        x = parseFloat(parts[i + 1]);
        y = parseFloat(parts[i + 2]);
        if (cmd === "m") { x += (pts.length ? pts[pts.length - 1].x : 0); y += (pts.length ? pts[pts.length - 1].y : 0); }
        pts.push({ x: x, y: y });
        i += 3;
      } else if (cmd === "L" || cmd === "l") {
        x = parseFloat(parts[i + 1]);
        y = parseFloat(parts[i + 2]);
        if (cmd === "l") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 3;
      } else if (cmd === "A" || cmd === "a") {
        var x2 = parseFloat(parts[i + 5]);
        var y2 = parseFloat(parts[i + 6]);
        if (cmd === "a") { x2 += pts[pts.length - 1].x; y2 += pts[pts.length - 1].y; }
        pts.push({ x: x2, y: y2 });
        x = x2; y = y2;
        i += 7;
      } else if (cmd === "Q" || cmd === "q") {
        x = parseFloat(parts[i + 3]);
        y = parseFloat(parts[i + 4]);
        if (cmd === "q") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 5;
      } else if (cmd === "C" || cmd === "c") {
        x = parseFloat(parts[i + 5]);
        y = parseFloat(parts[i + 6]);
        if (cmd === "c") { x += pts[pts.length - 1].x; y += pts[pts.length - 1].y; }
        pts.push({ x: x, y: y });
        i += 7;
      } else {
        i += 1;
      }
    }
    return pts;
  }

  // ——— Roads: not drawn here; user's base map image is used (mapImage in HTML). Road data (ROADS) still used for journey routing.
  function drawRoads() {
    roadLayer.innerHTML = "";
  }

  // Break markers not drawn; user's map is the only road visual.
  function drawBreaks() {
    breakLayer.innerHTML = "";
  }

  // ——— Drawing: nodes by type (canonical N01–N28). Shape/colour via class.
  function nodeShapeClass(node) {
    var t = node.nodeType || "";
    if (t === "organisation" && (node.secondaryType || "").indexOf("GP") !== -1) return "nodeGp";
    if (t === "hospital") return "nodeHospital";
    if (t === "support") return "nodeSupport";
    if (t === "partner") return "nodePartner";
    if (t === "strategic_partner") return "nodeStrategicPartner";
    if (t === "consequence") return "nodeConsequence";
    if (t === "intervention") return "nodeIntervention";
    return "nodeDefault";
  }

  function nodeInitials(node) {
    var label = (node.label || node.id || "").trim();
    if (!label) return "";
    var parts = label.split(/[\s,]+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    if (parts[0].length >= 2) return parts[0].substring(0, 2).toUpperCase();
    return parts[0].charAt(0).toUpperCase();
  }

  function drawNodes() {
    islandLayer.innerHTML = "";
    var consequenceSet = {};
    CONSEQUENCE_NODE_IDS.forEach(function (id) { consequenceSet[id] = true; });
    var pinHeadR = 32;
    var pinTipY = 18;

    NODES.forEach(function (node) {
      var g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("id", "node-" + node.id);
      g.setAttribute("class", "island nodePin " + nodeShapeClass(node) + (consequenceSet[node.id] ? " islandConsequence" : ""));
      g.setAttribute("data-node-id", node.id);

      var cx = node.x, cy = node.y;
      var headCy = cy - pinHeadR;
      var triTop = headCy + 6;
      var triW = 28;

      g.setAttribute("filter", "url(#pinShadow)");

      var circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", headCy);
      circle.setAttribute("r", pinHeadR);
      circle.setAttribute("class", "islandCircle pinHead");
      g.appendChild(circle);

      var tri = document.createElementNS(SVG_NS, "path");
      tri.setAttribute("d", "M" + (cx - triW) + " " + triTop + " L" + (cx + triW) + " " + triTop + " L" + cx + " " + (cy + pinTipY) + " Z");
      tri.setAttribute("class", "pinStem");
      g.appendChild(tri);

      var initials = document.createElementNS(SVG_NS, "text");
      initials.setAttribute("x", cx);
      initials.setAttribute("y", headCy + 8);
      initials.setAttribute("text-anchor", "middle");
      initials.setAttribute("class", "pinInitials pinLogo");
      initials.textContent = nodeInitials(node);
      g.appendChild(initials);

      var label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", cx);
      label.setAttribute("y", cy + pinHeadR + pinTipY + 14);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "islandLabel islandLabelSmall");
      label.textContent = node.label || node.id;
      g.appendChild(label);
      islandLayer.appendChild(g);
    });
  }

  // ——— Journey: accumulated path (faint gold) + active segment (bright) + node marker + moving footprints
  function buildFullJourneyPath(upToStepIndex) {
    var pathParts = [];
    for (var i = 0; i < upToStepIndex && i < JOURNEY_STEPS.length - 1; i++) {
      var leg = getLegPath(i, i + 1);
      if (leg) pathParts.push(leg);
    }
    return pathParts.join(" ");
  }

  function drawJourneyTo(upToStepIndex) {
    if (journeyAnimId) cancelAnimationFrame(journeyAnimId);
    journeyAnimId = null;
    if (deadEndPhase2Timer) clearTimeout(deadEndPhase2Timer);
    deadEndPhase2Timer = null;

    journeyOverlay.innerHTML = "";
    stepMarkers.innerHTML = "";

    var step = JOURNEY_STEPS[upToStepIndex];
    if (!step) return;
    var currentPos = getNodePosition(step.nodeId);

    // ——— Progressive route drawing: completed path (fully visible) + active segment (draws in)

    // 1. Completed path: all segments from step 1 → currentStepIndex-1. Single path, fully drawn.
    var completedPathD = upToStepIndex > 0 ? buildFullJourneyPath(upToStepIndex - 1) : "";
    if (completedPathD && completedPathD.trim()) {
      var completedPath = document.createElementNS(SVG_NS, "path");
      completedPath.setAttribute("d", completedPathD);
      completedPath.setAttribute("class", "journeySeg journeySegRed");
      completedPath.setAttribute("stroke", "#C41E3A");
      completedPath.setAttribute("stroke-width", "12");
      completedPath.setAttribute("stroke-linecap", "round");
      completedPath.setAttribute("stroke-linejoin", "round");
      completedPath.setAttribute("fill", "none");
      completedPath.setAttribute("opacity", "0.92");
      journeyOverlay.appendChild(completedPath);
    }

    // 2. Active segment: path from previous node to current. Red, draws in, then stays red.
    var activeLegD = upToStepIndex > 0 ? getLegPath(upToStepIndex - 1, upToStepIndex) : null;
    if (activeLegD && activeLegD.trim()) {
      var activePath = document.createElementNS(SVG_NS, "path");
      activePath.setAttribute("d", activeLegD);
      activePath.setAttribute("class", "journeySegActive journeySegRed");
      activePath.setAttribute("stroke", "#C41E3A");
      activePath.setAttribute("stroke-width", "14");
      activePath.setAttribute("stroke-linecap", "round");
      activePath.setAttribute("stroke-linejoin", "round");
      activePath.setAttribute("fill", "none");
      journeyOverlay.appendChild(activePath);

      var pathLen = activePath.getTotalLength();
      activePath.setAttribute("stroke-dasharray", String(pathLen));
      activePath.setAttribute("stroke-dashoffset", String(pathLen));
      activePath.style.transition = "stroke-dashoffset 1000ms ease-in-out";
      activePath.getBoundingClientRect();
      activePath.style.strokeDashoffset = "0";
    }

    // Fallback: if no path was drawn (routing failed) but we have a current step, draw one line from start to current
    if (upToStepIndex > 0 && !journeyOverlay.querySelector("path")) {
      var startPos = getNodePosition(JOURNEY_STEPS[0].nodeId);
      var fullD = fallbackLegPath(startPos, currentPos);
      var fallbackPath = document.createElementNS(SVG_NS, "path");
      fallbackPath.setAttribute("d", fullD);
      fallbackPath.setAttribute("class", "journeySeg journeySegRed");
      fallbackPath.setAttribute("stroke", "#C41E3A");
      fallbackPath.setAttribute("stroke-width", "12");
      fallbackPath.setAttribute("stroke-linecap", "round");
      fallbackPath.setAttribute("stroke-linejoin", "round");
      fallbackPath.setAttribute("fill", "none");
      fallbackPath.setAttribute("opacity", "0.92");
      journeyOverlay.appendChild(fallbackPath);
    }

    // 3. Node pulse when line reaches node
    var pulse = document.createElementNS(SVG_NS, "circle");
    pulse.setAttribute("cx", currentPos.x);
    pulse.setAttribute("cy", currentPos.y);
    pulse.setAttribute("r", 40);
    pulse.setAttribute("class", "nodePulse");
    stepMarkers.appendChild(pulse);

    // 4. Step dot and number
    var dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttribute("cx", currentPos.x);
    dot.setAttribute("cy", currentPos.y);
    dot.setAttribute("r", 17);
    dot.setAttribute("class", "stepDot");
    var txt = document.createElementNS(SVG_NS, "text");
    txt.setAttribute("x", currentPos.x);
    txt.setAttribute("y", currentPos.y + 5);
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("class", "stepNum");
    txt.textContent = String(upToStepIndex + 1);
    stepMarkers.appendChild(dot);
    stepMarkers.appendChild(txt);
  }

  // ——— Event markers: crisis (red) at Addenbrooke's — two ICU events
  function drawEventMarkers(visibleUpToStep) {
    if (!eventMarkersLayer) return;
    eventMarkersLayer.innerHTML = "";
    EVENT_MARKERS.forEach(function (ev) {
      if (visibleUpToStep != null && ev.stepSequence > visibleUpToStep) return;
      var g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "eventMarker crisisMarker");
      var circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("cx", ev.x);
      circle.setAttribute("cy", ev.y);
      circle.setAttribute("r", 18);
      circle.setAttribute("class", "crisisFlare");
      var label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", ev.x);
      label.setAttribute("y", ev.y - 24);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "eventLabel");
      label.textContent = ev.label || "";
      g.appendChild(circle);
      g.appendChild(label);
      eventMarkersLayer.appendChild(g);
    });
  }

  // ——— Story panel (floating, glassmorphic); cost integrated; position so it doesn't cover route
  function hideStoryPanel() {
    if (!storyPanel) return;
    storyPanel.classList.remove("show");
    storyPanel.setAttribute("hidden", "hidden");
  }

  function showStoryPanel(step) {
    if (!storyPanel || !storyPanelTitle || !storyPanelDesc || !storyPanelCost) return;
    var call = CALLOUTS[step.calloutId];
    if (!call) call = { title: step.title, subtitle: getNodeLabel(step.nodeId), note: "", cost: step.knownCost };
    if (storyPanelStep) storyPanelStep.textContent = "Step " + step.sequence + " of " + JOURNEY_STEPS.length;
    storyPanelTitle.textContent = call.title || step.title;
    storyPanelDesc.textContent = (call.subtitle || "") + (call.note ? "\n" + call.note : "");
    var totalSoFar = recalcCost(stepIndex);
    if (storyPanelCost) storyPanelCost.textContent = call.cost != null ? "£" + call.cost.toLocaleString("en-GB") : "—";
    if (storyPanelTotal) storyPanelTotal.textContent = totalSoFar ? "£" + totalSoFar.toLocaleString("en-GB") : "£0";
    storyPanel.classList.add("show");
    storyPanel.removeAttribute("hidden");
  }

  function getNodeLabel(nodeId) {
    var n = NODES.filter(function (o) { return o.id === nodeId; })[0];
    return n ? n.label : nodeId;
  }

  // ——— Cost: running total from COSTS / step knownCost
  function recalcCost(upToStepIndex) {
    var total = 0;
    for (var i = 0; i <= upToStepIndex && i < JOURNEY_STEPS.length; i++) {
      var c = JOURNEY_STEPS[i].knownCost;
      if (c != null) total += c;
    }
    return total;
  }

  function fmtGBP(n) {
    return "£" + (n || 0).toLocaleString("en-GB");
  }

  // ——— OTOS continuity
  function drawContinuityPath() {
    continuityOverlay.innerHTML = "";
    if (!CONTINUITY_PATH || !CONTINUITY_PATH.d) return;
    var glow = document.createElementNS(SVG_NS, "path");
    glow.setAttribute("d", CONTINUITY_PATH.d);
    glow.setAttribute("class", "contGlow");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", CONTINUITY_PATH.d);
    path.setAttribute("class", "contPath");
    continuityOverlay.appendChild(glow);
    continuityOverlay.appendChild(path);
  }

  function drawSignals() {
    if (!signals) return;
    signals.innerHTML = "";
    var pts = CONTINUITY_PATH && CONTINUITY_PATH.d ? samplePathPoints(CONTINUITY_PATH.d, 5) : [];
    pts.forEach(function (p, i) {
      var dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("cx", p.x);
      dot.setAttribute("cy", p.y);
      dot.setAttribute("r", 6);
      dot.setAttribute("class", "sigDot");
      dot.style.animationDelay = (i * 0.4) + "s";
      signals.appendChild(dot);
    });
  }

  // ——— State 4: intervention route
  function drawInterventionRoute(route) {
    interventionOverlay.innerHTML = "";
    if (!route || !route.path) return;
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", route.path);
    path.setAttribute("class", "interventionPath");
    interventionOverlay.appendChild(path);
  }

  function updatePlaybackUI() {
    if (!playbackReadout) return;
    if (currentState === 2) {
      playbackReadout.textContent = "Step " + (stepIndex + 1) + " / " + JOURNEY_STEPS.length;
    } else if (currentState === 4) {
      playbackReadout.textContent = "Intervention " + (interventionIndex + 1) + " of " + MINI_ROUTES.length;
    } else {
      playbackReadout.textContent = (STATES[currentState - 1] && STATES[currentState - 1].phaseLabel) || "System map";
    }
    if (btnPrev) btnPrev.disabled = (currentState === 2 && stepIndex <= 0) || (currentState === 1);
    if (btnNext) btnNext.disabled = false;
    if (btnStart) btnStart.disabled = false;
  }

  // ——— State machine
  function setState(state) {
    currentState = state;
    frame.setAttribute("data-state", String(state));
    stopAutoplay();
    hideStoryPanel();
    if (routeCaption) routeCaption.setAttribute("hidden", "hidden");

    if (state === 1) {
      stepIndex = 0;
      totalKnownCost = 0;
      journeyOverlay.innerHTML = "";
      stepMarkers.innerHTML = "";
      if (continuityOverlay) continuityOverlay.innerHTML = "";
      if (signals) signals.innerHTML = "";
      if (interventionOverlay) interventionOverlay.innerHTML = "";
      if (eventMarkersLayer) eventMarkersLayer.innerHTML = "";
      if (continuityOverlay) continuityOverlay.style.display = "none";
      if (signals) signals.style.display = "none";
      if (interventionOverlay) interventionOverlay.style.display = "none";
      updatePlaybackUI();
      return;
    }

    if (state === 2) {
      totalKnownCost = recalcCost(stepIndex);
      if (continuityOverlay) continuityOverlay.style.display = "none";
      if (signals) signals.style.display = "none";
      if (interventionOverlay) interventionOverlay.style.display = "none";
      drawJourneyTo(stepIndex);
      drawEventMarkers(stepIndex + 1);
      if (stepIndex < JOURNEY_STEPS.length && JOURNEY_STEPS[stepIndex]) {
        showStoryPanel(JOURNEY_STEPS[stepIndex]);
      } else {
        hideStoryPanel();
      }
      updatePlaybackUI();
      return;
    }

    if (state === 3) {
      journeyOverlay.innerHTML = "";
      stepMarkers.innerHTML = "";
      drawContinuityPath();
      drawSignals();
      if (continuityOverlay) continuityOverlay.style.display = "";
      if (signals) signals.style.display = "";
      if (interventionOverlay) interventionOverlay.innerHTML = "";
      if (interventionOverlay) interventionOverlay.style.display = "none";
      updatePlaybackUI();
      return;
    }

    if (state === 4) {
      var allRoutes = MINI_ROUTES;
      var r = allRoutes[interventionIndex] || allRoutes[0];
      if (continuityOverlay) continuityOverlay.style.display = "none";
      if (signals) signals.style.display = "none";
      if (interventionOverlay) interventionOverlay.style.display = "";
      drawInterventionRoute(r);
      if (routeCaption) {
        routeCaption.removeAttribute("hidden");
        routeCaptionTitle.textContent = r ? r.title : "";
        routeCaptionDesc.textContent = r ? (r.description || "") : "";
      }
      updatePlaybackUI();
      return;
    }
  }

  function nextClick() {
    stopAutoplay();
    if (currentState === 1) {
      stepIndex = 0;
      setState(2);
      return;
    }
    if (currentState === 2) {
      if (stepIndex < JOURNEY_STEPS.length - 1) {
        stepIndex += 1;
        totalKnownCost = recalcCost(stepIndex);
        drawJourneyTo(stepIndex);
        drawEventMarkers(stepIndex + 1);
        showStoryPanel(JOURNEY_STEPS[stepIndex]);
        updatePlaybackUI();
        return;
      }
      setState(3);
      return;
    }
    if (currentState === 3) {
      interventionIndex = 0;
      setState(4);
      return;
    }
    if (currentState === 4) {
      if (interventionIndex < MINI_ROUTES.length - 1) {
        interventionIndex += 1;
        setState(4);
        return;
      }
      setState(1);
    }
  }

  function backClick() {
    stopAutoplay();
    if (currentState === 2) {
      if (stepIndex > 0) {
        stepIndex -= 1;
        totalKnownCost = recalcCost(stepIndex);
        drawJourneyTo(stepIndex);
        drawEventMarkers(stepIndex + 1);
        if (stepIndex < JOURNEY_STEPS.length) showStoryPanel(JOURNEY_STEPS[stepIndex]);
        else hideStoryPanel();
        updatePlaybackUI();
      }
      return;
    }
    if (currentState === 3) {
      stepIndex = JOURNEY_STEPS.length;
      setState(2);
      drawJourneyTo(stepIndex);
      showStoryPanel(JOURNEY_STEPS[stepIndex]);
      updatePlaybackUI();
      return;
    }
    if (currentState === 4) {
      if (interventionIndex > 0) {
        interventionIndex -= 1;
        setState(4);
        return;
      }
      setState(3);
    }
  }

  function init() {
    frame = document.getElementById("frame");
    routeCaption = document.getElementById("routeCaption");
    routeCaptionTitle = document.getElementById("routeCaptionTitle");
    routeCaptionDesc = document.getElementById("routeCaptionDesc");
    storyPanel = document.getElementById("storyPanel");
    storyPanelStep = document.getElementById("storyPanelStep");
    storyPanelTitle = document.getElementById("storyPanelTitle");
    storyPanelDesc = document.getElementById("storyPanelDesc");
    storyPanelCost = document.getElementById("storyPanelCost");
    storyPanelTotal = document.getElementById("storyPanelTotal");
    navZoneLeft = document.getElementById("navZoneLeft");
    navZoneRight = document.getElementById("navZoneRight");
    btnStart = document.getElementById("btnStart");
    btnPrev = document.getElementById("btnPrev");
    btnPlay = document.getElementById("btnPlay");
    btnNext = document.getElementById("btnNext");
    playbackReadout = document.getElementById("playbackReadout");
    roadLayer = document.getElementById("roadLayer");
    breakLayer = document.getElementById("breakLayer");
    islandLayer = document.getElementById("islandLayer");
    journeyOverlay = document.getElementById("journeyOverlay");
    stepMarkers = document.getElementById("stepMarkers");
    continuityOverlay = document.getElementById("continuityOverlay");
    signals = document.getElementById("signals");
    interventionOverlay = document.getElementById("interventionOverlay");
    eventMarkersLayer = document.getElementById("eventMarkersLayer");

    var svg = document.querySelector(".mapSvg");
    if (svg && !document.getElementById("footprint-symbol")) {
      var defs = svg.querySelector("defs") || svg.appendChild(document.createElementNS(SVG_NS, "defs"));
      var sym = document.createElementNS(SVG_NS, "path");
      sym.setAttribute("id", "footprint-symbol");
      sym.setAttribute("d", "M-4 0 Q0 -6 4 0 Q0 6 -4 0");
      sym.setAttribute("fill", "none");
      sym.setAttribute("stroke", "currentColor");
      sym.setAttribute("stroke-width", "1.5");
      defs.appendChild(sym);
    }

    drawRoads();
    drawBreaks();
    drawNodes();
    if (continuityOverlay) continuityOverlay.style.display = "none";
    if (signals) signals.style.display = "none";
    if (interventionOverlay) interventionOverlay.style.display = "none";

    if (navZoneLeft) navZoneLeft.addEventListener("click", backClick);
    if (navZoneRight) navZoneRight.addEventListener("click", nextClick);
    if (btnStart) btnStart.addEventListener("click", function () { stopAutoplay(); if (currentState === 1) { stepIndex = 0; setState(2); } else if (currentState === 2) { stepIndex = 0; totalKnownCost = 0; drawJourneyTo(0); drawEventMarkers(1); if (JOURNEY_STEPS[0]) showStoryPanel(JOURNEY_STEPS[0]); else hideStoryPanel(); updatePlaybackUI(); } else { setState(1); } });
    if (btnPrev) btnPrev.addEventListener("click", backClick);
    if (btnPlay) btnPlay.addEventListener("click", function () { if (autoplayTimer) stopAutoplay(); else startAutoplay(); });
    if (btnNext) btnNext.addEventListener("click", nextClick);

    document.addEventListener("keydown", function (e) {
      var tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      if (tag === "button" || tag === "input" || tag === "textarea") return;
      stopAutoplay();
      if (e.key === "ArrowLeft") { e.preventDefault(); backClick(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nextClick(); }
    });

    setState(1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
