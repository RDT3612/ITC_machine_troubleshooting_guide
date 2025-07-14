const natural = require('natural');
const stopword = require('stopword');
const crypto = require('crypto');
const Groq = require('groq-sdk').default;   // v1.x import
require('dotenv').config();

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

let knowledgeBase = [];
function initializeKnowledgeBase() {
  if (knowledgeBase.length) return;

  // CROSS-CONVEYOR entries (6)
  knowledgeBase.push({
    id: 'cross-conveyor-1',
    machineType: 'cross-conveyor',
    problem: 'Inadequate sealing of end seal',
    causes: [
      'Excessive projection of cutter',
      'Wrong coincide of patterns of upper and lower sealers',
      'Inadequate sealing pressure',
      'Inappropriate clearance of upper and lower end sealers',
      'Inappropriate Temperature of Heater',
      'Speed mismatch between wrapper material and sealer',
      'End sealing height misalignment'
    ],
    solutions: [
      'Adjust cutter projection',
      'Align upper and lower sealer patterns',
      'Increase sealing pressure',
      'Set proper clearance between sealers',
      'Adjust heater temperature',
      'Synchronize wrapper speed with crank',
      'Position end sealer at correct height'
    ],
    steps: [
      'Power off the machine and allow it to cool completely.',
      'Loosen the cutter assembly screws and inspect projection.',
      'Adjust the cutter until the end seal is uniform; tighten screws.',
      'Measure the gap between sealers; set it to 1–2 mm clearance.',
      'Use the temperature controller to set heater to manufacturer’s °C.',
      'Run a test feed and adjust crank dwell wheel to match wrapper speed.',
      'Raise or lower end sealer until the seal is fully closed without gaps.'
    ],
    keywords: ['sealing','end seal','cutter','temperature','pressure'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'cross-conveyor-2',
    machineType: 'cross-conveyor',
    problem: 'End sealer unable to seal',
    causes: ['Broken heater element','Thermocouple wire damage'],
    solutions: ['Replace faulty heater','Replace damaged thermocouple'],
    steps: [
      'Turn off power and lock out the machine.',
      'Open sealer housing to access heater element.',
      'Remove and discard the broken heater; install new element.',
      'If temperature reading is missing, replace thermocouple wire.',
      'Restore power, let temperature ramp up, and verify sealing.'
    ],
    keywords: ['sealer','heater','thermocouple','seal'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'cross-conveyor-3',
    machineType: 'cross-conveyor',
    problem: 'Inadequate sealing of centre seal',
    causes: ['Wrong centre sealer temperature','Incorrect roller pressure'],
    solutions: [
      'Set centre sealer to correct temperature',
      'Adjust roller pressure to specification'
    ],
    steps: [
      'Ensure machine is off and cooled.',
      'Check centre sealer temperature setting; adjust controller.',
      'Test seal on scrap material; fine-tune temp if needed.',
      'Loosen roller pressure nuts and use gauge to set pressure.',
      'Tighten nuts and run test to confirm proper seal strength.'
    ],
    keywords: ['centre seal','sealing','temperature','roller','pressure'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'cross-conveyor-4',
    machineType: 'cross-conveyor',
    problem: 'Centre seal unable to seal',
    causes: [
      'Heater not heating','Broken thermocouple',
      'Film not aligned','Bag former unstable'
    ],
    solutions: [
      'Check heater power','Replace thermocouple',
      'Realign film edges','Stabilize bag former'
    ],
    steps: [
      'Power off and inspect heater element wiring.',
      'Test heater output; replace if no heat.',
      'Inspect thermocouple connection; replace if faulty.',
      'Open housing; reposition film to centre seal jaws.',
      'Adjust former box clamps for stable bag formation.'
    ],
    keywords: ['centre seal','film','heater','thermocouple'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'cross-conveyor-5',
    machineType: 'cross-conveyor',
    problem: 'End seal cutter unable to cut',
    causes: ['Cutter/knife abrasion'],
    solutions: ['Readjust or replace cutter knife'],
    steps: [
      'Stop machine and lock out power.',
      'Inspect cutter blade for wear and tear.',
      'If dull, remove and sharpen or replace blade.',
      'Reinstall cutter, set projection, and secure tightly.',
      'Run sample and verify clean cutting action.'
    ],
    keywords: ['cutter','knife','cutting','abrasion'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'cross-conveyor-6',
    machineType: 'cross-conveyor',
    problem: 'Product is not fed in place',
    causes: [
      'Infeed lug timing off',
      'Packet length incorrect',
      'Wrapper length wrong',
      'Former box misinstalled',
      'Roller angle wrong',
      'Wrapper reel loose'
    ],
    solutions: [
      'Adjust lug timing','Correct packet length',
      'Set wrapper length','Install former box properly',
      'Align roller angle','Secure wrapper reel'
    ],
    steps: [
      'Switch off power and observe lug-jaw timing.',
      'Use timing gauge to align lug projection to crimp jaw.',
      'Measure and set packet length on HMI or mechanical stop.',
      'Verify wrapper roll width; adjust reel brake tension.',
      'Confirm former box centre height and tighten mounts.',
      'Set adjustable roller angle per manual and lock in place.',
      'Ensure wrapper reel is wound tight and aligned.'
    ],
    keywords: ['feeding','infeed','lug','packet','wrapper','former'],
    source: 'knowledge-base'
  });

  // SANDWICHING entries (8)
  knowledgeBase.push({
    id: 'sandwich-1',
    machineType: 'sandwiching',
    problem: 'Cream off centering during deposition',
    causes: ['Drum out of centre','Adjustment screw mis-set'],
    solutions: [
      'Re-centre drum','Set adjustment screw per shell'
    ],
    steps: [
      'Turn off machine and unlock drum housing.',
      'Loosen drum mount bolts and align drum to centre line.',
      'Tighten bolts and rotate drum manually to verify alignment.',
      'Locate cup adjustment screw; set to centre shell position.',
      'Run test deposit and adjust screw until cream is centred.'
    ],
    keywords: ['cream','centering','drum','cup'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-2',
    machineType: 'sandwiching',
    problem: 'Frequent machine stoppage',
    causes: ['Shell breakage','Chute jam'],
    solutions: ['Adjust carrier chain pin','Use correct shell size'],
    steps: [
      'Stop machine; open side covers.',
      'Inspect shells at chute exit for breakage.',
      'Adjust carrier chain pin spacing for shell gauge.',
      'Verify shells meet diameter/gauge specs and reload.',
      'Run machine slowly to confirm continuous feed.'
    ],
    keywords: ['stoppage','shell','chute','carrier'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-3',
    machineType: 'sandwiching',
    problem: 'Improper deposition of cream',
    causes: ['Cut-off wire mis-set'],
    solutions: ['Replace and set cut-off wire'],
    steps: [
      'Power down and access deposition head.',
      'Remove old cut-off wire and install new wire.',
      'Adjust wire tension and height per spec.',
      'Tighten wire clamps and rotate deposition head.',
      'Test deposition and fine-tune height for correct deposit.'
    ],
    keywords: ['cream','deposition','wire'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-4',
    machineType: 'sandwiching',
    problem: 'Improper transfer of sandwich',
    causes: ['Rail guide mis-set'],
    solutions: ['Set carrier chain rail guides'],
    steps: [
      'Stop machine and unlock transfer section.',
      'Loosen rail guide bolts on carrier chain.',
      'Slide guides until sandwich transfers smoothly.',
      'Tighten bolts and run transfer test cycle.',
      'Observe transfer; adjust guides to remove skew.'
    ],
    keywords: ['transfer','rail','guides','chain'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-5',
    machineType: 'sandwiching',
    problem: 'Decrease cream percentage',
    causes: ['Low bowl level'],
    solutions: ['Maintain bowl level'],
    steps: [
      'Power off and open bowl cover.',
      'Check cream level indicator; fill to specified level.',
      'Replace bowl cover and ensure seal.',
      'Run machine and monitor cream percentage readout.',
      'Adjust piston assembly if needed for fine tuning.'
    ],
    keywords: ['cream','percentage','bowl'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-6',
    machineType: 'sandwiching',
    problem: 'Less cream weight on shell',
    causes: ['Low cream percentage'],
    solutions: ['Adjust piston assembly'],
    steps: [
      'Turn off machine and open piston assembly access.',
      'Loosen piston lock nut.',
      'Rotate piston to increase stroke length.',
      'Tighten lock nut and close assembly.',
      'Run weight check; repeat until correct weight achieved.'
    ],
    keywords: ['cream','weight','piston'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-7',
    machineType: 'sandwiching',
    problem: 'Improper timing setting',
    causes: ['Chain timings not synced'],
    solutions: ['Match carrier & stacker timing'],
    steps: [
      'Stop machine; locate timing gears.',
      'Rotate stacker chain until alignment marks match.',
      'Rotate carrier chain to same mark position.',
      'Tighten chain tensioners and spin gears manually.',
      'Run slow cycle to verify synchronized timing.'
    ],
    keywords: ['timing','chain','carrier','stacker'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'sandwich-8',
    machineType: 'sandwiching',
    problem: 'Improper transfer guide and stacker plate setting',
    causes: ['Settings incorrect'],
    solutions: ['Correct guide & plate settings'],
    steps: [
      'Open transfer section covers.',
      'Loosen guide and plate mounting bolts.',
      'Align guides flush with plate edge.',
      'Tighten bolts and manually slide sandwich.',
      'Run test transfer and adjust if binding occurs.'
    ],
    keywords: ['guide','plate','transfer'],
    source: 'knowledge-base'
  });

  // AUTO-FEEDER entries (7)
  knowledgeBase.push({
    id: 'auto-feeder-1',
    machineType: 'auto-feeder',
    problem: 'Film does not feed properly',
    causes: ['Threading error','Rollers open','Low pressure'],
    solutions: [
      'Re-thread film','Close rollers','Increase roller pressure'
    ],
    steps: [
      'Stop machine and release film tension.',
      'Re-thread film per diagram, ensuring proper path.',
      'Push sealing roller lever to closed position.',
      'Adjust roller pressure knob until film feeds smoothly.',
      'Run film test and inspect feed consistency.'
    ],
    keywords: ['film','threading','rollers','pressure'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'auto-feeder-2',
    machineType: 'auto-feeder',
    problem: 'Tearing in the bottom sealing',
    causes: ['Excessive roller pressure','Sharp roller edges'],
    solutions: ['Reduce pressure','File edges'],
    steps: [
      'Turn off heat and open sealing area.',
      'Loosen bottom roller pressure adjustment.',
      'Reduce pressure incrementally until tear stops.',
      'Inspect roller edges; file burrs or replace roller.',
      'Re-tighten to proper pressure and test seal.'
    ],
    keywords: ['tearing','bottom','rollers'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'auto-feeder-3',
    machineType: 'auto-feeder',
    problem: 'Tearing in the end sealing',
    causes: ['Jaw serrations mis-matched','High jaw pressure'],
    solutions: ['Align serrations','Lower pressure'],
    steps: [
      'Switch off machine and access end seal jaws.',
      'Loosen jaw mounting and realign serrations evenly.',
      'Tighten jaws; adjust jaw pressure knob lower.',
      'Run sample seal; gradually increase until no tear.',
      'Lock settings and confirm tear-free seal.'
    ],
    keywords: ['tearing','end seal','jaws'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'auto-feeder-4',
    machineType: 'auto-feeder',
    problem: 'Sealing not proper in the center sealing',
    causes: ['Low temperature','Dirty rollers','Low pressure'],
    solutions: ['Raise temp','Clean rollers','Increase pressure'],
    steps: [
      'Power off and access center sealing station.',
      'Check and set center roller heater to spec temp.',
      'Remove rollers; clean with lint-free cloth.',
      'Reinstall and tighten rollers; adjust pressure knob.',
      'Run center seal test; fine-tune temp/pressure.'
    ],
    keywords: ['sealing','center','rollers','temperature'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'auto-feeder-5',
    machineType: 'auto-feeder',
    problem: 'End seal not proper',
    causes: ['Low jaw temperature','Dirty jaws','Low jaw pressure'],
    solutions: ['Increase temp','Clean jaws','Raise pressure'],
    steps: [
      'Turn off power; remove end seal guard.',
      'Set jaw heater temperature to spec.',
      'Wipe jaws clean; remove residue.',
      'Adjust jaw pressure knob up.',
      'Perform end seal test; adjust until proper seal.'
    ],
    keywords: ['end seal','temperature','jaws','pressure'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'auto-feeder-6',
    machineType: 'auto-feeder',
    problem: 'Wrinkles in the sealing',
    causes: ['Wrong product support','Incorrect height','Improper tube formation','Excess pressure'],
    solutions: [
      'Install correct support','Set correct height',
      'Adjust former box','Reduce pressure'
    ],
    steps: [
      'Stop machine; open sealing station.',
      'Verify product support matches package width.',
      'Adjust support height until film lies flat.',
      'Inspect former box; realign sheet path.',
      'Reduce sealing roller pressure gradually; test for wrinkles.'
    ],
    keywords: ['wrinkles','sealing','support'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'auto-feeder-7',
    machineType: 'auto-feeder',
    problem: 'Product jamming in the sealing jaws',
    causes: ['Sensor misalignment','HMI pulse wrong'],
    solutions: ['Align sensor','Set correct HMI pulse'],
    steps: [
      'Turn off machine; locate product phasing sensor.',
      'Loosen sensor mount; align transmitter and receiver.',
      'Tighten mount; run jam test.',
      'Open HMI settings; enter recommended pulse value.',
      'Restart feed; verify no jams.'
    ],
    keywords: ['jamming','sensor','HMI'],
    source: 'knowledge-base'
  });

  // SLUG-LOADER entries (10)
  knowledgeBase.push({
    id: 'slug-loader-1',
    machineType: 'slug-loader',
    problem: 'Heating of hopper gear motor',
    causes: ['Low oil level','Wrong oil grade'],
    solutions: ['Fill oil','Use correct oil'],
    steps: [
      'Power off and open motor housing.',
      'Check oil level; fill to mark with recommended oil.',
      'Drain old oil if wrong grade; refill per manual.',
      'Run motor briefly; monitor temperature.',
      'Repeat if overheating persists.'
    ],
    keywords: ['heating','motor','oil'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-2',
    machineType: 'slug-loader',
    problem: 'Noise from Auger',
    causes: ['Belt tension too high','Auger misaligned'],
    solutions: ['Adjust belt','Center auger'],
    steps: [
      'Stop machine and isolate drive.',
      'Loosen auger belt tensioner; set to spec tension.',
      'Check auger alignment in pipe; reposition center.',
      'Retighten belt; run slowly and listen.',
      'Fine-tune tension until noise stops.'
    ],
    keywords: ['noise','auger','belt'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-3',
    machineType: 'slug-loader',
    problem: 'Leakage between auger & Y pipe',
    causes: ['Damaged O-ring'],
    solutions: ['Replace O-ring'],
    steps: [
      'Turn off and depressurize line.',
      'Dismount Y-pipe from auger housing.',
      'Remove old O-ring; install new O-ring per spec.',
      'Reassemble and tighten clamps.',
      'Run at low speed; check for leaks.'
    ],
    keywords: ['leakage','auger','O-ring'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-4',
    machineType: 'slug-loader',
    problem: 'Leakage from pump',
    causes: ['Damaged pump O-ring','Loose rotor cover'],
    solutions: ['Replace O-ring','Tighten cover'],
    steps: [
      'Power down and isolate pump.',
      'Open pump cover; replace damaged O-ring.',
      'Clean sealing surfaces; reassemble cover tight.',
      'Prime pump and run; inspect for leakage.',
      'Check torque specs and retighten if needed.'
    ],
    keywords: ['leakage','pump'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-5',
    machineType: 'slug-loader',
    problem: 'Pump not rotating',
    causes: ['Cream jam','Lack of cleaning'],
    solutions: ['Clean pump','Clear jam'],
    steps: [
      'Switch off and lock out power.',
      'Open pump housing; remove jammed cream.',
      'Flush pipes and pump with cleaning solution.',
      'Reassemble and restart pump.',
      'Schedule regular cleaning every 15 minutes downtime.'
    ],
    keywords: ['pump','jamming','cleaning'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-6',
    machineType: 'slug-loader',
    problem: 'Cream not coming out from the pump',
    causes: ['Pump reversing'],
    solutions: ['Correct rotation direction'],
    steps: [
      'Stop pump and isolate power.',
      'Check motor wiring phasing; swap two lines if reversed.',
      'Secure wiring and reapply power.',
      'Run pump; confirm correct direction and flow.'
    ],
    keywords: ['pump','direction'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-7',
    machineType: 'slug-loader',
    problem: 'Shells escape in top & bottom magazine',
    causes: ['Shell gauge variation','Improper setting'],
    solutions: ['Check gauge tolerance','Adjust settings'],
    steps: [
      'Stop loader; open magazine covers.',
      'Measure shell diameters; confirm within tolerance.',
      'If out-of-tolerance, replace shells or adjust feeder stops.',
      'Tighten feeder guide screws and test feed.'
    ],
    keywords: ['shells','magazine'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-8',
    machineType: 'slug-loader',
    problem: 'More than one shell exits magazine',
    causes: ['Over-wide magazine gap'],
    solutions: ['Narrow magazine gap'],
    steps: [
      'Isolate machine and open magazine.',
      'Loosen side guide bolts; move guides closer.',
      'Tighten bolts and cycle shells manually.',
      'Ensure only one shell drops each cycle.'
    ],
    keywords: ['shells','multiple'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-9',
    machineType: 'slug-loader',
    problem: 'Unstable shell balancing on transport wire',
    causes: ['Loose wire','Misaligned wire support'],
    solutions: ['Tighten wire','Align support lever'],
    steps: [
      'Switch off machine; access transport wire.',
      'Tighten wire tensioner to spec tension.',
      'Adjust support lever groove alignment.',
      'Run empty cycle; observe shell stability.'
    ],
    keywords: ['balancing','wire'],
    source: 'knowledge-base'
  });

  knowledgeBase.push({
    id: 'slug-loader-10',
    machineType: 'slug-loader',
    problem: 'Shells jamming in side guides & breakage high',
    causes: ['Guide setting wrong'],
    solutions: ['Correct side guide setting'],
    steps: [
      'Stop loader; loosen side guide bolts.',
      'Align guides flush with shell path.',
      'Tighten bolts; run shells slowly.',
      'Inspect guide edges; file burrs if needed.'
    ],
    keywords: ['jamming','guides'],
    source: 'knowledge-base'
  });
}

function preprocessQuery(query) {
  const tokens = new natural.WordTokenizer().tokenize(query.toLowerCase());
  const filtered = stopword.removeStopwords(tokens);
  return filtered.map(t => natural.PorterStemmer.stem(t));
}

function calculateRelevance(item, tokens) {
  const text = [item.problem, ...item.causes, ...item.solutions, ...item.keywords]
    .join(' ')
    .toLowerCase();
  let score = 0;
  tokens.forEach(token => {
    if (text.includes(token)) score += 1;
    else if (token.length > 3 && text.includes(token.slice(0,4))) score += 0.5;
  });
  return tokens.length ? score / tokens.length : 0;
}

/**
 * Search troubleshooting entries, optionally falling back to Groq LLM.
 *
 * @param {string} query
 * @param {string} machineType
 * @param {boolean} noLLM      // if true, never call Groq API
 */
async function searchTroubleshooting(query, machineType, noLLM = false) {
  initializeKnowledgeBase();

  const tokens = preprocessQuery(query);
  let results = knowledgeBase
    .filter(i => i.machineType === machineType && calculateRelevance(i, tokens) > 0.1)
    .map(i => ({ ...i, relevance: calculateRelevance(i, tokens) }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  if (!results.length && query.trim() && !noLLM) {
    console.log('Invoking Groq LLM for:', machineType, query);
    try {
      const response = await groqClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: `You are a technical expert on ${machineType} machines.` },
          { role: 'user', content: `Troubleshoot: ${query}\n\nProvide a numbered step-by-step guide.` }
        ]
      });
      const aiText = response.choices?.[0]?.message?.content || '';
      const aiSteps = aiText
        .split('\n')
        .filter(line => /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      results = [{
        id: `llm-${crypto.randomUUID()}`,
        machineType,
        problem: query,
        causes: ['Generated by AI'],
        solutions: ['Generated by AI'],
        steps: aiSteps.length ? aiSteps : ['No steps generated.'],
        keywords: query.split(/\s+/),
        image: '',        // no static image for AI
        source: 'llm',
        relevance: 0
      }];
    } catch (err) {
      console.error('Groq LLM error:', err);
    }
  }

  return { query, results, totalFound: results.length };
}

function getIssuesByMachine(machineType) {
  initializeKnowledgeBase();
  return knowledgeBase
    .filter(i => i.machineType === machineType)
    .map(i => ({ id: i.id, problem: i.problem }));
}

module.exports = { getIssuesByMachine, searchTroubleshooting };
