"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Web Audio API Sound Synthesizer - Tragic Shame Edition
const playSound = (type: "bell" | "buzzer" | "airhorn" | "drama") => {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "bell") {
      // 3-strike Heavy Ship Bell: Ding! Ding! Ding!
      const now = ctx.currentTime;
      const fund = 480;
      const ratios = [1, 1.2, 1.5, 1.8, 2.0, 2.4];
      const rings = [0, 0.38, 0.76]; // 3 successive rings
      rings.forEach((delay) => {
        ratios.forEach((r, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(fund * r, now + delay);
          
          const duration = 1.3 / (idx + 1);
          gain.gain.setValueAtTime(0.2 / ratios.length, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + duration + 0.1);
        });
      });
    } else if (type === "buzzer") {
      // SAD TROMBONE: "womp womp womp woooomp" (ultimate shame)
      const now = ctx.currentTime;
      const noteFreqs = [220.00, 207.65, 196.00, 174.61]; // A3, G#3, G3, F3 (descending)
      const noteTimes = [0, 0.26, 0.52, 0.78];
      const noteDurations = [0.20, 0.20, 0.20, 0.85];
      
      noteFreqs.forEach((freq, i) => {
        const t = now + noteTimes[i];
        const dur = noteDurations[i];
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, t);
        
        // Add trombone slide & wobble on the final sad note
        if (i === 3) {
          osc.frequency.exponentialRampToValueAtTime(130.00, t + dur); // steep slide down
          
          const vibrato = ctx.createOscillator();
          const vibratoGain = ctx.createGain();
          vibrato.frequency.setValueAtTime(8, t); // 8Hz vibration
          vibratoGain.gain.setValueAtTime(12, t);
          vibrato.connect(vibratoGain);
          vibratoGain.connect(osc.frequency);
          
          vibrato.start(t);
          vibrato.stop(t + dur);
        } else {
          // Slight fall at the end of note
          osc.frequency.exponentialRampToValueAtTime(freq * 0.96, t + dur);
        }
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450, t);
        filter.frequency.exponentialRampToValueAtTime(180, t + dur); // sweeping lowpass for "womp" brass filter
        
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
        gain.gain.setValueAtTime(0.22, t + dur - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    } else if (type === "airhorn") {
      // SAD SLIDE WHISTLE: cartoon falling down pitch bend
      const now = ctx.currentTime;
      const duration = 1.2;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(950, now); // start high
      osc.frequency.exponentialRampToValueAtTime(170, now + duration); // slide all the way down
      
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      gain.gain.setValueAtTime(0.25, now + duration - 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + duration + 0.05);
    } else if (type === "drama") {
      // DUN DUN DUNNN! Tragic minor suspense hit
      const now = ctx.currentTime;
      
      // Fast hit 1
      const hit1Time = now;
      const hit1Dur = 0.16;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(220, hit1Time);
      gain1.gain.setValueAtTime(0.28, hit1Time);
      gain1.gain.exponentialRampToValueAtTime(0.0001, hit1Time + hit1Dur);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(hit1Time);
      osc1.stop(hit1Time + hit1Dur + 0.05);
      
      // Fast hit 2
      const hit2Time = now + 0.22;
      const hit2Dur = 0.16;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(220, hit2Time);
      gain2.gain.setValueAtTime(0.28, hit2Time);
      gain2.gain.exponentialRampToValueAtTime(0.0001, hit2Time + hit2Dur);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(hit2Time);
      osc2.stop(hit2Time + hit2Dur + 0.05);
      
      // Deep dramatic sustained chord (A2 minor/diminished hybrid)
      const hit3Time = now + 0.44;
      const hit3Dur = 1.6;
      const notes = [110.00, 130.81, 164.81, 207.65]; // A2, C3, E3, G#3 (unresolved, highly tense minor chord)
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, hit3Time);
        
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(550, hit3Time);
        filter.frequency.exponentialRampToValueAtTime(90, hit3Time + hit3Dur);
        
        gain.gain.setValueAtTime(0.0001, hit3Time);
        gain.gain.linearRampToValueAtTime(0.2 / notes.length, hit3Time + 0.1);
        gain.gain.setValueAtTime(0.2 / notes.length, hit3Time + hit3Dur - 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, hit3Time + hit3Dur);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(hit3Time);
        osc.stop(hit3Time + hit3Dur + 0.05);
      });
    }
  } catch (e) {
    console.error("Web Audio error:", e);
  }
};

