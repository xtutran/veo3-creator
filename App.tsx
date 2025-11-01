import React, { useMemo, useState, useCallback } from "react";
import type { Settings } from "./types";
import { chunkWordsToClips } from "./utils/scriptUtils";
import { buildVeoCommand } from "./services/commandBuilder";
import { Field } from "./components/Field";
import { TextInput } from "./components/TextInput";
import { TextArea } from "./components/TextArea";

export default function App() {
  const [script, setScript] = useState("");
  const [settings, setSettings] = useState<Settings>({
    aspect: "16:9",
    quality: "1080p",
    
    // OPTIMIZED VISUAL STYLE FOR SENIORS
    style: "professional medical setting, soft diffused key light from 45-degree angle, minimal depth of field with blurred clinical background (shelves with medical books and certificates), natural warm skin tones with high saturation, clean modern aesthetic, subtle texture without grain, HIGH CONTRAST for visibility (dark text on light backgrounds), stable smooth camera movements only, no handheld shaking, soft vignette to focus attention, warm color temperature 5000K",
    
    // ULTRA-DETAILED DOCTOR CHARACTER (VEO3 Best Practices)
    characterName: "Dr. Robert Mitchell",
    characterLock: `Male, 55 years old exactly, Caucasian American ethnicity. FACE: fair skin tone (Fitzpatrick Type II) with warm peachy undertones, natural age-appropriate fine lines and crow's feet around eyes (depth 2-3mm), visible forehead wrinkles when raising eyebrows, subtle nasolabial folds, defined square jawline with slight jowl softening natural for age 55, no beard or mustache - completely clean-shaven smooth face, small subtle age spots on temples. EYES: bright blue-gray eyes (iris color #4682B4), rectangular wire-frame reading glasses with silver metal frames and anti-reflective coating positioned mid-bridge of nose, warm engaging direct gaze into camera, expressive thick gray eyebrows that lift naturally when emphasizing important points. HAIR: salt-and-pepper hair in 70% silver-gray / 30% dark brown ratio, short professional businessman cut 2-3 inches on top with neat side part on left, sides trimmed to 1 inch, slight wave texture, well-groomed and styled with light product, hairline slightly receded at temples (Norwood Type II). BUILD: athletic fit physique, 5 feet 11 inches tall (180cm), approximately 175 pounds (79kg), upright confident posture with shoulders back, medium frame with visible muscle definition suggesting regular exercise routine. CLOTHING: pristine white medical laboratory coat (knee-length 40 inches, tailored European fit, 100% cotton, pressed with sharp creases), left chest embroidered with "Dr. R. Mitchell, MD" in navy blue thread (12pt font), "Health & Nutrition Specialist" embroidered below in 10pt font, underneath wearing light blue Oxford button-down dress shirt (no tie, top button undone for approachable look), dark navy blue dress slacks with belt. ACCESSORIES: professional hospital ID badge clipped to left coat pocket showing photo and credentials, classic silver analog wristwatch on left wrist (thin band, white face, Roman numerals), simple gold wedding band on left ring finger, black leather dress shoes. MANNERISMS: warm genuine smile revealing straight white teeth, natural hand gestures when explaining (palms up for openness, pointing index finger for emphasis), occasional head tilts showing empathy and active listening, slight forward lean when delivering important information showing engagement. OVERALL IMPRESSION: trustworthy experienced healthcare provider with 25+ years clinical practice appearance, combines professional medical authority with warm approachable bedside manner, radiates competence and compassion simultaneously`,
    
    // FIXED VOICE WITH EXACT GOOGLE VOICE ID - NO TTS GENERATION
    voiceNote: `CRITICAL: VEO3 must use NATIVE AUDIO generation only. DO NOT use external TTS. Generate voice with these exact parameters: Male voice, mature professional tone, 55-year-old American physician quality. Voice characteristics: calm, reassuring, trustworthy, warm fatherly authoritative tone suggesting 25+ years medical experience. Accent: Standard American English with neutral General American accent (no regional markers, Midwest broadcast quality). PACE: SLOW at 110-120 words per minute (significantly slower than normal 150 wpm for senior comprehension). Enunciation: excellent clear articulation with slight emphasis on medical/health terminology. Natural pauses: insert 0.7-1.0 second pauses after important health facts, 0.5 second pauses after questions, 1.5 second pauses before major topic transitions. Delivery style: steady measured cadence without rushing, professional yet conversational like a caring family doctor explaining diagnosis to elderly patient, slight pitch uptick (+10% fundamental frequency) for encouragement and emphasis on positive health outcomes. Emotional tone: compassionate, patient, never condescending, builds trust through vocal warmth. Vocal quality: clear resonant voice without breathiness, slight chest voice for authority, warm smile audible in voice. Reference voice style: similar to "Sadaltager" (knowledgeable) or "Achird" (friendly) or "Charon" (informative) from Gemini TTS voice library but generated natively by VEO3`,
    
    // OPTIMIZED AUDIO MIX FOR SENIOR HEARING
    musicMood: "gentle solo piano with very soft acoustic cello accompaniment, warm and hopeful emotional tone without being distracting, extremely subtle at -20dB under dialogue (NOT -18dB), very slow tempo 55-65 BPM, simple melodic lines in major keys (C major or G major for warmth), no sudden dynamic changes or jarring chord progressions, smooth legato playing style, calming reassuring atmosphere that reduces anxiety, fade in slowly over 3 seconds at clip start, fade out over 2 seconds at clip end, maintain consistent volume throughout",
    
    // MINIMAL CLEAR SFX FOR SENIOR CLARITY  
    sfxPack: "absolutely minimal sound effects prioritizing dialogue clarity above all. ONLY use: (1) gentle page turn sound at -16dB for major section transitions (occurring max once per 8s clip if needed), (2) very subtle light whoosh at -18dB for smooth scene changes (short 0.3s duration), (3) soft warm riser at -17dB ONLY before the 6 main hooks to create anticipation (1.5s duration, frequency range 80-200Hz for non-startling bass), (4) NO other SFX - no pops, clicks, hits, or jarring sounds that might startle elderly viewers. ALL effects must be warm analog quality not digital/synthetic. Keep all SFX at least -15dB below dialogue. ABSOLUTE PRIORITY: voice intelligibility and clarity - if any SFX interferes with dialogue comprehension, remove it completely. Senior hearing loss is typically in 2000-8000Hz range so avoid high-frequency SFX"
  });

  const clips = useMemo(() => chunkWordsToClips(script), [script]);

  const commands = useMemo(() => {
    if (!clips.length) return "";
    const total = clips.length;
    return clips
      .map((seg, i) => buildVeoCommand(seg, i, total, settings))
      .join("\n\n---\n\n");
  }, [clips, settings]);

  const copyAll = useCallback(async () => {
    if (!commands) return;
    try { 
        await navigator.clipboard.writeText(commands);
        alert("✅ VEO3 Commands copied! Paste into Google AI Studio.\n\n💡 Tip: Review character consistency after first 5 clips before generating all.");
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert("❌ Copy failed. Please try selecting and copying manually.");
    }
  }, [commands]);

  const downloadTxt = useCallback(() => {
    if (!commands) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const blob = new Blob([commands], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veo3_senior_health_dr_mitchell_${timestamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [commands]);

  const applyVoicePreset = (voiceType: string) => {
    const presets: {[key: string]: string} = {
      "sadaltager": `CRITICAL: VEO3 native audio only. Voice style: Sadaltager-like (knowledgeable expert). Male 55yo physician, calm authoritative, warm professional. Pace: 110-120 wpm (slow for seniors). American English, clear enunciation, natural pauses 0.7-1.0s after key points. Fatherly reassuring tone, compassionate never condescending.`,
      "achird": `CRITICAL: VEO3 native audio only. Voice style: Achird-like (friendly approachable). Male 55yo doctor, warm conversational, friendly bedside manner. Pace: 110-120 wpm (slow for seniors). American English, excellent articulation, pauses 0.7-1.0s after important facts. Builds trust through vocal warmth.`,
      "charon": `CRITICAL: VEO3 native audio only. Voice style: Charon-like (informative clear). Male 55yo medical professional, clear educational tone, informative delivery. Pace: 110-120 wpm (slow for seniors). American English, precise enunciation, pauses 0.7-1.0s after health terminology. Professional yet accessible.`
    };
    setSettings({...settings, voiceNote: presets[voiceType]});
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="p-4 border-b border-gray-800 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white">
            🏥 VEO3 Senior Health Video Builder 
            <span className="text-sm font-normal text-cyan-400 ml-2">
              (Dr. Mitchell · 110-120 WPM · Native Audio)
            </span>
          </h1>
          <div className="text-xs text-gray-400">
            Optimized: High Contrast · Slow Pace · Clear Audio
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div className="flex flex-col gap-4">
          
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">📋</span>
              <div>
                <h3 className="font-semibold text-blue-300 mb-2">
                  VEO3 Senior Health Optimization
                </h3>
                <ul className="text-xs text-blue-200 space-y-1 list-disc list-inside">
                  <li><strong>Voice:</strong> Native VEO3 audio (NO external TTS)</li>
                  <li><strong>Pace:</strong> 110-120 WPM (vs standard 150 WPM)</li>
                  <li><strong>Character:</strong> Dr. Robert Mitchell, 55yo trusted physician</li>
                  <li><strong>Pauses:</strong> 0.7-1.0s after key health facts</li>
                  <li><strong>Visuals:</strong> High contrast, stable camera, no dizzy movements</li>
                  <li><strong>Audio:</strong> Music at -20dB, minimal SFX, dialogue priority</li>
                </ul>
              </div>
            </div>
          </div>

          <Field label="English Health Script for Seniors">
            <TextArea
              value={script}
              onChange={setScript}
              rows={12}
              placeholder={`Paste your senior health script here. At 110-120 WPM pace, each 8s clip = ~14-16 words (NOT 20 words).

Example opening:
"Hello friends. Are you finding it harder to keep up with your grandkids? Let's talk about simple ways to boost your energy."

The app will auto-split into 8-second clips with proper pacing for older adults.`}
            />
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <div>💡 <strong>Tip:</strong> Use simple short sentences. Avoid medical jargon.</div>
              <div>⏱️ <strong>Pacing:</strong> ~15 words per 8s clip (slower for comprehension)</div>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Aspect Ratio">
              <select
                value={settings.aspect}
                onChange={(e) => setSettings({ ...settings, aspect: e.target.value as Settings["aspect"] })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="16:9">16:9 Widescreen (Best for YouTube)</option>
                <option value="9:16">9:16 Vertical (Mobile/TikTok)</option>
                <option value="1:1">1:1 Square (Facebook/Instagram)</option>
              </select>
            </Field>
            <Field label="Quality">
              <select
                value={settings.quality}
                onChange={(e) => setSettings({ ...settings, quality: e.target.value as Settings["quality"] })}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1080p">1080p Full HD (Recommended)</option>
                <option value="720p">720p HD (Faster processing)</option>
              </select>
            </Field>
          </div>
          
          <Field label="Voice Preset (Google Gemini TTS Reference Style)">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                onClick={() => applyVoicePreset("sadaltager")}
                className="px-3 py-2 text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-md transition-all font-medium"
              >
                🎓 Sadaltager<br/><span className="text-[10px] opacity-80">(Knowledgeable)</span>
              </button>
              <button
                onClick={() => applyVoicePreset("achird")}
                className="px-3 py-2 text-xs bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-md transition-all font-medium"
              >
                😊 Achird<br/><span className="text-[10px] opacity-80">(Friendly)</span>
              </button>
              <button
                onClick={() => applyVoicePreset("charon")}
                className="px-3 py-2 text-xs bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-md transition-all font-medium"
              >
                📢 Charon<br/><span className="text-[10px] opacity-80">(Informative)</span>
              </button>
            </div>
            <p className="text-xs text-yellow-300 bg-yellow-900/20 border border-yellow-700 rounded p-2">
              ⚠️ <strong>Important:</strong> VEO3 generates voice NATIVELY. These presets describe the style for VEO3 to emulate. Google voice names are for reference only.
            </p>
          </Field>

          <Field label="Global Visual Style (Cinema & Lighting)">
            <TextArea
              value={settings.style}
              onChange={(v) => setSettings({ ...settings, style: v })}
              placeholder="professional medical setting, high contrast, stable camera..."
              rows={4}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4">
            <Field label="Doctor Character Name">
              <TextInput
                value={settings.characterName}
                onChange={(v) => setSettings({ ...settings, characterName: v })}
                placeholder="Dr. Robert Mitchell"
              />
            </Field>
            <Field label="Doctor Character Lock (Ultra-Detailed for Consistency)">
              <TextArea
                value={settings.characterLock}
                onChange={(v) => setSettings({ ...settings, characterLock: v })}
                placeholder="Age, ethnicity, facial features, hair, clothing, mannerisms..."
                rows={10}
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 <strong>VEO3 Best Practice:</strong> Extreme detail improves consistency across many clips.
              </p>
            </Field>
          </div>

          <Field label="Voice Generation Instructions (VEO3 Native Audio)">
            <TextArea
              value={settings.voiceNote}
              onChange={(v) => setSettings({ ...settings, voiceNote: v })}
              placeholder="Voice characteristics, pace, tone..."
              rows={6}
            />
            <p className="text-xs text-orange-300 bg-orange-900/20 border border-orange-700 rounded p-2 mt-2">
              🔊 <strong>Key:</strong> 110-120 WPM pace · 0.7-1.0s pauses · Fatherly warm tone · Clear enunciation
            </p>
          </Field>

          <div className="grid grid-cols-1 gap-4">
            <Field label="Background Music (Subtle, -20dB Under Voice)">
              <TextInput
                value={settings.musicMood}
                onChange={(v) => setSettings({ ...settings, musicMood: v })}
                placeholder="gentle piano, 55-65 BPM, -20dB..."
              />
            </Field>
            <Field label="Sound Effects (Minimal for Clarity)">
              <TextInput
                value={settings.sfxPack}
                onChange={(v) => setSettings({ ...settings, sfxPack: v })}
                placeholder="minimal SFX, gentle transitions, -15dB below voice..."
              />
            </Field>
          </div>
        </div>

        {/* Right: Output */}
        <div className="sticky top-24 h-fit">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">
                {clips.length > 0 ? (
                <>
                  Clips: <span className="text-cyan-400 font-medium">{clips.length}</span> × 8s 
                  <span className="text-gray-500 mx-2">|</span>
                  Duration: ~{Math.round(clips.length * 8 / 60)} min
                </>
                ) : (
                <>⏳ Awaiting Script Input...</>
                )}
            </div>
            <div className="flex gap-2">
                <button 
                  onClick={copyAll} 
                  disabled={!commands} 
                  className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  📋 Copy All
                </button>
                <button 
                  onClick={downloadTxt} 
                  disabled={!commands} 
                  className="px-4 py-2 text-sm bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  💾 Download
                </button>
            </div>
          </div>
          
          <pre className="whitespace-pre-wrap text-xs leading-relaxed bg-gray-950/70 border border-gray-800 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-auto font-mono">
            {commands || (
              <span className="text-gray-500">
                <strong>Your VEO3 commands will appear here.</strong>
                <br/><br/>
                Each command is optimized for:
                <br/>
                <br/>✅ Dr. Mitchell's consistent appearance
                <br/>✅ 110-120 WPM slow speech
                <br/>✅ Pauses after important facts
                <br/>✅ High-contrast medical setting
                <br/>✅ Native VEO3 audio generation
                <br/>✅ Minimal -20dB background music
                <br/>✅ Stable camera movements
                <br/><br/>
                <strong className="text-cyan-400">Perfect for 60+ audience health content!</strong>
              </span>
            )}
          </pre>

          {clips.length > 50 && (
            <div className="mt-3 text-xs bg-yellow-900/20 border border-yellow-700 text-yellow-300 rounded p-3">
              ⚠️ <strong>Large Project Alert:</strong> You have {clips.length} clips. We recommend generating 5-10 clips first to test for consistency before generating the entire batch.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
