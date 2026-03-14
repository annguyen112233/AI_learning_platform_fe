import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMe } from '../../services/userService';
import {
  Award, Star, Zap, TrendingUp, Lock, CheckCircle2,
  Trophy, Target, Calendar, Crown, Medal, Share2, Sparkles
} from 'lucide-react';

/* =====================================================
   CSS-in-JS styles via <style> tag
   ===================================================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

  .achievements-page {
    font-family: 'Outfit', sans-serif;
  }

  /* ── BADGE 3D CARD ── */
  .badge-card {
    perspective: 800px;
    cursor: pointer;
  }

  .badge-card-inner {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease;
    transform-style: preserve-3d;
    border-radius: 20px;
  }

  .badge-card:hover .badge-card-inner {
    transform: rotateX(-6deg) rotateY(8deg) scale(1.04);
  }

  /* ── GLOW EFFECT theo rarity ── */
  .badge-unlocked-common:hover .badge-card-inner   { box-shadow: 0 20px 60px rgba(100,116,139,0.35); }
  .badge-unlocked-rare:hover .badge-card-inner      { box-shadow: 0 20px 60px rgba(59,130,246,0.45); }
  .badge-unlocked-epic:hover .badge-card-inner      { box-shadow: 0 20px 60px rgba(168,85,247,0.55); }
  .badge-unlocked-legendary:hover .badge-card-inner { box-shadow: 0 20px 60px rgba(251,191,36,0.65); }

  /* ── SHINE SWEEP ── */
  .shine-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
  }
  .shine-wrap::after {
    content: '';
    position: absolute;
    top: -60%;
    left: -60%;
    width: 40%;
    height: 200%;
    background: linear-gradient(
      105deg,
      transparent 20%,
      rgba(255,255,255,0.45) 50%,
      transparent 80%
    );
    transform: skewX(-20deg);
    transition: left 0.6s ease;
    pointer-events: none;
  }
  .badge-card:hover .shine-wrap::after {
    left: 130%;
  }

  /* ── ICON 3D EMBOSS ── */
  .badge-icon-3d {
    position: relative;
    border-radius: 18px;
    transition: transform 0.3s ease;
  }
  .badge-card:hover .badge-icon-3d {
    transform: translateZ(20px) scale(1.12);
  }

  /* Legendary shimmer ring */
  .legendary-ring {
    position: absolute;
    inset: -4px;
    border-radius: 22px;
    background: conic-gradient(
      from 0deg,
      #fbbf24, #f97316, #ef4444, #ec4899, #a855f7, #3b82f6, #10b981, #fbbf24
    );
    animation: legendaryRotate 3s linear infinite;
    filter: blur(2px);
    z-index: 0;
  }
  @keyframes legendaryRotate {
    to { transform: rotate(360deg); }
  }

  /* Epic pulse ring */
  .epic-pulse {
    position: absolute;
    inset: -3px;
    border-radius: 21px;
    background: linear-gradient(135deg, #a855f7, #7c3aed, #4f46e5);
    animation: epicPulse 2s ease-in-out infinite;
    z-index: 0;
  }
  @keyframes epicPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.04); }
  }

  /* Rare shimmer */
  .rare-shimmer {
    position: absolute;
    inset: -2px;
    border-radius: 20px;
    background: linear-gradient(135deg, #3b82f6, #0ea5e9, #6366f1);
    animation: rareShimmer 2.5s ease-in-out infinite alternate;
    z-index: 0;
  }
  @keyframes rareShimmer {
    from { opacity: 0.5; }
    to   { opacity: 0.9; }
  }

  /* ── FLOATING SPARKLES ── */
  .sparkles-container {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    overflow: hidden;
    border-radius: 20px;
  }
  .sparkle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    opacity: 0;
    animation: sparkleFloat 1.5s ease-in-out infinite;
  }
  @keyframes sparkleFloat {
    0%   { opacity: 0;   transform: translateY(0) scale(0); }
    30%  { opacity: 1;   transform: translateY(-25px) scale(1); }
    100% { opacity: 0;   transform: translateY(-55px) scale(0.5); }
  }

  /* ── LEGENDARY FLOAT ── */
  .legendary-float {
    animation: legendaryFloat 4s ease-in-out infinite;
  }
  @keyframes legendaryFloat {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }

  /* ── PROGRESS BAR ANIMATED ── */
  .progress-bar-anim {
    animation: fillUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes fillUp {
    from { width: 0%; }
  }

  /* ── RARITY BADGE PILL ── */
  .rarity-pill-common     { background: linear-gradient(135deg,#e2e8f0,#cbd5e1); color:#475569; }
  .rarity-pill-rare       { background: linear-gradient(135deg,#dbeafe,#bfdbfe); color:#1d4ed8; }
  .rarity-pill-epic       { background: linear-gradient(135deg,#ede9fe,#ddd6fe); color:#7c3aed; }
  .rarity-pill-legendary  {
    background: linear-gradient(135deg,#fef3c7,#fde68a,#fcd34d);
    color: #92400e;
    animation: pillGlow 2s ease-in-out infinite alternate;
  }
  @keyframes pillGlow {
    from { box-shadow: 0 0 0px rgba(251,191,36,0); }
    to   { box-shadow: 0 0 8px rgba(251,191,36,0.7); }
  }

  /* ── STAT CARD ── */
  .stat-card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .stat-card-hover:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  }

  /* ── XP BAR GLOW ── */
  .xp-bar-fill {
    position: relative;
    overflow: hidden;
  }
  .xp-bar-fill::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
    animation: xpShine 2s linear infinite;
  }
  @keyframes xpShine {
    to { left: 150%; }
  }

  /* ── LOCKED CARD ── */
  .badge-locked .badge-card-inner {
    filter: grayscale(0.8);
    opacity: 0.65;
  }
  .badge-locked:hover .badge-card-inner {
    filter: grayscale(0.3);
    opacity: 0.85;
    transform: rotateX(-3deg) rotateY(4deg) scale(1.02);
  }

  /* ── STREAK FIRE PULSE ── */
  .streak-fire {
    animation: firePulse 1.2s ease-in-out infinite;
  }
  @keyframes firePulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #f97316); }
    50%       { transform: scale(1.15); filter: drop-shadow(0 0 10px #ef4444); }
  }

  /* ── LEADERBOARD RANK GLOW ── */
  .rank-gold   { background: linear-gradient(135deg,#fbbf24,#f59e0b); box-shadow: 0 4px 15px rgba(251,191,36,0.5); }
  .rank-silver { background: linear-gradient(135deg,#e2e8f0,#cbd5e1); box-shadow: 0 4px 15px rgba(203,213,225,0.5); }
  .rank-bronze { background: linear-gradient(135deg,#fdba74,#f97316); box-shadow: 0 4px 15px rgba(249,115,22,0.5); }

  /* ══════════════════════════════════════
     LIGHTNING STORM EFFECTS
     ══════════════════════════════════════ */

  /* Full-screen flash overlay — blood red */
  .lightning-flash {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    animation: lightningFlash 0.6s ease-out forwards;
  }
  @keyframes lightningFlash {
    0%   { background: rgba(180,0,0,0.65); }
    30%  { background: rgba(220,0,0,0.45); }
    60%  { background: rgba(160,0,0,0.35); }
    80%  { background: rgba(100,0,0,0.15); }
    100% { background: rgba(0,0,0,0); }
  }

  /* Individual bolt SVG wrapper — blood red glow */
  .lightning-bolt-wrap {
    position: fixed;
    top: 0;
    pointer-events: none;
    z-index: 9998;
    animation: boltFade 1.4s ease-out forwards;
  }
  @keyframes boltFade {
    0%   { opacity: 1;   filter: drop-shadow(0 0 18px #ff2020) drop-shadow(0 0 40px #7f0000) drop-shadow(0 0 70px #3f0000); }
    40%  { opacity: 0.9; filter: drop-shadow(0 0 12px #ff0000) drop-shadow(0 0 28px #7f0000); }
    70%  { opacity: 0.6; filter: drop-shadow(0 0 8px #cc0000);  }
    100% { opacity: 0;   filter: drop-shadow(0 0 0px transparent); }
  }

  /* Horizontal plasma streak — blood red */
  .plasma-streak {
    position: fixed;
    height: 3px;
    pointer-events: none;
    z-index: 9997;
    border-radius: 999px;
    animation: plasmaRun 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  @keyframes plasmaRun {
    from { width: 0;    opacity: 1; }
    60%  { opacity: 0.9; }
    to   { width: 70vw; opacity: 0; }
  }

  /* Arc spark particle */
  .arc-spark {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    pointer-events: none;
    animation: arcFly 0.7s ease-out forwards;
  }
  @keyframes arcFly {
    from { transform: translate(0,0) scale(1); opacity: 1; }
    to   { transform: var(--spark-end); opacity: 0; scale: 0.2; }
  }

  /* Badge thunder-shake on legendary */
  .badge-thunder-shake {
    animation: thunderShake 0.45s ease-out both;
  }
  @keyframes thunderShake {
    0%,100% { transform: rotateX(-6deg) rotateY(8deg) scale(1.04) translateX(0); }
    20%      { transform: rotateX(-6deg) rotateY(8deg) scale(1.04) translateX(-5px); }
    40%      { transform: rotateX(-6deg) rotateY(8deg) scale(1.04) translateX(5px); }
    60%      { transform: rotateX(-6deg) rotateY(8deg) scale(1.06) translateX(-3px); }
    80%      { transform: rotateX(-6deg) rotateY(8deg) scale(1.04) translateX(3px); }
  }

  /* Storm cloud drift in background */
  .storm-cloud {
    position: fixed;
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    filter: blur(60px);
    border-radius: 50%;
    animation: cloudDrift var(--cloud-dur, 18s) ease-in-out infinite;
  }
  @keyframes cloudDrift {
    0%   { opacity: 0;    transform: translateX(-10%) translateY(0); }
    15%  { opacity: 0.12; }
    50%  { opacity: 0.18; transform: translateX(10%) translateY(-3%); }
    85%  { opacity: 0.12; }
    100% { opacity: 0;    transform: translateX(-10%) translateY(0); }
  }

  /* Electric border glow on legendary badges during storm */
  .legendary-storm-glow {
    animation: legendaryStormGlow 1.5s ease-in-out 3;
  }
  @keyframes legendaryStormGlow {
    0%,100% { box-shadow: 0 0 0px rgba(139,92,246,0); }
    50%      { box-shadow: 0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(99,102,241,0.5), inset 0 0 20px rgba(139,92,246,0.15); }
  }

  /* ══════════════════════════════════════
     KITSUNE MASCOT ANIMATIONS
     ══════════════════════════════════════ */

  /* Body bob up/down */
  .kitsune-body {
    animation: kitsuneFloat 3s ease-in-out infinite;
    transform-origin: bottom center;
    filter: drop-shadow(0 18px 24px rgba(251,146,60,0.35));
  }
  @keyframes kitsuneFloat {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    30%       { transform: translateY(-10px) rotate(1.5deg); }
    60%       { transform: translateY(-6px) rotate(-0.5deg); }
  }

  /* Tail wag */
  .kitsune-tail {
    transform-origin: 28px 10px;
    animation: tailWag 1.4s ease-in-out infinite;
  }
  @keyframes tailWag {
    0%, 100% { transform: rotate(-18deg); }
    50%       { transform: rotate(22deg); }
  }

  /* Ear wiggle */
  .kitsune-ear-left {
    transform-origin: 50% 100%;
    animation: earWiggle 2.5s ease-in-out infinite;
  }
  .kitsune-ear-right {
    transform-origin: 50% 100%;
    animation: earWiggle 2.5s ease-in-out infinite 0.3s;
  }
  @keyframes earWiggle {
    0% ,80%, 100% { transform: rotate(0deg); }
    85% { transform: rotate(-12deg); }
    92% { transform: rotate(10deg); }
  }

  /* Arm/hand wave */
  .kitsune-arm {
    transform-origin: 4px 4px;
    animation: armWave 1.8s ease-in-out infinite;
  }
  @keyframes armWave {
    0%, 100% { transform: rotate(0deg); }
    25%       { transform: rotate(-32deg); }
    50%       { transform: rotate(10deg); }
    75%       { transform: rotate(-20deg); }
  }

  /* Eye blink */
  .kitsune-eye {
    animation: eyeBlink 4s ease-in-out infinite;
  }
  @keyframes eyeBlink {
    0%, 90%, 100% { transform: scaleY(1); }
    93%           { transform: scaleY(0.08); }
    96%           { transform: scaleY(1); }
    98%           { transform: scaleY(0.08); }
  }

  /* Cheek glow pulse */
  .kitsune-cheek {
    animation: cheekPulse 3s ease-in-out infinite;
  }
  @keyframes cheekPulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }

  /* Platform shadow breathe */
  .kitsune-shadow {
    animation: shadowBreath 3s ease-in-out infinite;
    transform-origin: center;
  }
  @keyframes shadowBreath {
    0%, 100% { transform: scaleX(1);   opacity: 0.18; }
    30%       { transform: scaleX(0.7); opacity: 0.09; }
    60%       { transform: scaleX(0.82); opacity: 0.13; }
  }

  /* Stars orbiting mascot */
  .kitsune-star {
    animation: starOrbit 6s linear infinite;
    transform-origin: 100px 100px;
  }
  .kitsune-star-2 {
    animation: starOrbit 9s linear infinite reverse;
    transform-origin: 100px 100px;
  }
  @keyframes starOrbit {
    from { transform: rotate(0deg) translateX(80px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
  }

  /* Speech bubble pop */
  .kitsune-bubble {
    animation: bubblePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes bubblePop {
    from { transform: scale(0) translateY(10px); opacity: 0; }
    to   { transform: scale(1) translateY(0);    opacity: 1; }
  }
  .kitsune-bubble-text {
    animation: textFade 0.4s ease 0.2s both;
  }
  @keyframes textFade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ══════════════════════════════════════
     3D FLOATING STUDY BACKGROUND
     ══════════════════════════════════════ */

  .study-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  /* Each floating item */
  .study-item {
    position: absolute;
    will-change: transform;
    transform-style: preserve-3d;
    animation: studyFloat var(--dur, 12s) ease-in-out infinite var(--delay, 0s);
    opacity: var(--op, 0.13);
    filter: drop-shadow(0 8px 24px rgba(99,102,241,0.18));
  }
  @keyframes studyFloat {
    0%   { transform: translateY(0px)   translateX(0px)   rotateX(var(--rx,8deg))  rotateY(var(--ry,12deg))  scale(1); }
    25%  { transform: translateY(-18px) translateX(6px)   rotateX(var(--rx2,14deg)) rotateY(var(--ry2,5deg))  scale(1.03); }
    50%  { transform: translateY(-10px) translateX(-8px)  rotateX(var(--rx,8deg))  rotateY(var(--ry,-8deg)) scale(0.98); }
    75%  { transform: translateY(-22px) translateX(4px)   rotateX(var(--rx3,4deg)) rotateY(var(--ry2,18deg)) scale(1.02); }
    100% { transform: translateY(0px)   translateX(0px)   rotateX(var(--rx,8deg))  rotateY(var(--ry,12deg))  scale(1); }
  }

  /* Slow spin for some items */
  .study-item-spin {
    position: absolute;
    will-change: transform;
    opacity: var(--op, 0.1);
    animation: studySpin var(--dur, 20s) linear infinite var(--delay, 0s);
    filter: drop-shadow(0 4px 16px rgba(139,92,246,0.2));
  }
  @keyframes studySpin {
    from { transform: rotate(0deg) translateY(0px); }
    50%  { transform: rotate(180deg) translateY(-12px); }
    to   { transform: rotate(360deg) translateY(0px); }
  }

  /* Diagonal drift items */
  .study-item-drift {
    position: absolute;
    will-change: transform;
    opacity: var(--op, 0.08);
    animation: studyDrift var(--dur, 16s) ease-in-out infinite alternate var(--delay, 0s);
    filter: drop-shadow(0 6px 20px rgba(59,130,246,0.15));
  }
  @keyframes studyDrift {
    from { transform: translate(0, 0)        rotate(var(--rot, -15deg)) scale(1);    }
    to   { transform: translate(20px, -30px) rotate(var(--rot2, 10deg)) scale(1.06); }
  }

  /* ✨ Twinkling stars */
  @keyframes twinkle {
    0%,100% { opacity: 0.15; transform: scale(0.8); }
    40%      { opacity: 1;    transform: scale(1.2); }
    70%      { opacity: 0.5;  transform: scale(0.9); }
  }
  .star-dot {
    position: absolute;
    border-radius: 50%;
    background: white;
    animation: twinkle var(--dur, 3s) ease-in-out infinite var(--delay, 0s);
    opacity: 0.6;
  }

  /* 🌠 Shooting / meteor stars */
  @keyframes meteorFall {
    0%   { transform: translateX(0) translateY(0) rotate(215deg); opacity: 1; }
    70%  { opacity: 0.8; }
    100% { transform: translateX(-800px) translateY(480px) rotate(215deg); opacity: 0; }
  }
  .meteor {
    position: absolute;
    height: 2px;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, white 100%);
    border-radius: 999px;
    animation: meteorFall var(--dur, 8s) linear infinite var(--delay, 0s);
    transform-origin: right center;
    opacity: 0;
  }
  .meteor::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 8px 3px rgba(255,255,255,0.7), 0 0 20px 6px rgba(180,180,255,0.4);
  }

  /* Grid — subtle on dark */
  .study-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 80px 80px;
    transform: perspective(800px) rotateX(20deg) scaleY(1.5) translateY(-5%);
    transform-origin: top center;
    pointer-events: none;
  }
`;

/* =====================================================
   🌠 METEOR SHOWER BACKGROUND
   ===================================================== */
const MeteorBackground = () => {
  // 100 twinkling stars with random positions
  const stars = Array.from({ length: 110 }, (_, i) => ({
    id: i,
    left:  `${Math.random() * 100}%`,
    top:   `${Math.random() * 100}%`,
    size:  Math.random() * 2.5 + 0.5,
    dur:   `${(Math.random() * 4 + 1.5).toFixed(1)}s`,
    delay: `${(Math.random() * -6).toFixed(1)}s`,
    brightness: Math.random() > 0.85 ? '#a5f3fc' : Math.random() > 0.7 ? '#fde68a' : 'white',
  }));

  // 18 shooting stars
  const meteors = [
    { w: 220, left: '80%', top:  '5%',  dur: '7s',  delay: '0s'   },
    { w: 160, left: '92%', top: '18%',  dur: '9s',  delay: '-3s'  },
    { w: 280, left: '70%', top:  '2%',  dur: '11s', delay: '-5s'  },
    { w: 140, left: '88%', top: '35%',  dur: '8s',  delay: '-1s'  },
    { w: 200, left: '75%', top: '10%',  dur: '13s', delay: '-7s'  },
    { w: 180, left: '60%', top:  '0%',  dur: '10s', delay: '-2s'  },
    { w: 120, left: '95%', top: '50%',  dur: '6s',  delay: '-4s'  },
    { w: 250, left: '50%', top:  '3%',  dur: '12s', delay: '-9s'  },
    { w: 170, left: '83%', top: '22%',  dur: '8.5s',delay: '-6s'  },
    { w: 110, left: '65%', top: '42%',  dur: '7.5s',delay: '-11s' },
    { w: 300, left: '40%', top:  '1%',  dur: '14s', delay: '-8s'  },
    { w: 150, left: '97%', top: '15%',  dur: '9.5s',delay: '-13s' },
    { w: 190, left: '55%', top: '30%',  dur: '11s', delay: '-2.5s'},
    { w: 130, left: '30%', top:  '5%',  dur: '8s',  delay: '-15s' },
    { w: 210, left: '77%', top: '60%',  dur: '10s', delay: '-10s' },
    { w: 160, left: '45%', top: '15%',  dur: '7s',  delay: '-4.5s'},
    { w: 240, left: '20%', top:  '8%',  dur: '13s', delay: '-6.5s'},
    { w: 100, left: '35%', top: '25%',  dur: '6.5s',delay: '-12s' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      background: 'linear-gradient(160deg, #020817 0%, #050d24 25%, #0a0f2e 50%, #06091a 75%, #010510 100%)',
    }}>
      {/* Subtle perspective grid */}
      <div className="study-grid" />

      {/* Nebula blobs */}
      <div style={{
        position:'absolute', top:'-20%', left:'-10%', width:900, height:900, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(67,56,202,0.18) 0%, rgba(139,92,246,0.06) 50%, transparent 75%)',
        filter:'blur(60px)',
      }} />
      <div style={{
        position:'absolute', bottom:'-15%', right:'-10%', width:800, height:800, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(15,118,110,0.14) 0%, rgba(6,182,212,0.05) 50%, transparent 75%)',
        filter:'blur(60px)',
      }} />
      <div style={{
        position:'absolute', top:'30%', left:'20%', width:600, height:600, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        filter:'blur(50px)',
      }} />

      {/* ✨ Twinkling stars */}
      {stars.map(s => (
        <div key={`star-${s.id}`} className="star-dot" style={{
          left: s.left, top: s.top,
          width: s.size, height: s.size,
          background: s.brightness,
          boxShadow: s.size > 2 ? `0 0 ${s.size * 3}px ${s.brightness}` : 'none',
          '--dur': s.dur, '--delay': s.delay,
        }} />
      ))}

      {/* 🌠 Shooting stars / meteors */}
      {meteors.map((m, i) => (
        <div key={`meteor-${i}`} className="meteor" style={{
          width: m.w, left: m.left, top: m.top,
          '--dur': m.dur, '--delay': m.delay,
        }} />
      ))}
    </div>
  );
};


/* =====================================================
   SPARKLE DOTS (decorative, animated)
   ===================================================== */
const sparkleColors = ['#fbbf24', '#f472b6', '#818cf8', '#34d399', '#60a5fa', '#fb923c'];
const SparkleParticles = ({ count = 5 }) => (
  <div className="sparkles-container">
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="sparkle"
        style={{
          left: `${15 + i * (70 / count)}%`,
          bottom: '10%',
          background: sparkleColors[i % sparkleColors.length],
          animationDelay: `${i * 0.25}s`,
          animationDuration: `${1.2 + i * 0.15}s`,
          width: 4 + (i % 3) * 2,
          height: 4 + (i % 3) * 2,
        }}
      />
    ))}
  </div>
);

/* =====================================================
   LIGHTNING STORM OVERLAY COMPONENT
   ===================================================== */

// Generates a jagged SVG lightning-bolt path between two points
function makeBoltPath(x1, y1, x2, y2, jaggedness = 8) {
  const points = [[x1, y1]];
  const steps = 10;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const mx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * jaggedness * 2;
    const my = y1 + (y2 - y1) * t + (Math.random() - 0.5) * jaggedness * 0.5;
    points.push([mx, my]);
  }
  points.push([x2, y2]);
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
}

const LightningOverlay = () => {
  const [bolts, setBolts] = useState([]);
  const [flash, setFlash] = useState(false);
  const [streaks, setStreaks] = useState([]);
  const nextId = useRef(0);

  const triggerStrike = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 1-3 bolt branches per strike
    const branches = Math.floor(Math.random() * 3) + 1;
    const newBolts = [];
    const startX = 100 + Math.random() * (vw - 200);

    for (let b = 0; b < branches; b++) {
      const endX = startX + (Math.random() - 0.5) * 220;
      const endY = 200 + Math.random() * (vh * 0.7);
      // Blood-red color scheme: main bolt bright red, branches deep crimson
      const mainColor   = b === 0 ? '#ff3030' : '#cc1010';
      const forkColor   = '#ff6060';
      newBolts.push({
        id: nextId.current++,
        path: makeBoltPath(startX, -10, endX, endY, 8 + b * 5),
        width: vw,
        height: vh,
        color:   mainColor,
        strokeW: b === 0 ? 4 : 2,
        delay: b * 80,
      });
      // child fork
      if (Math.random() > 0.45) {
        const fx = endX + (Math.random() - 0.5) * 150;
        const fy = endY + 80 + Math.random() * 100;
        newBolts.push({
          id: nextId.current++,
          path: makeBoltPath(endX, endY, fx, fy, 5),
          width: vw, height: vh,
          color: forkColor,
          strokeW: 1.5,
          delay: b * 80 + 100,
        });
      }
    }

    setBolts(prev => [...prev, ...newBolts]);
    setFlash(true);

    // Plasma streaks
    const numStreaks = Math.floor(Math.random() * 3) + 1;
    const newStreaks = Array.from({ length: numStreaks }, (_, i) => ({
      id: nextId.current++,
      top: 80 + Math.random() * (vh * 0.7),
      left: Math.random() > 0.5 ? 0 : undefined,
      right: Math.random() > 0.5 ? 0 : undefined,
      bg: `linear-gradient(90deg, #cc0000, #ff3030, #ff6060, transparent)`,
      delay: i * 100,
    }));
    setStreaks(prev => [...prev, ...newStreaks]);

    // Cleanup — slower so bolt is visible longer
    setTimeout(() => setFlash(false), 600);
    setTimeout(() => {
      const ids = new Set(newBolts.map(b => b.id));
      setBolts(prev => prev.filter(b => !ids.has(b.id)));
    }, 1500);
    setTimeout(() => {
      const ids = new Set(newStreaks.map(s => s.id));
      setStreaks(prev => prev.filter(s => !ids.has(s.id)));
    }, 1300);
  }, []);

  useEffect(() => {
    // Initial strike after short delay
    const first = setTimeout(triggerStrike, 1800);

    // Schedule random recurring strikes — slower interval (6-14s)
    let timer;
    const schedule = () => {
      const delay = 6000 + Math.random() * 8000;
      timer = setTimeout(() => {
        triggerStrike();
        // Sometimes double-strike with longer gap
        if (Math.random() > 0.65) {
          setTimeout(triggerStrike, 400 + Math.random() * 400);
        }
        schedule();
      }, delay);
    };
    schedule();

    return () => { clearTimeout(first); clearTimeout(timer); };
  }, [triggerStrike]);

  return (
    <>
      {/* Storm cloud blobs in background */}
      {[
        { id: 'cloud-1', w: 600, h: 300, top: '5%', left: '10%', color: '#6366f1', dur: '22s', delay: '0s' },
        { id: 'cloud-2', w: 500, h: 250, top: '20%', left: '55%', color: '#7c3aed', dur: '17s', delay: '-8s' },
        { id: 'cloud-3', w: 400, h: 200, top: '60%', left: '5%', color: '#4f46e5', dur: '25s', delay: '-14s' },
        { id: 'cloud-4', w: 350, h: 180, top: '70%', left: '70%', color: '#6d28d9', dur: '20s', delay: '-5s' },
      ].map((c) => (
        <div
          key={c.id}
          className="storm-cloud"
          style={{
            width: c.w, height: c.h,
            top: c.top, left: c.left,
            background: c.color,
            '--cloud-dur': c.dur,
            animationDelay: c.delay,
          }}
        />
      ))}

      {/* Screen flash */}
      {flash && <div className="lightning-flash" />}

      {/* SVG Bolts */}
      {bolts.map(bolt => (
        <svg
          key={bolt.id}
          className="lightning-bolt-wrap"
          width={bolt.width}
          height={bolt.height}
          style={{ left: 0, animationDelay: `${bolt.delay}ms` }}
        >
          {/* Glow layer — thick red aura */}
          <path
            d={bolt.path}
            stroke={bolt.color}
            strokeWidth={bolt.strokeW * 8}
            fill="none"
            strokeLinecap="round"
            opacity={0.35}
            style={{ filter: 'blur(6px)' }}
          />
          {/* Outer glow — deep crimson halo */}
          <path
            d={bolt.path}
            stroke="#7f0000"
            strokeWidth={bolt.strokeW * 14}
            fill="none"
            strokeLinecap="round"
            opacity={0.18}
            style={{ filter: 'blur(12px)' }}
          />
          {/* Core bolt */}
          <path
            d={bolt.path}
            stroke="white"
            strokeWidth={bolt.strokeW * 0.7}
            fill="none"
            strokeLinecap="round"
          />
          {/* Colour layer */}
          <path
            d={bolt.path}
            stroke={bolt.color}
            strokeWidth={bolt.strokeW}
            fill="none"
            strokeLinecap="round"
            opacity={0.9}
          />
        </svg>
      ))}

      {/* Plasma horizontal streaks */}
      {streaks.map(s => (
        <div
          key={s.id}
          className="plasma-streak"
          style={{
            top: s.top,
            left: s.left ?? 'unset',
            right: s.right ?? 'unset',
            background: s.bg,
            animationDelay: `${s.delay}ms`,
          }}
        />
      ))}
    </>
  );
};

/* =====================================================
   KITSUNE MASCOT — 3D Animated Fox
   ===================================================== */
const mascotMessages = [
  '頑張って！ Cố lên nào! 🎌',
  'すごい！ Tuyệt vời! ⭐',
  '毎日練習！ Học mỗi ngày! 🔥',
  'また明日！ Hẹn gặp lại! 👋',
  '上手！ Giỏi lắm! 🏆',
];

/* =====================================================
   MASCOT EVOLUTION SYSTEM
   ===================================================== */

// --- Stage config ---
const EVOLUTION_STAGES = [
  {
    minLevel: 1, maxLevel: 5,
    name: 'Kitsune Con 🐾',
    subtitle: 'Nhóc tì đáng yêu',
    palette: { head: ['#fdba74', '#fb923c', '#ea580c'], body: ['#fb923c', '#c2410c'], belly: ['#fff7ed', '#fed7aa'], tail1: ['#fb923c', '#c2410c'] },
    hasCrown: false, hasHalo: false, tails: 1, scale: 0.82,
    eyeColor: '#1e3a5f', glowColor: '#fb923c',
    auraColor: null,
    badge: '🐾',
  },
  {
    minLevel: 6, maxLevel: 10,
    name: 'Kitsune Nhỏ 🦊',
    subtitle: 'Tiểu hồ đang lớn',
    palette: { head: ['#fca57a', '#f97316', '#dc2626'], body: ['#f97316', '#b91c1c'], belly: ['#fff7ed', '#fed7aa'], tail1: ['#f97316', '#b91c1c'] },
    hasCrown: false, hasHalo: false, hasBandana: true, tails: 1, scale: 0.91,
    eyeColor: '#1e3a5f', glowColor: '#f97316',
    auraColor: null,
    badge: '🦊',
  },
  {
    minLevel: 11, maxLevel: 15,
    name: 'Kitsune Trưởng Thành 👑',
    subtitle: 'Hồ tinh có vương miện',
    palette: { head: ['#fdba74', '#fb923c', '#ea580c'], body: ['#fb923c', '#c2410c'], belly: ['#fff7ed', '#fed7aa'], tail1: ['#fb923c', '#c2410c'] },
    hasCrown: true, hasHalo: false, tails: 1, scale: 1,
    eyeColor: '#1e3a5f', glowColor: '#f97316',
    auraColor: null,
    badge: '👑',
  },
  {
    minLevel: 16, maxLevel: 20,
    name: 'Kitsune Huyền Bí ⚡',
    subtitle: '二尾の狐 — Hồ hai đuôi',
    palette: { head: ['#c084fc', '#a855f7', '#7c3aed'], body: ['#a855f7', '#6d28d9'], belly: ['#faf5ff', '#ede9fe'], tail1: ['#a855f7', '#6d28d9'] },
    hasCrown: true, crownColor: '#7c3aed', hasHalo: false, tails: 2, scale: 1,
    eyeColor: '#7c3aed', eyeGlow: '#c4b5fd', glowColor: '#a855f7',
    auraColor: 'rgba(168,85,247,0.15)',
    badge: '⚡',
  },
  {
    minLevel: 21, maxLevel: 999,
    name: 'Kitsune Thần 🌟',
    subtitle: '九尾の狐 — Cửu Vĩ Hồ Tinh',
    palette: { head: ['#fde68a', '#fbbf24', '#d97706'], body: ['#fbbf24', '#d97706'], belly: ['#fffbeb', '#fef3c7'], tail1: ['#fbbf24', '#d97706'] },
    hasCrown: true, crownColor: '#d97706', hasHalo: true, tails: 3, scale: 1.05,
    eyeColor: '#92400e', eyeGlow: '#fcd34d', glowColor: '#fbbf24',
    auraColor: 'rgba(251,191,36,0.2)',
    badge: '🌟',
  },
];

function getStage(level) {
  return EVOLUTION_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel) || EVOLUTION_STAGES[0];
}

/* ─── Level-Up Burst particle ─── */
const BURST_COLORS = ['#fbbf24', '#f472b6', '#818cf8', '#34d399', '#60a5fa', '#fb923c', '#a78bfa', '#f9a8d4'];

const LevelUpAnimation = ({ show, stage, onDone }) => {
  const [particles, setParticles] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | flash | burst | reveal | done

  useEffect(() => {
    if (!show) { setPhase('idle'); return; }
    setPhase('flash');
    // Generate burst particles
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      angle: (i / 30) * 360,
      dist: 80 + Math.random() * 120,
      color: BURST_COLORS[i % BURST_COLORS.length],
      size: 6 + Math.random() * 8,
      dur: 0.6 + Math.random() * 0.4,
    })));
    const t1 = setTimeout(() => setPhase('burst'), 150);
    const t2 = setTimeout(() => setPhase('reveal'), 500);
    const t3 = setTimeout(() => { setPhase('done'); onDone?.(); }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [show]);

  if (phase === 'idle' || phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      {/* Flash overlay */}
      {phase === 'flash' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.85)',
          animation: 'lightningFlash 0.3s ease-out forwards',
        }} />
      )}

      {/* Burst ring */}
      {(phase === 'burst' || phase === 'reveal') && (
        <div style={{ position: 'relative', width: 1, height: 1 }}>
          {particles.map(p => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.dist;
            const ty = Math.sin(rad) * p.dist;
            return (
              <div key={p.id} style={{
                position: 'absolute',
                width: p.size, height: p.size,
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                transform: `translate(${tx}px, ${ty}px)`,
                animation: `arcFly ${p.dur}s ease-out forwards`,
                '--spark-end': `translate(${tx * 1.6}px, ${ty * 1.6}px) scale(0)`,
              }} />
            );
          })}
        </div>
      )}

      {/* LEVEL UP Text */}
      {phase === 'reveal' && (
        <div style={{
          position: 'absolute',
          textAlign: 'center',
          animation: 'bubblePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <div style={{
            fontSize: 48, fontWeight: 900,
            background: 'linear-gradient(135deg,#fbbf24,#f97316,#ef4444,#a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            lineHeight: 1,
            letterSpacing: '-1px',
            fontFamily: 'Outfit, sans-serif',
          }}>LEVEL UP! 🎉</div>
          {stage && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>{stage.name}</div>
              <div style={{ fontSize: 14, color: '#64748b', fontWeight: 600, marginTop: 4 }}>{stage.subtitle}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── MASCOT BODY: varies by stage ─── */
const KitsuneMascot = ({ level = 12 }) => {
  const stage = getStage(level);
  const [msgIdx, setMsgIdx] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [prevLevel, setPrevLevel] = useState(level);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [evolveKey, setEvolveKey] = useState(0);

  // Detect level-up
  useEffect(() => {
    if (level !== prevLevel) {
      const oldStage = getStage(prevLevel);
      const newStage = getStage(level);
      if (newStage.name !== oldStage.name) {
        // Evolution!
        setShowLevelUp(true);
        setEvolveKey(k => k + 1);
      }
      setPrevLevel(level);
    }
  }, [level, prevLevel]);

  // Speech bubble rotation
  useEffect(() => {
    const id = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % mascotMessages.length);
        setBubbleKey(k => k + 1);
        setShowBubble(true);
      }, 300);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const p = stage.palette;
  const isMysterious = stage.tails >= 2 && stage.tails < 3;
  const isDivine = stage.tails >= 3;
  const hasBandana = !!stage.hasBandana;
  const eyeFill = stage.eyeColor || '#1e3a5f';
  const eyeGlow = stage.eyeGlow || null;
  const crownFill = stage.crownColor || null;
  const svgId = `kit-${evolveKey}`;
  // Cheems fur colours from stage palette
  const furLight = p.head[0];
  const furMid   = p.head[1];
  const furDark  = p.head[2];
  const bellyCol = p.belly[0];


  return (
    <>
      <LevelUpAnimation
        show={showLevelUp}
        stage={showLevelUp ? stage : null}
        onDone={() => setShowLevelUp(false)}
      />

      <div style={{ position: 'relative', width: 250, height: 260, flexShrink: 0, userSelect: 'none' }}>

        {/* Stage label badge */}
        <div style={{
          position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
          background: stage.auraColor ? `linear-gradient(135deg,${stage.glowColor}33,${stage.glowColor}55)` : 'linear-gradient(135deg,#fef3c7,#fde68a)',
          border: `1px solid ${stage.glowColor}55`,
          borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 800,
          color: stage.glowColor, whiteSpace: 'nowrap', zIndex: 10,
          boxShadow: `0 2px 10px ${stage.glowColor}33`,
        }}>
          Lv.{level} · {stage.badge} {stage.name.split(' ').slice(0, 2).join(' ')}
        </div>

        {/* Divine halo ring (stage 5) */}
        {isDivine && (
          <div style={{
            position: 'absolute', top: 28, left: '50%',
            transform: 'translateX(-50%)',
            width: 170, height: 170,
            borderRadius: '50%',
            border: '3px solid transparent',
            background: 'none',
            boxShadow: `0 0 30px ${stage.glowColor}88, 0 0 60px ${stage.glowColor}44`,
            animation: 'legendaryRotate 4s linear infinite',
            backgroundImage: `conic-gradient(${stage.glowColor}, transparent, ${stage.glowColor})`,
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #fff 0)',
            zIndex: 0,
          }} />
        )}

        {/* Aura glow blob behind mascot */}
        {stage.auraColor && (
          <div style={{
            position: 'absolute', inset: 20,
            borderRadius: '50%',
            background: stage.auraColor,
            filter: 'blur(20px)',
            animation: 'cheekPulse 3s ease-in-out infinite',
          }} />
        )}

        {/* Speech Bubble */}
        {showBubble && (
          <div key={bubbleKey} className="kitsune-bubble" style={{
            position: 'absolute', top: 2, right: -14, zIndex: 10,
            background: 'white', border: `2px solid ${stage.glowColor}66`,
            borderRadius: '18px 18px 18px 4px', padding: '7px 12px',
            boxShadow: `0 6px 20px ${stage.glowColor}22`, whiteSpace: 'nowrap',
          }}>
            <span className="kitsune-bubble-text" style={{ fontSize: 11, fontWeight: 700, color: stage.glowColor }}>
              {mascotMessages[msgIdx]}
            </span>
            <div style={{
              position: 'absolute', bottom: -10, left: 10, width: 0, height: 0,
              borderLeft: '8px solid transparent', borderRight: '4px solid transparent',
              borderTop: '10px solid white'
            }} />
          </div>
        )}

        {/* 🐾 CHEEMS LINH THÚ CUTE — chibi chubby dog */}
        <svg key={evolveKey} viewBox="0 0 220 230" width={220 * stage.scale} height={230 * stage.scale}
          className="kitsune-body" style={{ overflow: 'visible', marginTop: 6 }}>

          <defs>
            {/* Warm fur — soft light center */}
            <radialGradient id={`fur-${svgId}`} cx="40%" cy="32%" r="65%">
              <stop offset="0%"   stopColor={furLight} />
              <stop offset="50%"  stopColor={furMid}   />
              <stop offset="100%" stopColor={furDark}  />
            </radialGradient>
            {/* Soft cream belly */}
            <radialGradient id={`belly-${svgId}`} cx="50%" cy="45%" r="55%">
              <stop offset="0%"   stopColor="#fffbf5" />
              <stop offset="60%"  stopColor={bellyCol} />
              <stop offset="100%" stopColor={p.belly[1]} />
            </radialGradient>
            {/* Ear inner pink */}
            <radialGradient id={`earIn-${svgId}`} cx="50%" cy="55%" r="55%">
              <stop offset="0%"   stopColor="#fed7e2" />
              <stop offset="100%" stopColor="#fda4af" />
            </radialGradient>
            {/* Dark fur patch on top of head */}
            <radialGradient id={`patch-${svgId}`} cx="50%" cy="25%" r="58%">
              <stop offset="0%"   stopColor={furDark} stopOpacity="0.55" />
              <stop offset="100%" stopColor={furDark} stopOpacity="0"    />
            </radialGradient>
            {/* Shield */}
            <linearGradient id={`shield-${svgId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={isDivine ? '#fde68a' : isMysterious ? '#ddd6fe' : '#e2e8f0'} />
              <stop offset="50%"  stopColor={isDivine ? '#fbbf24' : isMysterious ? '#a855f7' : '#94a3b8'} />
              <stop offset="100%" stopColor={isDivine ? '#d97706' : isMysterious ? '#6d28d9' : '#64748b'} />
            </linearGradient>
            {/* Blade */}
            <linearGradient id={`blade-${svgId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#f1f5f9" />
              <stop offset="50%"  stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            {/* Crown */}
            <linearGradient id={`crown-${svgId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={crownFill ? '#f3e8ff' : '#fef3c7'} />
              <stop offset="100%" stopColor={crownFill ? crownFill : '#f59e0b'} />
            </linearGradient>
            {/* Shiny eye highlight */}
            <radialGradient id={`eyeShine-${svgId}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="white" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── GROUND SHADOW ── */}
          <ellipse className="kitsune-shadow" cx="110" cy="226" rx="58" ry="7"
            fill={stage.glowColor} opacity="0.22" />

          {/* ── CUTE TAIL ── */}
          <g className="kitsune-tail" style={{ transformBox:'fill-box', transformOrigin:'168px 170px' }}>
            <ellipse cx="170" cy="172" rx="22" ry="14" fill={`url(#fur-${svgId})`} opacity="0.9" />
            <ellipse cx="182" cy="180" rx="13" ry="8"  fill={bellyCol} opacity="0.7" />
            <ellipse cx="182" cy="180" rx="7"  ry="4"  fill="#fff7ed"  opacity="0.5" />
          </g>
          {isMysterious && (
            <g style={{ transformBox:'fill-box', transformOrigin:'160px 164px', animation:'tailWag 2.2s ease-in-out infinite 0.4s' }}>
              <ellipse cx="162" cy="166" rx="18" ry="11" fill={furMid} opacity="0.7" />
              <ellipse cx="172" cy="173" rx="10" ry="6"  fill={bellyCol} opacity="0.6" />
            </g>
          )}
          {isDivine && (
            <>
              <g style={{ transformBox:'fill-box', transformOrigin:'156px 159px', animation:'tailWag 1.8s ease-in-out infinite 0.8s' }}>
                <ellipse cx="158" cy="161" rx="15" ry="10" fill={furLight} opacity="0.6" />
                <ellipse cx="167" cy="168" rx="9"  ry="5"  fill={bellyCol} opacity="0.5" />
              </g>
              <g style={{ transformBox:'fill-box', transformOrigin:'152px 155px', animation:'tailWag 2.5s ease-in-out infinite 1.2s' }}>
                <ellipse cx="154" cy="157" rx="13" ry="8" fill={furLight} opacity="0.45" />
              </g>
            </>
          )}

          {/* ── STUBBY LEGS (cute round paws) ── */}
          {/* Left leg */}
          <ellipse cx="76"  cy="202" rx="16" ry="12" fill={`url(#fur-${svgId})`} />
          <ellipse cx="76"  cy="210" rx="20" ry="9"  fill={furDark} opacity="0.75" />
          <circle  cx="64"  cy="212" r="5"   fill={furDark} />
          <circle  cx="76"  cy="215" r="5.5" fill={furDark} />
          <circle  cx="88"  cy="212" r="5"   fill={furDark} />
          {/* Right leg */}
          <ellipse cx="144" cy="202" rx="16" ry="12" fill={`url(#fur-${svgId})`} />
          <ellipse cx="144" cy="210" rx="20" ry="9"  fill={furDark} opacity="0.75" />
          <circle  cx="132" cy="212" r="5"   fill={furDark} />
          <circle  cx="144" cy="215" r="5.5" fill={furDark} />
          <circle  cx="156" cy="212" r="5"   fill={furDark} />

          {/* ── CHUBBY BODY ── */}
          <ellipse cx="110" cy="172" rx="66" ry="56" fill={`url(#fur-${svgId})`} />
          {/* Soft belly */}
          <ellipse cx="110" cy="182" rx="38" ry="36" fill={`url(#belly-${svgId})`} opacity="0.82" />

          {/* ── LEFT ARM + KNIFE ── */}
          <g className="kitsune-arm" style={{ transformBox:'fill-box', transformOrigin:'50px 155px' }}>
            {/* Arm */}
            <ellipse cx="50" cy="158" rx="15" ry="10" transform="rotate(35 50 158)"
              fill={`url(#fur-${svgId})`} />
            {/* Round cute paw */}
            <circle cx="34" cy="148" r="12" fill={bellyCol} />
            <circle cx="26" cy="140" r="5"  fill={bellyCol} />
            <circle cx="34" cy="137" r="5"  fill={bellyCol} />
            <circle cx="42" cy="140" r="5"  fill={bellyCol} />
            {/* Chibi knife — cute small */}
            <g transform="translate(18,82) rotate(-22)">
              {/* Handle */}
              <rect x="-4" y="24" width="8"  height="22" rx="3" fill="#334155" />
              <rect x="-3" y="29" width="6"  height="3"  rx="1" fill="#475569" opacity="0.8"/>
              <rect x="-3" y="35" width="6"  height="3"  rx="1" fill="#475569" opacity="0.8"/>
              {/* Guard */}
              <rect x="-7.5" y="22" width="15" height="4" rx="2" fill="#64748b" />
              {/* Blade — shiny */}
              <path d="M -3.5 23 L 0 -8 L 3.5 23 Z" fill={`url(#blade-${svgId})`} />
              {/* Shine */}
              <line x1="1" y1="-7" x2="2.5" y2="20" stroke="white" strokeWidth="1.2" opacity="0.6"
                strokeLinecap="round"/>
              {/* Star sparkle on blade */}
              <text x="0" y="-10" fontSize="6" textAnchor="middle" fill="#fbbf24">✦</text>
            </g>
          </g>

          {/* ── RIGHT ARM + SHIELD ── */}
          <g style={{ transformBox:'fill-box', transformOrigin:'168px 155px' }}>
            {/* Arm */}
            <ellipse cx="168" cy="158" rx="15" ry="10" transform="rotate(-35 168 158)"
              fill={`url(#fur-${svgId})`} />
            {/* Round cute paw */}
            <circle cx="184" cy="148" r="12" fill={bellyCol} />
            {/* Chibi shield — rounded cute */}
            <g transform="translate(190, 104)">
              {/* Shield body — rounder/cuter */}
              <path d="M 0,-34 C 22,-34 26,-20 26,0 Q 26,24 0,38 Q -26,24 -26,0 C -26,-20 -22,-34 0,-34 Z"
                fill={`url(#shield-${svgId})`} />
              {/* Border */}
              <path d="M 0,-34 C 22,-34 26,-20 26,0 Q 26,24 0,38 Q -26,24 -26,0 C -26,-20 -22,-34 0,-34 Z"
                fill="none"
                stroke={isDivine ? '#fbbf24' : isMysterious ? '#c4b5fd' : '#cbd5e1'}
                strokeWidth="2.5" />
              {/* Boss gem */}
              <circle cx="0" cy="0" r="9"  fill={isDivine ? '#fbbf24' : isMysterious ? '#c084fc' : '#e2e8f0'} />
              <circle cx="0" cy="0" r="5.5" fill="white" opacity="0.9" />
              <circle cx="-2" cy="-2" r="2" fill="white" opacity="0.5" />
              {/* Cross lines */}
              <line x1="0" y1="-32" x2="0"  y2="35"  stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
              <line x1="-24" y1="-5" x2="24" y2="-5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
              {/* Top shine */}
              <ellipse cx="-8" cy="-18" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-15)"/>
            </g>
          </g>

          {/* ── BIG ROUND HEAD (chibi ratio — head is large) ── */}
          <circle cx="110" cy="106" r="60" fill={`url(#fur-${svgId})`} />
          {/* Subtle top dark patch */}
          <ellipse cx="108" cy="74" rx="30" ry="26" fill={`url(#patch-${svgId})`} />

          {/* ── FLOPPY EARS (round cute) ── */}
          <g className="kitsune-ear-left"
            style={{ transformBox:'fill-box', transformOrigin:'57px 100px' }}>
            <ellipse cx="57" cy="106" rx="20" ry="28" fill={`url(#fur-${svgId})`} />
            <ellipse cx="57" cy="109" rx="12" ry="18" fill={`url(#earIn-${svgId})`} opacity="0.6" />
          </g>
          <g className="kitsune-ear-right"
            style={{ transformBox:'fill-box', transformOrigin:'163px 100px' }}>
            <ellipse cx="163" cy="106" rx="20" ry="28" fill={`url(#fur-${svgId})`} />
            <ellipse cx="163" cy="109" rx="12" ry="18" fill={`url(#earIn-${svgId})`} opacity="0.6" />
          </g>

          {/* ── BANDANA stage 2 ── */}
          {hasBandana && (
            <>
              <rect x="68" y="122" width="84" height="10" rx="5" fill="#ef4444" opacity="0.92"/>
              <polygon points="152,127 167,120 152,134" fill="#ef4444" opacity="0.92"/>
              <rect x="68" y="122" width="84" height="4"  rx="2" fill="#fca5a5" opacity="0.4"/>
            </>
          )}

          {/* ── FACE ── */}
          {/* Muzzle — round soft snout */}
          <ellipse cx="110" cy="120" rx="26" ry="19" fill={`url(#belly-${svgId})`} opacity="0.92" />
          <ellipse cx="110" cy="126" rx="20" ry="13" fill="#fffbf5" opacity="0.6" />

          {/* Big puffy cheeks */}
          <ellipse className="kitsune-cheek" cx="78"  cy="114" rx="15" ry="11" fill="#fda4af" opacity="0.6" />
          <ellipse className="kitsune-cheek" cx="142" cy="114" rx="15" ry="11" fill="#fda4af" opacity="0.6" />

          {/* ── BIG ANIME EYES (the KEY to cuteness!) ── */}
          {[{ cx: 92, side: 'left' }, { cx: 128, side: 'right' }].map(({ cx: ex, side }) => (
            <g key={`eye-${side}`} className="kitsune-eye"
              style={{ transformBox:'fill-box', transformOrigin:`${ex}px 104px` }}>
              {/* Outer white — big oval */}
              <ellipse cx={ex} cy="106" rx="14" ry="15" fill="white" />
              {/* Colour iris */}
              <ellipse cx={ex} cy="108" rx="11" ry="12" fill={eyeFill} />
              {eyeGlow && <ellipse cx={ex} cy="108" rx="11" ry="12" fill={eyeGlow} opacity="0.25" />}
              {/* Pupil — large for cuteness */}
              <ellipse cx={ex} cy="109" rx="7.5" ry="8.5" fill="#0c1220" />
              {eyeGlow && <ellipse cx={ex} cy="109" rx="5" ry="6" fill={eyeGlow} opacity="0.4" />}
              {/* Shine 1 — large top-left */}
              <circle cx={ex - 3} cy="100" r="4.5" fill="white" opacity="0.95" />
              {/* Shine 2 — small bottom-right */}
              <circle cx={ex + 5} cy="112" r="2"   fill="white" opacity="0.75" />
              {/* Shine 3 — tiny top-right */}
              <circle cx={ex + 6} cy="100" r="1.5" fill="white" opacity="0.6"  />
              {/* Soft eyelid top shadow — gentle (not droopy, more awake/cute) */}
              <path d={`M ${ex-14} 101 Q ${ex} 94 ${ex+14} 101`}
                stroke={furDark} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.3" />
              {/* Bottom lash curve */}
              <path d={`M ${ex-12} 118 Q ${ex} 122 ${ex+12} 118`}
                stroke={furDark} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.3" />
            </g>
          ))}

          {/* ── NOSE — cute small button nose ── */}
          <ellipse cx="110" cy="118" rx="6.5" ry="4.5" fill="#1e293b" />
          <ellipse cx="108" cy="116.5" rx="2.5" ry="1.5" fill="white" opacity="0.35" />

          {/* ── HAPPY MOUTH ── */}
          <path d="M 100 125 Q 110 135 120 125"
            stroke={furDark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Tongue (baby / common stages) */}
          {!isMysterious && !isDivine && (
            <>
              <ellipse cx="110" cy="133" rx="6.5" ry="5" fill="#fb7185" />
              <ellipse cx="110" cy="131" rx="6.5" ry="2" fill="#fda4af" opacity="0.6" />
            </>
          )}

          {/* ── FOREHEAD RUNE (high stages) ── */}
          {(isMysterious || isDivine) && (
            <polygon points="110,64 116,75 110,86 104,75"
              fill={isDivine ? '#fbbf24' : '#c084fc'} opacity="0.92" />
          )}

          {/* ── CROWN ── */}
          {stage.hasCrown && (
            <g transform="translate(85, 48)">
              <polygon points="0,14 4,0 9,9 14,2 19,11 24,0 28,14"
                fill={`url(#crown-${svgId})`}
                stroke={crownFill || '#d97706'} strokeWidth="1" />
              <circle cx="4"  cy="14" r="3" fill={crownFill ? '#e9d5ff' : '#fde68a'} />
              <circle cx="14" cy="14" r="3" fill={crownFill ? '#e9d5ff' : '#fde68a'} />
              <circle cx="24" cy="14" r="3" fill={crownFill ? '#e9d5ff' : '#fde68a'} />
              <rect x="0" y="14" width="28" height="6" rx="2"
                fill={crownFill || '#f59e0b'} opacity="0.9" />
            </g>
          )}

          {/* ── DIVINE HALO ── */}
          {isDivine && (
            <ellipse cx="110" cy="48" rx="30" ry="9"
              fill="none" stroke={stage.glowColor} strokeWidth="3.5"
              opacity="0.8" style={{ animation: 'epicPulse 2s ease-in-out infinite' }} />
          )}

          {/* Orbiting stars */}
          <g className="kitsune-star"><text x="-6" y="4" fontSize="12" textAnchor="middle">✦</text></g>
          <g className="kitsune-star-2"><text x="-5" y="4" fontSize="9"  textAnchor="middle">✧</text></g>
          {isDivine && (
            <g style={{ animation:'starOrbit 12s linear infinite 0.5s', transformOrigin:'110px 110px' }}>
              <text x="-6" y="4" fontSize="13" textAnchor="middle">⭐</text>
            </g>
          )}
        </svg>
      </div>
    </>
  );
};



/* =====================================================
   RARITY CONFIG
   ===================================================== */
const rarityConfig = {
  common: {
    icon: { bg: 'linear-gradient(135deg,#e2e8f0,#f1f5f9)', color: '#475569', shadow: '0 4px 15px rgba(71,85,105,0.2)' },
    card: { bg: 'linear-gradient(145deg,#ffffff,#f8fafc)', border: '#e2e8f0' },
    bar: 'linear-gradient(90deg,#94a3b8,#64748b)',
    ring: null,
    label: 'COMMON',
    sparkle: 3,
  },
  rare: {
    icon: { bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#2563eb', shadow: '0 4px 20px rgba(59,130,246,0.35)' },
    card: { bg: 'linear-gradient(145deg,#ffffff,#eff6ff)', border: '#bfdbfe' },
    bar: 'linear-gradient(90deg,#60a5fa,#2563eb)',
    ring: 'rare',
    label: 'RARE',
    sparkle: 5,
  },
  epic: {
    icon: { bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', color: '#7c3aed', shadow: '0 4px 20px rgba(168,85,247,0.4)' },
    card: { bg: 'linear-gradient(145deg,#faf5ff,#f3e8ff)', border: '#c4b5fd' },
    bar: 'linear-gradient(90deg,#a78bfa,#7c3aed)',
    ring: 'epic',
    label: 'EPIC',
    sparkle: 7,
  },
  legendary: {
    icon: { bg: 'linear-gradient(135deg,#fef3c7,#fde68a,#fcd34d)', color: '#92400e', shadow: '0 6px 25px rgba(251,191,36,0.55)' },
    card: { bg: 'linear-gradient(145deg,#fffbeb,#fef3c7)', border: '#fcd34d' },
    bar: 'linear-gradient(90deg,#fbbf24,#f59e0b,#d97706)',
    ring: 'legendary',
    label: '✦ LEGENDARY',
    sparkle: 9,
  },
};

/* =====================================================
   ACHIEVEMENT BADGE CARD (3D + animated)
   ===================================================== */
const AchievementCard = ({ title, desc, icon: Icon, iconEmoji, progress, total, isUnlocked, rarity }) => {
  const percent = Math.min(100, Math.round((progress / total) * 100));
  const cfg = rarityConfig[rarity] || rarityConfig.common;
  const isLegend = rarity === 'legendary';
  const isEpic = rarity === 'epic';
  const isRare = rarity === 'rare';

  return (
    <div className={`badge-card ${isUnlocked ? `badge-unlocked-${rarity}` : 'badge-locked'} ${isLegend && isUnlocked ? 'legendary-float' : ''}`}>
      <div
        className="badge-card-inner shine-wrap"
        style={{
          background: cfg.card.bg,
          border: `1.5px solid ${cfg.card.border}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '200px',
          position: 'relative',
        }}
      >
        {/* Sparkle particles on hover (always render; opacity 0 by default) */}
        {isUnlocked && <SparkleParticles count={cfg.sparkle} />}

        {/* Rarity ring behind icon */}
        <div className="flex justify-between items-start mb-4" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            {/* Animated ring */}
            {isUnlocked && rarity === 'legendary' && <div className="legendary-ring" />}
            {isUnlocked && rarity === 'epic' && <div className="epic-pulse" />}
            {isUnlocked && rarity === 'rare' && <div className="rare-shimmer" />}

            {/* Icon box */}
            <div
              className="badge-icon-3d"
              style={{
                width: 56, height: 56,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isUnlocked ? cfg.icon.bg : 'linear-gradient(135deg,#e2e8f0,#f1f5f9)',
                boxShadow: isUnlocked ? cfg.icon.shadow : 'none',
                position: 'relative', zIndex: 1,
              }}
            >
              {isUnlocked
                ? (iconEmoji
                  ? <span style={{ fontSize: 28 }}>{iconEmoji}</span>
                  : <Icon size={26} style={{ color: cfg.icon.color }} strokeWidth={1.8} />
                )
                : <Lock size={22} color="#94a3b8" />
              }
            </div>
          </div>

          {/* Rarity pill */}
          {isUnlocked && (
            <span
              className={`rarity-pill-${rarity}`}
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '0.08em',
                padding: '3px 8px',
                borderRadius: 999,
              }}
            >
              {cfg.label}
            </span>
          )}
        </div>

        {/* Text */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1e293b', marginBottom: 4 }}>{title}</h3>
          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 14 }}>{desc}</p>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: isUnlocked ? '#059669' : '#94a3b8' }}>{progress}/{total}</span>
            <span style={{ color: '#94a3b8' }}>{percent}%</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 999, height: 7, overflow: 'hidden' }}>
            <div
              className="progress-bar-anim"
              style={{
                height: '100%',
                width: `${percent}%`,
                background: isUnlocked ? cfg.bar : '#cbd5e1',
                borderRadius: 999,
                boxShadow: isUnlocked ? `0 0 8px ${rarity === 'legendary' ? '#fbbf24' : rarity === 'epic' ? '#a78bfa' : rarity === 'rare' ? '#60a5fa' : 'transparent'}` : 'none',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   STAT CARD
   ===================================================== */
const StatCard = ({ icon: Icon, label, value, subtext, gradient, textColor, isStreak }) => (
  <div
    className="stat-card-hover"
    style={{
      background: gradient,
      borderRadius: 20,
      padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(255,255,255,0.6)',
    }}
  >
    <div style={{ fontSize: 32, lineHeight: 1 }} className={isStreak ? 'streak-fire' : ''}>
      {isStreak ? '🔥' : typeof Icon === 'string' ? Icon : <Icon size={28} color={textColor} strokeWidth={1.8} />}
    </div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#1e293b', lineHeight: 1.1 }}>{value}</div>
      {subtext && <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 2 }}>{subtext}</div>}
    </div>
  </div>
);

/* =====================================================
   MAIN PAGE
   ===================================================== */
export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [userStats, setUserStats] = useState({
    level: 1, currentXP: 0, nextLevelXP: 1000, streak: 0, totalBadges: 0,
    fullName: 'Học viên', imageUrl: null, createdAt: null,
  });
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu thật từ DB khi trang load
  useEffect(() => {
    getMe()
      .then(res => {
        const d = res.data.data;
        setUserStats({
          level:       d.level       ?? 1,
          currentXP:   d.currentXp   ?? 0,
          nextLevelXP: d.nextLevelXp ?? 1000,
          streak:      d.streak      ?? 0,
          totalBadges: d.totalBadges ?? 0,
          fullName:    d.fullName    ?? 'Học viên',
          imageUrl:    d.imageUrl    ?? null,
          createdAt:   d.createdAt   ?? null,
        });
      })
      .catch(() => {
        // API chưa ready: giữ giá trị mặc định
      })
      .finally(() => setLoading(false));
  }, []);

  const achievements = [
    {
      id: 1, title: 'Khởi đầu nan', desc: 'Hoàn thành bài học đầu tiên của bạn.',
      icon: CheckCircle2, iconEmoji: '🐣', progress: 1, total: 1, isUnlocked: true, rarity: 'common',
    },
    {
      id: 2, title: 'Học giả chăm chỉ', desc: 'Duy trì chuỗi học tập (Streak) trong 7 ngày liên tiếp.',
      icon: Zap, iconEmoji: '⚡', progress: 7, total: 7, isUnlocked: true, rarity: 'rare',
    },
    {
      id: 3, title: 'Bậc thầy Kanji', desc: 'Học thuộc 100 chữ Kanji N5.',
      icon: Award, iconEmoji: '🀄', progress: 85, total: 100, isUnlocked: false, rarity: 'epic',
    },
    {
      id: 4, title: 'Thần đồng ngữ pháp', desc: 'Đạt điểm tuyệt đối trong 5 bài kiểm tra ngữ pháp.',
      icon: Star, iconEmoji: '🌟', progress: 3, total: 5, isUnlocked: false, rarity: 'legendary',
    },
    {
      id: 5, title: 'Cú đêm', desc: 'Hoàn thành một bài học sau 10 giờ tối.',
      icon: Calendar, iconEmoji: '🦉', progress: 1, total: 1, isUnlocked: true, rarity: 'common',
    },
    {
      id: 6, title: 'Nhà giao tiếp', desc: 'Thực hành hội thoại với AI trong 30 phút.',
      icon: Trophy, iconEmoji: '💬', progress: 10, total: 30, isUnlocked: false, rarity: 'rare',
    },
    {
      id: 7, title: 'Chiến binh tốc độ', desc: 'Hoàn thành bài kiểm tra trong 60 giây.',
      icon: Zap, iconEmoji: '🏎️', progress: 1, total: 1, isUnlocked: true, rarity: 'epic',
    },
    {
      id: 8, title: 'Vua từ vựng', desc: 'Học 500 từ vựng Tiếng Nhật.',
      icon: Crown, iconEmoji: '👑', progress: 320, total: 500, isUnlocked: false, rarity: 'legendary',
    },
  ];

  const filteredAchievements = activeTab === 'all'
    ? achievements
    : activeTab === 'unlocked'
      ? achievements.filter(a => a.isUnlocked)
      : achievements.filter(a => !a.isUnlocked);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: achievements.length },
    { id: 'unlocked', label: '✅ Đã đạt', count: achievements.filter(a => a.isUnlocked).length },
    { id: 'locked', label: '🔒 Chưa đạt', count: achievements.filter(a => !a.isUnlocked).length },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* ⚡ GLOBAL LIGHTNING STORM OVERLAY */}
      <LightningOverlay />

      {/* 🌠 METEOR SHOWER BACKGROUND */}
      <MeteorBackground />

      <div className="achievements-page min-h-screen pb-20" style={{
        background: 'transparent',
        position: 'relative', zIndex: 1,
      }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          background: 'rgba(5,12,36,0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderBottom: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'center' }}>

              {/* ── KITSUNE MASCOT (evolution-aware) ── */}
              <KitsuneMascot level={userStats.level} />

              {/* Level-Up Demo Controls */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0,
                background: 'rgba(255,255,255,0.07)', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.12)', padding: '12px 14px',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  🎮 Các Cấp Bậc Linh Thú
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[1, 6, 11, 16, 21].map(lv => (
                    <button
                      key={lv}
                      onClick={() => setUserStats(prev => ({ ...prev, level: lv }))}
                      style={{
                        padding: '5px 10px', borderRadius: 8, border: 'none',
                        fontSize: 11, fontWeight: 800, cursor: 'pointer',
                        background: userStats.level >= lv && userStats.level < lv + 5
                          ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                          : '#f1f5f9',
                        color: userStats.level >= lv && userStats.level < lv + 5 ? 'white' : '#64748b',
                        boxShadow: userStats.level >= lv && userStats.level < lv + 5 ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      Lv.{lv}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  {getStage(userStats.level).badge} {getStage(userStats.level).subtitle}
                </div>
              </div>

              {/* Avatar with animated ring */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: -4,
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg,#10b981,#3b82f6,#a855f7,#f59e0b,#10b981)',
                  animation: 'legendaryRotate 4s linear infinite',
                  filter: 'blur(1px)',
                }} />
                <div style={{
                  width: 110, height: 110, borderRadius: '50%',
                  border: '4px solid white',
                  overflow: 'hidden', position: 'relative', zIndex: 1,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                }}>
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="User"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {/* Level badge */}
                <div style={{
                  position: 'absolute', bottom: -4, right: -4, zIndex: 2,
                  background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
                  color: 'white', fontWeight: 900, fontSize: 12,
                  padding: '4px 10px', borderRadius: 999,
                  boxShadow: '0 4px 15px rgba(245,158,11,0.5)',
                  border: '2px solid white',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Crown size={12} fill="currentColor" /> Lv.{userStats.level}
                </div>
              </div>

              {/* Info + XP */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 4 }}>Minh Hoang</h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 16 }}>Học viên tích cực • Tham gia từ 2023</p>

                {/* XP Bar */}
                <div style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 16, padding: '14px 18px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: '#34d399' }}>Level {userStats.level}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{userStats.currentXP.toLocaleString()} / {userStats.nextLevelXP.toLocaleString()} XP</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                    <div
                      className="xp-bar-fill progress-bar-anim"
                      style={{
                        height: '100%',
                        width: `${(userStats.currentXP / userStats.nextLevelXP) * 100}%`,
                        background: 'linear-gradient(90deg,#10b981,#059669,#047857)',
                        borderRadius: 999,
                        boxShadow: '0 0 15px rgba(16,185,129,0.6)',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6, textAlign: 'right', fontWeight: 600 }}>
                    Còn {(userStats.nextLevelXP - userStats.currentXP).toLocaleString()} XP nữa để lên cấp ⬆️
                  </div>
                </div>
              </div>

              {/* Share btn */}
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 22px',
                background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                cursor: 'pointer', fontSize: 14,
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Share2 size={17} /> Chia sẻ hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

          {/* ── STATS ROW ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 36 }}>
            <StatCard
              isStreak
              label="Chuỗi ngày (Streak)"
              value={userStats.streak}
              subtext="🏆 Kỷ lục cá nhân!"
              gradient="linear-gradient(135deg,#fff7ed,#ffedd5)"
            />
            <StatCard
              icon="⚡"
              label="Tổng điểm XP"
              value={userStats.currentXP.toLocaleString()}
              subtext="+120 hôm nay"
              gradient="linear-gradient(135deg,#eff6ff,#dbeafe)"
            />
            <StatCard
              icon="🏅"
              label="Huy hiệu"
              value={`${userStats.totalBadges}`}
              subtext="Đã mở khoá"
              gradient="linear-gradient(135deg,#faf5ff,#ede9fe)"
            />
            <StatCard
              icon="📈"
              label="Hạng tuần"
              value="#5"
              subtext="Top 1% học viên"
              gradient="linear-gradient(135deg,#f0fdf4,#dcfce7)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

            {/* ── LEFT: BADGE COLLECTION ── */}
            <div>
              {/* Section header + tabs */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>🏆</span> Bộ sưu tập huy hiệu
                </h2>

                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', padding: 4, borderRadius: 14, gap: 4, border: '1px solid rgba(255,255,255,0.12)' }}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: '6px 14px', borderRadius: 10,
                        fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                        transition: 'all 0.25s',
                        background: activeTab === tab.id
                          ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                          : 'transparent',
                        color: activeTab === tab.id ? 'white' : '#64748b',
                        boxShadow: activeTab === tab.id ? '0 4px 15px rgba(99,102,241,0.35)' : 'none',
                      }}
                    >
                      {tab.label}
                      <span style={{
                        marginLeft: 6, fontSize: 10,
                        background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                        color: activeTab === tab.id ? 'white' : '#64748b',
                        padding: '1px 6px', borderRadius: 999, fontWeight: 800,
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                {filteredAchievements.map(a => (
                  <AchievementCard key={a.id} {...a} />
                ))}
              </div>
            </div>

            {/* ── RIGHT: SIDEBAR ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Daily Quests */}
              <div style={{
                background: 'rgba(255,255,255,0.9)', borderRadius: 20,
                border: '1px solid #e2e8f0', padding: '22px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
              }}>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📅 Nhiệm vụ ngày
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { task: 'Hoàn thành 1 bài học', done: true, xp: 50, emoji: '📖' },
                    { task: 'Đạt 90% bài kiểm tra', done: false, xp: 100, emoji: '✍️' },
                    { task: 'Học 5 từ vựng mới', done: false, xp: 30, emoji: '💡' },
                  ].map((q, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 12,
                      background: q.done ? 'linear-gradient(135deg,#f0fdf4,#dcfce7)' : '#f8fafc',
                      border: `1px solid ${q.done ? '#bbf7d0' : '#f1f5f9'}`,
                    }}>
                      <span style={{ fontSize: 18 }}>{q.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: q.done ? '#94a3b8' : '#334155', textDecoration: q.done ? 'line-through' : 'none' }}>
                          {q.task}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
                        color: '#92400e', padding: '3px 8px', borderRadius: 8,
                      }}>+{q.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div style={{
                background: 'linear-gradient(145deg,#1e1b4b,#312e81,#3730a3)',
                borderRadius: 20, padding: '22px',
                boxShadow: '0 8px 40px rgba(49,46,129,0.4)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Deco blobs */}
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(139,92,246,0.3)', filter: 'blur(30px)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(99,102,241,0.25)', filter: 'blur(25px)' }} />

                <h3 style={{ color: 'white', fontWeight: 800, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                  🏆 Bảng xếp hạng tuần
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
                  {[
                    { name: 'Sarah N.', xp: 3200, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', rankClass: 'rank-gold' },
                    { name: 'Tuan Minh', xp: 2950, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan', rankClass: 'rank-silver' },
                    { name: 'Jessica', xp: 2800, rank: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jess', rankClass: 'rank-bronze' },
                  ].map(u => (
                    <div key={u.rank} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'rgba(255,255,255,0.1)', padding: '8px 10px',
                      borderRadius: 12, backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}>
                      <div className={u.rankClass} style={{
                        width: 26, height: 26, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 900, flexShrink: 0,
                      }}>
                        {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'}
                      </div>
                      <img src={u.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', background: 'white', flexShrink: 0 }} />
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                      <div style={{
                        fontSize: 11, fontWeight: 800, color: '#c7d2fe',
                        background: 'rgba(99,102,241,0.3)', padding: '3px 8px', borderRadius: 8,
                        flexShrink: 0,
                      }}>{u.xp.toLocaleString()} XP</div>
                    </div>
                  ))}

                  <div style={{
                    marginTop: 8, paddingTop: 12,
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                    textAlign: 'center', fontSize: 12, color: '#a5b4fc',
                    fontWeight: 600,
                  }}>
                    Bạn đang xếp thứ <span style={{ color: 'white', fontWeight: 900, fontSize: 15 }}>#5</span> 🎯 Cố lên nào!
                  </div>
                </div>
              </div>

              {/* Motivational tip */}
              <div style={{
                background: 'linear-gradient(135deg,#fef3c7,#fde68a)',
                borderRadius: 20, padding: '18px 20px',
                border: '1px solid #fcd34d',
                boxShadow: '0 4px 20px rgba(251,191,36,0.2)',
              }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>💪</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#92400e', marginBottom: 4 }}>Mẹo hôm nay</div>
                <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
                  Học đều đặn mỗi ngày 15 phút hiệu quả hơn 2 tiếng cuối tuần. Chuỗi ngày của bạn đang rất tốt! 🔥
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}