interface Ticket {
  id: string;
  title: string;
  owner: string; // The Dev
  status: "In Progress" | "Awaiting PM" | "Waiting on Client";
  daysOverdue: number;
  blockedBy: string | null; // e.g. "Gemma" (PM) or "Client" (The Void)
  excuse: string;
  excuseCount: number;
}

const INITIAL_EXCUSE_POOL = {
  Dev: [
    "Me local host got swallowed by the digital Kraken.",
    "Just waitin' for the npm install to finish. Ship's stuck in port.",
    "Refactoring me code to avoid mutiny, captain!",
    "A dependency got shipwrecked mid-sprint, rebuilding the fleet.",
    "Docker be hogging 99% of me sails and RAM.",
    "Waiting for the CI/CD wind to blow, queued behind 42 merchant vessels.",
    "Me local machine spontaneously combusted after the git pull.",
    "I was writing unit tests, then I drank some grog and forgot.",
  ],
  PM: [
    "Aligning the pirate council first.",
    "Need to run this past the treasure steering committee.",
    "Waiting on confirmation of the confirmation from the governor.",
    "Let's schedule a 2-hour tavern meeting to discuss the alignment.",
    "We must wait for the next moon cycle to prioritize the chest.",
    "Waiting for the cartographer to deliver the updated SVG map.",
    "The requirements are undergoing a chaotic transformation.",
    "Currently conducting a high-level assessment of the map.",
  ],
  Client: [
    "Sailed off to a remote island, out of office until next quarter.",
    "Map requirements have entered witness protection.",
    "The contact person got fed to the sharks.",
    "Waiting on their port authority security team since 2024.",
    "They read the message but only sent a parrot emoji back.",
    "They are currently doing a review of our chest review.",
    "Decision pending, apparently the captain's parrot needs to sign off.",
  ],
};

const LOCAL_ROAST_TEMPLATES = [
  "🏴‍☠️ {villain} has been spiritually chained to the mast of {id} for {days} days. excuse: \"{excuse}\"",
  "⚓ {id} is currently lost in the Bermuda Triangle under the custodian of {villain}.",
  "🦜 Uno Reverse! {villain} is holding {id} hostage pending a parrotted excuse of '{excuse}'",
  "🪝 Mutiny detected! {villain} has placed the chest keys for {id} in Davey Jones' locker.",
  "👻 {id} currently floating in the dead void because {villain} is sleeping off a grog hang-over. Excuse: \"{excuse}\"",
  "🏴‍☠️ Walk the plank! {villain} is stalling {id} for {days} full days under the lie of \"{excuse}\".",
  "⚠️ Ahoy! {id} has officially grown barnacles waiting for {villain}.",
  "⚔️ Cutlass drawn! Blame passed to {villain}. Current threat level: CRITICAL MUTINY."
];

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "DEV-342",
      title: "Support custom themes in core dashboard",
      owner: "Jason",
      status: "In Progress",
      daysOverdue: 9,
      blockedBy: null,
      excuse: "Me local host got swallowed by the digital Kraken.",
      excuseCount: 3,
    },
    {
      id: "DEV-119",
      title: "Fix memory leak in web sockets",
      owner: "Jason",
      status: "Awaiting PM",
      daysOverdue: 4,
      blockedBy: "Gemma",
      excuse: "Need to run this past the treasure steering committee.",
      excuseCount: 1,
    },
    {
      id: "DEV-211",
      title: "Integrate third-party analytics dashboard",
      owner: "Sarah",
      status: "Waiting on Client",
      daysOverdue: 14,
      blockedBy: "The Void",
      excuse: "Waiting on their port authority security team since 2024.",
      excuseCount: 5,
    },
    {
      id: "DEV-404",
      title: "Rewrite legacy CSS to Tailwind components",
      owner: "Sarah",
      status: "In Progress",
      daysOverdue: 6,
      blockedBy: null,
      excuse: "Me local machine spontaneously combusted after the git pull.",
      excuseCount: 2,
    },
  ]);

  // UI state
  const [newId, setNewId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newOwner, setNewOwner] = useState("Jason");
  const [newPM, setNewPM] = useState("Gemma");
  const [newDays, setNewDays] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);

  // Excuse Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [spunExcuse, setSpunExcuse] = useState("");
  const [spunTarget, setSpunTarget] = useState("");
  const [excuseHistory, setExcuseHistory] = useState<Record<string, number>>({
    "Me local host got swallowed by the digital Kraken.": 3,
    "Need to run this past the treasure steering committee.": 1,
    "Waiting on their port authority security team since 2024.": 5,
    "Me local machine spontaneously combusted after the git pull.": 2,
    "Docker be hogging 99% of me sails and RAM.": 4,
    "Aligning the pirate council first.": 8,
    "Sailed off to a remote island, out of office until next quarter.": 6,
  });

  // Roasting states
  const [roastingTicketId, setRoastingTicketId] = useState<string | null>(null);
  const [activeRoasts, setActiveRoasts] = useState<Record<string, string>>({});
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  // Audio mute/unmute
  const [isMuted, setIsMuted] = useState(false);

  // Sound triggering wrapper
  const triggerSound = (type: "bell" | "buzzer" | "airhorn" | "drama") => {
    if (!isMuted) playSound(type);
  };

  // Helper to determine the current Villain
  const getVillain = (ticket: Ticket) => {
    if (ticket.status === "Awaiting PM") return ticket.blockedBy || "Gemma";
    if (ticket.status === "Waiting on Client") return "The Void";
    return ticket.owner;
  };

  // Helper to get Villain type
  const getVillainType = (ticket: Ticket) => {
    if (ticket.status === "Awaiting PM") return "PM / Quartermaster";
    if (ticket.status === "Waiting on Client") return "The Client Void";
    return "Scallywag Dev";
  };

  // Handle Blame Shift Toggles
  const handleBlameShift = (ticketId: string, targetStatus: Ticket["status"]) => {
    triggerSound("bell");
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        let blockedBy: string | null = null;
        let pool: string[] = INITIAL_EXCUSE_POOL.Dev;

        if (targetStatus === "Awaiting PM") {
          blockedBy = "Gemma";
          pool = INITIAL_EXCUSE_POOL.PM;
        } else if (targetStatus === "Waiting on Client") {
          blockedBy = "The Void";
          pool = INITIAL_EXCUSE_POOL.Client;
        }

        const randomExcuse = pool[Math.floor(Math.random() * pool.length)];

        // Increment count in history
        setExcuseHistory((h) => ({
          ...h,
          [randomExcuse]: (h[randomExcuse] || 0) + 1,
        }));

        return {
          ...t,
          status: targetStatus,
          blockedBy,
          excuse: randomExcuse,
          excuseCount: t.excuseCount + 1,
        };
      })
    );
  };

  // Handle custom ticket submission
  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newTitle) return;

    triggerSound("drama");
    const newTicket: Ticket = {
      id: newId.toUpperCase().includes("DEV-") ? newId.toUpperCase() : `DEV-${newId}`,
      title: newTitle,
      owner: newOwner,
      status: "In Progress",
      daysOverdue: Number(newDays) || 1,
      blockedBy: null,
      excuse: "Just sailed me broken vessel into main branch.",
      excuseCount: 0,
    };

    setTickets((prev) => [newTicket, ...prev]);
    setNewId("");
    setNewTitle("");
    setShowAddModal(false);
  };

  // Handle excuse spinning
  const spinExcuseWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    triggerSound("airhorn"); // slide whistle triggers spin start!

    const categories = ["Dev", "PM", "Client"] as const;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const pool = INITIAL_EXCUSE_POOL[category];

    let timer = 0;
    const interval = setInterval(() => {
      const tempExcuse = pool[Math.floor(Math.random() * pool.length)];
      setSpunExcuse(tempExcuse);
      setSpunTarget(category);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalExcuse = pool[Math.floor(Math.random() * pool.length)];
      setSpunExcuse(finalExcuse);
      setSpunTarget(category);
      setIsSpinning(false);
      triggerSound("buzzer"); // play Sad Trombone on drop!

      // Update history
      setExcuseHistory((h) => ({
        ...h,
        [finalExcuse]: (h[finalExcuse] || 0) + 1,
      }));

      // Randomly assign excuse to a matching status ticket if available
      setTickets((prev) => {
        const eligible = prev.filter((t) => {
          if (category === "Dev") return t.status === "In Progress";
          if (category === "PM") return t.status === "Awaiting PM";
          return t.status === "Waiting on Client";
        });

        if (eligible.length === 0) return prev;
        const targetTicket = eligible[Math.floor(Math.random() * eligible.length)];

        return prev.map((t) => {
          if (t.id !== targetTicket.id) return t;
          return {
            ...t,
            excuse: finalExcuse,
            excuseCount: t.excuseCount + 1,
          };
        });
      });
    }, 1800);
  };

  // Generate Roast
  const generateRoast = async (ticket: Ticket) => {
    setRoastingTicketId(ticket.id);
    triggerSound("bell");

    const villain = getVillain(ticket);
    const villainType = getVillainType(ticket);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Write a single-sentence savage, hilarious, and highly specific pirate developer roast about ${villain} (who is a ${villainType}) holding up ticket ${ticket.id} ("${ticket.title}") for ${ticket.daysOverdue} days because they claimed: "${ticket.excuse}". Use hilarious pirate slang (arr, walk the plank, matey, scallywag, grog, parrot, hook hand). Keep it short, punchy, use emojis, and sound like a highly sarcastic internal pirate-themed meme board. Do not write more than 1 sentence.`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();
      if (data.text) {
        setActiveRoasts((prev) => ({ ...prev, [ticket.id]: data.text.trim() }));
        return;
      }
      throw new Error("No text returned");
    } catch {
      // Fallback template roasting
      const template = LOCAL_ROAST_TEMPLATES[Math.floor(Math.random() * LOCAL_ROAST_TEMPLATES.length)];
      const formatted = template
        .replace(/{villain}/g, villain)
        .replace(/{id}/g, ticket.id)
        .replace(/{days}/g, String(ticket.daysOverdue))
        .replace(/{excuse}/g, ticket.excuse);
      setActiveRoasts((prev) => ({ ...prev, [ticket.id]: formatted }));
    } finally {
      setRoastingTicketId(null);
    }
  };

  // Leaderboard Calculation
  const villainStallSums = tickets.reduce((acc, t) => {
    const villain = getVillain(t);
    acc[villain] = (acc[villain] || 0) + t.daysOverdue;
    return acc;
  }, {} as Record<string, number>);

  const sortedLeaderboard = Object.entries(villainStallSums).sort((a, b) => b[1] - a[1]);

  const totalStalledDays = tickets.reduce((sum, t) => sum + t.daysOverdue, 0);

  const getThreatLevel = () => {
    if (totalStalledDays > 30) return { label: "MUTINY AFLOAT 🏴‍☠️ (Kraken Unleashed!)", color: "text-salmon bg-light-salmon border-salmon" };
    if (totalStalledDays > 15) return { label: "STORM WARNING ⚓ (Rough Seas)", color: "text-amber-500 bg-amber-50 border-amber-400" };
    return { label: "STABLE SAILING 🌊 (Smooth Seas)", color: "text-teal bg-light-teal border-teal" };
  };

  const threat = getThreatLevel();

  // Find Pirate Achievements
  const getAchievements = (name: string) => {
    const badges: string[] = [];
    const days = villainStallSums[name] || 0;
    const maxDays = Math.max(...Object.values(villainStallSums), 0);

    if (days === maxDays && days > 0) {
      badges.push("🏴‍☠️ Captain of Mutiny");
    }

    if (name === "Gemma" && tickets.some((t) => t.status === "Awaiting PM")) {
      badges.push("🪝 Hook Hand Bottleneck");
    }

    if (name === "The Void" && tickets.some((t) => t.status === "Waiting on Client")) {
      badges.push("🐙 The Kraken's Maw");
    }

    const jasonStalls = tickets.filter((t) => t.owner === "Jason" && t.status === "In Progress");
    if (name === "Jason" && jasonStalls.length > 1) {
      badges.push("🦜 Parrot Custodian");
    }

    const totalExcuses = tickets
      .filter((t) => getVillain(t) === name)
      .reduce((sum, t) => sum + t.excuseCount, 0);
    if (totalExcuses > 3) {
      badges.push("🗺️ Master Cartographer of Lies");
    }

    if (badges.length === 0) {
      badges.push("⚓ Grog Drinker");
    }

    return badges;
  };

  // Clipboard Slack Copier
  const copySlackAlert = (ticket: Ticket) => {
    const villain = getVillain(ticket);
    const roastText = activeRoasts[ticket.id] || `Is currently holding up ${ticket.id} for ${ticket.daysOverdue} days citing: "${ticket.excuse}"`;
    const message = `🏴‍☠️ *PIRATE MUTINY SNITCH ALERT* 🏴‍☠️\n\n*Ticket:* ${ticket.id} - _${ticket.title}_\n*Days Adrift:* \`${ticket.daysOverdue} days\`\n*Custodian:* \`${villain}\`\n\n💬 *Savage Parrot Roast:* \n> "${roastText}"\n\n🔔 _*WALK THE PLANK! WALK THE PLANK!*_`;
    
    navigator.clipboard.writeText(message);
    setCopiedTicketId(ticket.id);
    triggerSound("bell");
    setTimeout(() => setCopiedTicketId(null), 2000);
  };

  return (
    <div className="flex flex-1 flex-col bg-stone text-slate min-h-screen pb-24 relative">
      
      {/* Visual background decorations (Pirate Parrot 🦜 and Hook Hand 🪝 in header) */}
      <section className="bg-dark px-8 py-10 text-white sm:px-16 border-b-4 border-teal flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        
        {/* Subtle background SVG watermarks of skull and crossbones */}
        <div className="absolute right-10 bottom-0 opacity-15 pointer-events-none text-9xl select-none hidden lg:block">
          🏴‍☠️
        </div>

        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl animate-bounce">🦜</span>
            <span className="font-heading text-xs font-semibold tracking-wider text-teal uppercase">
              Equ AI Vibe Sessions presents: The Mutiny Edition
            </span>
            <span className="text-xl">🪝</span>
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-black tracking-tight mb-2 select-none flex items-center gap-3">
            🏴‍☠️ TICKET MUTINY & SHAME
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-heading">
            Who is walking the plank today? Shaming lazy scallywags and blocking buccaneers.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-3 z-10">
          <div className="flex gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-4 py-2 bg-slate border border-white/20 hover:bg-slate/80 text-white text-sm font-semibold rounded-md flex items-center gap-2 transition"
            >
              {isMuted ? "🔇 Silence the Parrot" : "🦜 Squawk On!"}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-teal hover:bg-teal/80 text-dark text-sm font-bold rounded-md flex items-center gap-1.5 shadow-[4px_4px_0px_0px_#f58a8d] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#f58a8d] transition-all"
            >
              ➕ Snitch on a Scallywag
            </button>
          </div>
          
          <div className={`px-4 py-2 rounded-lg border-2 font-bold font-heading text-sm ${threat.color}`}>
            KRAKEN THREAT LEVEL: {threat.label} ({totalStalledDays} Days Overdue)
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* LEFT COLUMN: Feed of Tickets (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-dark flex items-center gap-2">
              🏴‍☠️ Overdue Mutiny Feed
            </h2>
            <span className="text-xs px-3 py-1 bg-stone-3 text-slate font-bold rounded-full">
              ⚓ {tickets.length} Pirate Captives
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {tickets.map((ticket) => {
              const villain = getVillain(ticket);
              const villainType = getVillainType(ticket);
              const roast = activeRoasts[ticket.id];
              const isRoasting = roastingTicketId === ticket.id;

              return (
                <div
                  key={ticket.id}
                  className={`bg-white border-2 rounded-xl p-6 shadow-md transition-all duration-300 relative overflow-hidden ${
                    ticket.status === "In Progress"
                      ? "border-dark hover:shadow-[6px_6px_0px_0px_rgba(38,39,44,0.15)]"
                      : ticket.status === "Awaiting PM"
                      ? "border-teal hover:shadow-[6px_6px_0px_0px_rgba(70,194,172,0.25)]"
                      : "border-salmon hover:shadow-[6px_6px_0px_0px_rgba(245,138,141,0.25)]"
                  }`}
                >
                  {/* Visual Category Stripe */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 ${
                      ticket.status === "In Progress"
                        ? "bg-dark"
                        : ticket.status === "Awaiting PM"
                        ? "bg-teal"
                        : "bg-salmon"
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex items-start justify-between mt-1 mb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black tracking-wider uppercase bg-stone-2 text-dark px-2.5 py-0.5 rounded">
                          ⚓ {ticket.id}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === "In Progress"
                              ? "bg-stone-3 text-dark"
                              : ticket.status === "Awaiting PM"
                              ? "bg-light-teal text-teal"
                              : "bg-light-salmon text-salmon"
                          }`}
                        >
                          {ticket.status === "In Progress"
                            ? "⚔️ Adrift"
                            : ticket.status === "Awaiting PM"
                            ? "🪝 PM Blocked"
                            : "🐙 In the Void"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-dark leading-snug">
                        {ticket.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-3xl font-black text-salmon leading-none">
                        {ticket.daysOverdue}d
                      </span>
                      <span className="text-[10px] font-bold text-slate/60 tracking-wider uppercase">
                        DAYS OVERDUE
                      </span>
                    </div>
                  </div>

                  {/* Villain Card & excuse description */}
                  <div className="bg-stone/50 border border-stone-3 rounded-lg p-4 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                      <div className="h-14 w-14 rounded-full border-2 border-dark-2 bg-stone-2 flex items-center justify-center shrink-0 text-3xl shadow-inner select-none relative">
                        {villainType.includes("Dev") ? "🦜" : villainType.includes("PM") ? "🪝" : "🐙"}
                        {ticket.excuseCount > 3 && (
                          <span className="absolute -top-1 -right-1 text-sm animate-bounce">🏴‍☠️</span>
                        )}
                      </div>
                      <div className="w-full">
                        <p className="text-xs font-bold text-slate/50 tracking-wide uppercase">
                          💀 CURRENT SCALLYWAG / MUTINEER
                        </p>
                        <p className="text-lg font-black text-dark flex items-center gap-1.5">
                          {villain}{" "}
                          <span className="text-xs font-semibold text-slate/75 italic">
                            ({villainType})
                          </span>
                        </p>
                        <p className="text-sm text-slate italic mt-1 bg-white/70 px-2 py-1 rounded border border-stone-2 font-mono">
                          &ldquo;{ticket.excuse}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Status Flippers (Blame Shifter Engine) */}
                  <div className="border-t border-stone-3 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-extrabold text-slate/60 uppercase tracking-widest">
                        ⚓ SET SAIL OR WALK THE PLANK
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleBlameShift(ticket.id, "In Progress")}
                          className={`px-3 py-1.5 rounded text-xs font-bold border transition flex items-center gap-1 ${
                            ticket.status === "In Progress"
                              ? "bg-dark text-white border-dark"
                              : "bg-white text-slate border-stone-4 hover:bg-stone/30"
                          }`}
                        >
                          🦜 Dev Mutiny ({ticket.owner})
                        </button>
                        <button
                          onClick={() => handleBlameShift(ticket.id, "Awaiting PM")}
                          className={`px-3 py-1.5 rounded text-xs font-bold border transition flex items-center gap-1 ${
                            ticket.status === "Awaiting PM"
                              ? "bg-teal text-dark border-teal"
                              : "bg-white text-slate border-stone-4 hover:bg-stone/30"
                          }`}
                        >
                          🪝 PM Hook Block (Gemma)
                        </button>
                        <button
                          onClick={() => handleBlameShift(ticket.id, "Waiting on Client")}
                          className={`px-3 py-1.5 rounded text-xs font-bold border transition flex items-center gap-1 ${
                            ticket.status === "Waiting on Client"
                              ? "bg-salmon text-white border-salmon"
                              : "bg-white text-slate border-stone-4 hover:bg-stone/30"
                          }`}
                        >
                          🐙 Feed to Client Kraken
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => generateRoast(ticket)}
                        disabled={isRoasting}
                        className={`px-4 py-2 text-xs font-bold rounded border-2 border-dark-2 bg-stone hover:bg-stone-3 text-dark transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 ${
                          isRoasting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        🔥 {isRoasting ? "Summoning Parrot..." : roast ? "Re-Roast" : "Let the Parrot Roast"}
                      </button>

                      {roast && (
                        <button
                          onClick={() => copySlackAlert(ticket)}
                          className="px-4 py-2 text-xs font-bold rounded border-2 border-teal bg-light-teal hover:bg-teal hover:text-dark text-teal-800 transition flex items-center gap-1"
                        >
                          💬 {copiedTicketId === ticket.id ? "Copied!" : "Slack Post"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Speech Bubble */}
                  {roast && (
                    <div className="mt-4 bg-light-salmon/50 border border-salmon/30 rounded-lg p-3 text-dark text-sm relative flex items-start gap-2.5 animate-fadeIn">
                      <span className="text-xl shrink-0 mt-0.5">🦜</span>
                      <p className="font-heading font-semibold italic text-slate-800">
                        &ldquo;{roast}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Soundboard, Leaderboard, Excuse Wheel (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Soundboard Component - Heavy Resounding Shame */}
          <div className="bg-dark text-white rounded-xl p-6 border-2 border-slate shadow-lg">
            <h2 className="text-xl font-black mb-1 text-white flex items-center gap-2">
              🦜 MUTINY SOUNDBOARD
            </h2>
            <p className="text-white/60 text-xs mb-4">
              Blast custom audio effects when someone denies accountability.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => triggerSound("bell")}
                className="py-4 rounded bg-slate hover:bg-teal hover:text-dark border border-white/10 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition duration-150 active:scale-95 shadow-md text-center"
              >
                <span className="text-2xl">🔔</span>
                <span className="block text-[11px] uppercase tracking-wider font-extrabold mt-1">SHIP BELL</span>
              </button>
              <button
                onClick={() => triggerSound("buzzer")}
                className="py-4 rounded bg-slate hover:bg-salmon border border-white/10 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition duration-150 active:scale-95 shadow-md text-center"
              >
                <span className="text-2xl">🎺</span>
                <span className="block text-[11px] uppercase tracking-wider font-extrabold mt-1">SAD TROMBONE</span>
              </button>
              <button
                onClick={() => triggerSound("airhorn")}
                className="py-4 rounded bg-slate hover:bg-teal hover:text-dark border border-white/10 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition duration-150 active:scale-95 shadow-md text-center"
              >
                <span className="text-2xl">📉</span>
                <span className="block text-[11px] uppercase tracking-wider font-extrabold mt-1">SAD SLIDE</span>
              </button>
              <button
                onClick={() => triggerSound("drama")}
                className="py-4 rounded bg-slate hover:bg-salmon border border-white/10 font-black text-sm flex flex-col items-center justify-center gap-1.5 transition duration-150 active:scale-95 shadow-md text-center"
              >
                <span className="text-2xl">💥</span>
                <span className="block text-[11px] uppercase tracking-wider font-extrabold mt-1">DUN DUN DUN!</span>
              </button>
            </div>
            
            <button
              onClick={() => triggerSound("buzzer")}
              className="w-full mt-4 py-3 bg-salmon hover:bg-salmon/80 text-dark font-black text-lg rounded border-2 border-white shadow-[0px_4px_0px_0px_#46c2ac] active:translate-y-0.5 active:shadow-[0px_2px_0px_0px_#46c2ac] transition-all flex items-center justify-center gap-2"
            >
              🎺 PLAY WOMP WOMP! 🎺
            </button>
          </div>

          {/* Excuse Spinner Wheel */}
          <div className="bg-white rounded-xl p-6 border-2 border-stone-4 shadow-md text-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-light-teal rounded-full -mr-12 -mt-12 flex items-end justify-start p-4 text-2xl select-none">
              🎡
            </div>
            
            <h2 className="text-xl font-black mb-1">
              🦜 PARROT EXCUSE SPINNER
            </h2>
            <p className="text-slate/60 text-xs mb-4">
              Spin to generate a random delay reason and auto-feed a blocked ticket category.
            </p>

            <div className="border border-stone-3 rounded-lg bg-stone/40 p-4 mb-4 min-h-[90px] flex flex-col justify-center items-center text-center">
              {spunExcuse ? (
                <>
                  <span className="text-[10px] font-black text-teal uppercase tracking-widest mb-1">
                    🦜 {spunTarget.toUpperCase()} EXCUSE SQUAWKED
                  </span>
                  <p className="font-mono text-xs font-semibold leading-relaxed text-dark italic">
                    &ldquo;{spunExcuse}&rdquo;
                  </p>
                </>
              ) : (
                <p className="text-slate/40 text-xs font-bold italic">
                  Parrot clearing its throat...
                </p>
              )}
            </div>

            <button
              onClick={spinExcuseWheel}
              disabled={isSpinning}
              className={`w-full py-2.5 rounded font-black text-xs uppercase tracking-wider text-white bg-dark border border-dark-2 shadow-[3px_3px_0px_0px_#46c2ac] hover:shadow-[1px_1px_0px_0px_#46c2ac] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
                isSpinning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSpinning ? "🌀 Parrot is Squawking Lies..." : "🦜 Spin Parrot Spinner"}
            </button>
          </div>

          {/* Sprint Leaderboard Podium */}
          <div className="bg-white rounded-xl p-6 border-2 border-dark shadow-md text-dark">
            <h2 className="text-xl font-black mb-1 flex items-center gap-2">
              🏆 MOST WANTED SCALLYWAGS
            </h2>
            <p className="text-slate/60 text-xs mb-6">
              Cumulative days overdue. Who walks the plank first?
            </p>

            <div className="flex flex-col gap-4">
              {sortedLeaderboard.map(([name, days], index) => {
                const max = sortedLeaderboard[0][1] || 1;
                const percentage = Math.max(10, Math.min(100, (days / max) * 100));
                const achievements = getAchievements(name);

                return (
                  <div key={name} className="flex flex-col gap-1 border-b border-stone-2 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                            index === 0
                              ? "bg-salmon text-white"
                              : index === 1
                              ? "bg-teal text-dark"
                              : "bg-stone-3 text-dark"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-extrabold text-sm text-dark">{name}</span>
                      </div>
                      <span className="font-black text-dark text-sm">{days} days overdue</span>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2.5 bg-stone/70 rounded-full overflow-hidden border border-stone-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          index === 0 ? "bg-salmon" : index === 1 ? "bg-teal" : "bg-stone-4"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Achievements badges */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {achievements.map((badge) => (
                        <span
                          key={badge}
                          className="text-[9px] font-black uppercase tracking-wider bg-light-salmon/80 text-salmon-800 border border-salmon/20 px-1.5 py-0.5 rounded"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Excuse Frequency Statistics */}
          <div className="bg-white rounded-xl p-6 border-2 border-stone-4 shadow-md text-dark">
            <h2 className="text-base font-black mb-3 text-dark flex items-center gap-1.5">
              📊 LOGBOOK OF EXCUSETRIES
            </h2>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto font-mono text-[10px]">
              {Object.entries(excuseHistory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([excuse, count]) => (
                  <div key={excuse} className="flex justify-between items-start gap-3 bg-stone/40 p-2 rounded">
                    <span className="text-slate font-semibold truncate max-w-[200px]" title={excuse}>
                      &ldquo;{excuse}&rdquo;
                    </span>
                    <span className="font-black bg-stone-3 text-dark px-1.5 py-0.5 rounded text-center shrink-0">
                      {count}x squawked
                    </span>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </main>

      {/* Add Custom Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border-4 border-dark rounded-xl p-6 max-w-md w-full shadow-[8px_8px_0px_0px_#46c2ac] relative animate-scaleUp">
            
            <button
              onClick={() => {
                triggerSound("bell");
                setShowAddModal(false);
              }}
              className="absolute top-4 right-4 text-xl font-bold text-dark hover:text-salmon cursor-pointer select-none"
            >
              ✖
            </button>

            <h2 className="text-2xl font-black mb-2 text-dark">
              🏴‍☠️ SNITCH ON A SCALLYWAG
            </h2>
            <p className="text-slate/60 text-xs mb-6">
              Create a custom ticket accusation so you can publicly make your real colleagues walk the plank.
            </p>

            <form onSubmit={handleAddTicket} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate mb-1">
                  Scallywag Ticket Key
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DEV-808"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-stone-4 rounded focus:outline-none focus:border-dark font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate mb-1">
                  Mutiny Accusation (Description)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forgot to hoist the sails (forgot to push)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-stone-4 rounded focus:outline-none focus:border-dark text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate mb-1">
                    Target Buccaneer (Dev)
                  </label>
                  <select
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-stone-4 rounded focus:outline-none focus:border-dark text-sm bg-white"
                  >
                    <option value="Jason">Jason</option>
                    <option value="Sarah">Sarah</option>
                    <option value="Bob">Bob</option>
                    <option value="Alice">Alice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate mb-1">
                    Days Overdue
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-stone-4 rounded focus:outline-none focus:border-dark text-sm font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-dark hover:bg-dark/80 text-white font-black text-sm uppercase rounded tracking-wider shadow-[4px_4px_0px_0px_#f58a8d] hover:shadow-[2px_2px_0px_0px_#f58a8d] transition-all"
              >
                🏴‍☠️ Make 'Em Walk the Plank!
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Retro-Styled Equ Landing Branding Footnotes */}
      <footer className="max-w-7xl mx-auto px-8 mt-24 pt-8 border-t border-stone-3 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
        <div className="flex items-center gap-4">
          <Image
            src="/equ-dark-transparent-bg.png"
            alt="equ"
            width={72}
            height={38}
          />
          <span className="h-6 w-px bg-stone-3" />
          <p className="text-xs text-slate/50 font-bold uppercase tracking-wider">
            Ticket Snitch Mutiny MVP — an equ pirate experience
          </p>
        </div>
        <p className="text-xs text-slate/40 font-mono">
          Made with 🏴‍☠️ by Antigravity under extreme mutiny conditions.
        </p>
      </footer>
    </div>
  );
}
