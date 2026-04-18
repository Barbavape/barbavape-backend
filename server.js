import { useState } from "react";

const G = "#1B3A2D", GL = "#2A5240", GD = "#0F2118", GOLD = "#C8A84B", CREAM = "#F5F0E8";

const STORES = {
  chateau: { key: "chateau", name: "Château-du-Loir", short: "Château", address: "Montval-sur-Loir", icon: "🏰", color: "#4A90D9", phone: "0243446905", whatsapp: "0695767893", messenger: "barbavapeshop", email: "barbavape.staff@gmail.com" },
  ecommoy: { key: "ecommoy", name: "Ecommoy", short: "Ecommoy", address: "Galerie Hyper U", icon: "🛒", color: "#E8A020", phone: "0243282421", whatsapp: "0695767893", messenger: "barbavapeshop", email: "barbavape.staff@gmail.com" },
};

const LEVELS = [
  { name: "Bronze", min: 0, max: 199, color: "#CD7F32" },
  { name: "Silver", min: 200, max: 499, color: "#A8A9AD" },
  { name: "Gold", min: 500, max: 999, color: GOLD },
  { name: "Platinum", min: 1000, max: Infinity, color: "#b0c4de" },
];

const REWARDS = [
  { id: 1, name: "Remise 5%", points: 100, icon: "🎟️" },
  { id: 2, name: "E-liquide offert", points: 250, icon: "🧪" },
  { id: 3, name: "Résistances x5", points: 400, icon: "⚡" },
  { id: 4, name: "Pod au choix", points: 600, icon: "💨" },
  { id: 5, name: "Box premium", points: 1000, icon: "🏆" },
];

const WELCOME_BONUS = 50;

const CLIENT_CHANNELS = [
  { key: "sms", label: "SMS", icon: "💬", color: "#34C759", field: "phone", placeholder: "Votre numéro (ex: 0612345678)" },
  { key: "whatsapp", label: "WhatsApp", icon: "📱", color: "#25D366", field: "phone", placeholder: "Votre numéro WhatsApp" },
  { key: "messenger", label: "Messenger", icon: "💙", color: "#0099FF", field: "messenger", placeholder: "Votre identifiant Messenger" },
  { key: "phone", label: "Téléphone", icon: "📞", color: "#FF9500", field: "phone", placeholder: "Votre numéro de téléphone" },
  { key: "email", label: "Email", icon: "✉️", color: "#FF3B30", field: "email", placeholder: "Votre adresse email" },
];

const ADMIN_CHANNELS = [
  { key: "sms", label: "SMS", icon: "💬", color: "#34C759", getUrl: c => `sms:${c.phone}`, getMsgUrl: (c, msg) => `sms:${c.phone}?body=${msg}` },
  { key: "whatsapp", label: "WhatsApp", icon: "📱", color: "#25D366", getUrl: c => `https://wa.me/33${(c.phone||"").substring(1)}`, getMsgUrl: (c, msg) => `https://wa.me/33${(c.phone||"").substring(1)}?text=${msg}` },
  { key: "messenger", label: "Messenger", icon: "💙", color: "#0099FF", getUrl: c => `https://m.me/${c.messenger}`, getMsgUrl: c => `https://m.me/${c.messenger}` },
  { key: "phone", label: "Téléphone", icon: "📞", color: "#FF9500", getUrl: c => `tel:${c.phone}`, getMsgUrl: c => `tel:${c.phone}` },
  { key: "email", label: "Email", icon: "✉️", color: "#FF3B30", getUrl: c => `mailto:${c.email}`, getMsgUrl: (c, msg) => `mailto:${c.email}?body=${msg}` },
];

const TEMPLATES = [
  { id: 1, label: "🎁 Récompense disponible", text: (n, p) => `Bonjour ${n} ! Vous avez ${p} points Barbavape. Venez récupérer votre récompense en boutique ! 🐊` },
  { id: 2, label: "🎉 Anniversaire", text: n => `Joyeux anniversaire ${n} ! 🎂 La team Barbavape vous offre une surprise en boutique ce mois-ci. À très vite !` },
  { id: 3, label: "📢 Promotion", text: n => `Bonjour ${n} ! Nouvelle promo Barbavape : -20% sur tous les e-liquides ce week-end. On vous attend ! 🐊` },
  { id: 4, label: "🔔 Retour en stock", text: n => `Bonjour ${n} ! Votre produit habituel vient de rentrer en stock. Passez nous voir vite, quantités limitées !` },
  { id: 5, label: "💬 Message libre", text: n => `Bonjour ${n}, ` },
];

const HEALTH_MILESTONES = [
  { label: "Tension artérielle", desc: "revient à la normale", hours: 0.33, icon: "❤️" },
  { label: "Monoxyde de carbone", desc: "éliminé du sang", hours: 8, icon: "🫁" },
  { label: "Risque cardiaque", desc: "commence à baisser", hours: 24, icon: "💓" },
  { label: "Goût & odorat", desc: "s'améliorent", hours: 48, icon: "👃" },
  { label: "Respiration", desc: "nettement améliorée", hours: 72, icon: "😮‍💨" },
  { label: "1 semaine", desc: "sans tabac — bravo !", hours: 168, icon: "🌟" },
  { label: "1 mois", desc: "toux et essoufflement réduits", hours: 720, icon: "💪" },
  { label: "3 mois", desc: "fonction pulmonaire +30%", hours: 2160, icon: "🫀" },
  { label: "1 an", desc: "risque coronarien divisé par 2", hours: 8760, icon: "🏆" },
];

const MOCK_CLIENTS = [
  { id: 1, name: "Marie Dupont", phone: "0612345678", email: "marie.dupont@email.com", messenger: "marie.dupont.vape", preferredChannel: "whatsapp", store: "chateau", points: 400, welcomeGiven: true,
    purchases: [{ date: "2026-04-15", amount: 28, product: "E-liquide Fruité 50ml" }, { date: "2026-03-20", amount: 45, product: "Pod Vaporesso XROS" }],
    preferences: ["E-liquides fruités", "Pods"], cigsBefore: 15, cigsNow: 0, quitDate: "2025-10-01", prixPaquet: 11 },
  { id: 2, name: "Thomas Bernard", phone: "0623456789", email: "thomas.b@email.com", messenger: "thomas.bernard.72", preferredChannel: "sms", store: "ecommoy", points: 170, welcomeGiven: true,
    purchases: [{ date: "2026-01-10", amount: 35, product: "Mod + clearomiseur" }],
    preferences: ["Tabac", "Box mod"], cigsBefore: 20, cigsNow: 5, quitDate: "2025-12-01", prixPaquet: 11 },
  { id: 3, name: "Sophie Martin", phone: "0634567890", email: "sophie.martin@email.com", messenger: "sophie.martin.sarthe", preferredChannel: "email", store: "chateau", points: 730, welcomeGiven: true,
    purchases: [{ date: "2026-04-12", amount: 55, product: "Kit complet débutant" }, { date: "2026-02-14", amount: 75, product: "Box premium" }],
    preferences: ["Menthe", "Kits débutant"], cigsBefore: 10, cigsNow: 0, quitDate: "2026-01-15", prixPaquet: 11 },
];

const getLevel = p => LEVELS.find(l => p >= l.min && p <= l.max) || LEVELS[0];
const nextLvl = p => { const i = LEVELS.indexOf(getLevel(p)); return i < LEVELS.length - 1 ? LEVELS[i + 1] : null; };
const lastPurchaseDate = c => c.purchases.length ? new Date(Math.max(...c.purchases.map(p => new Date(p.date)))) : new Date(0);
const daysSince = c => Math.floor((Date.now() - lastPurchaseDate(c)) / 86400000);
const absentLabel = d => d === 0 ? "Aujourd'hui" : d < 30 ? `${d}j` : d < 365 ? `${Math.floor(d/30)} mois` : `${Math.floor(d/365)}a`;
const absentColor = d => d > 60 ? "#FF3B30" : d > 30 ? "#FF9500" : "#34C759";

function Avatar({ name, size = 44 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size/2, background: `linear-gradient(135deg,${G},${GL})`, color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size*0.35, flexShrink: 0 }}>
      {name.split(" ").map(n=>n[0]).join("").toUpperCase()}
    </div>
  );
}

function StoreBadge({ storeKey, small }) {
  const s = STORES[storeKey]; if (!s) return null;
  return <span style={{ background: s.color+"22", color: s.color, border: `1px solid ${s.color}55`, padding: small?"2px 7px":"4px 10px", borderRadius: 20, fontSize: small?10:12, fontWeight: 700, whiteSpace:"nowrap" }}>{s.icon} {s.short}</span>;
}

function LoyaltyCard({ client }) {
  const lvl = getLevel(client.points), next = nextLvl(client.points);
  const progress = next ? ((client.points-lvl.min)/(next.min-lvl.min))*100 : 100;
  return (
    <div style={{ background:`linear-gradient(135deg,${GD} 0%,${G} 60%,${GL} 100%)`, borderRadius:20, padding:"24px 24px 20px", color:CREAM, position:"relative", overflow:"hidden", boxShadow:"0 8px 32px rgba(15,33,24,0.25)" }}>
      <div style={{ position:"absolute", right:-15, bottom:-25, fontSize:130, opacity:0.06, userSelect:"none" }}>🐊</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:10, opacity:0.6, letterSpacing:3, textTransform:"uppercase", marginBottom:4 }}>Carte de fidélité</div>
          <div style={{ fontSize:20, fontWeight:700 }}>{client.name}</div>
          {client.store && <div style={{ fontSize:11, opacity:0.6, marginTop:3 }}>{STORES[client.store]?.icon} {STORES[client.store]?.name}</div>}
        </div>
        <div style={{ background:lvl.color, color:"#111", padding:"5px 14px", borderRadius:20, fontWeight:800, fontSize:12 }}>{lvl.name}</div>
      </div>
      <div style={{ margin:"18px 0 4px", fontSize:40, fontWeight:900 }}>{client.points.toLocaleString()}<span style={{ fontSize:16, fontWeight:400, opacity:0.7, marginLeft:6 }}>pts</span></div>
      {next ? (<>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, opacity:0.65, marginBottom:6 }}><span>Vers {next.name}</span><span>{next.min-client.points} pts restants</span></div>
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:6, height:7, overflow:"hidden" }}><div style={{ background:GOLD, height:"100%", width:`${Math.min(progress,100)}%`, borderRadius:6 }}/></div>
      </>) : <div style={{ fontSize:12, opacity:0.6, marginTop:4 }}>✨ Niveau maximum atteint !</div>}
      <div style={{ marginTop:16, fontSize:10, opacity:0.4, letterSpacing:2, textTransform:"uppercase" }}>Barbavape · Since 2018</div>
    </div>
  );
}

// ---- CIGARETTE TRACKER ----
function CigaretteTab({ client, setClient }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ cigsBefore: client.cigsBefore||0, cigsNow: client.cigsNow||0, quitDate: client.quitDate||"", prixPaquet: client.prixPaquet||11 });

  const save = () => { setClient({ ...client, ...form }); setEditing(false); };

  const quitDate = client.quitDate ? new Date(client.quitDate) : null;
  const hoursElapsed = quitDate ? (Date.now() - quitDate) / 3600000 : 0;
  const daysElapsed = Math.floor(hoursElapsed / 24);
  const cigPerDay = (client.cigsBefore||0) - (client.cigsNow||0);
  const cigsAvoided = Math.max(0, Math.floor(cigPerDay * daysElapsed));
  const pricePerCig = (client.prixPaquet||11) / 20;
  const moneySaved = (cigsAvoided * pricePerCig).toFixed(2);
  const pctReduction = client.cigsBefore > 0 ? Math.round(((client.cigsBefore - client.cigsNow) / client.cigsBefore) * 100) : 0;

  const nextMilestone = HEALTH_MILESTONES.find(m => m.hours > hoursElapsed);
  const lastMilestone = [...HEALTH_MILESTONES].reverse().find(m => m.hours <= hoursElapsed);

  const motivMsg = () => {
    if (!client.quitDate) return "Renseignez votre date de passage à la vape pour commencer le suivi 👇";
    if (pctReduction === 100) return "Vous avez arrêté totalement le tabac — félicitations ! 🏆";
    if (pctReduction >= 75) return "Incroyable progression, vous y êtes presque ! 💪";
    if (pctReduction >= 50) return "La moitié du chemin est faite, continuez ! 🌟";
    if (pctReduction >= 25) return "Chaque cigarette évitée compte — bon courage ! 👍";
    return "Vous avez fait le premier pas, c'est le plus important ! 🐊";
  };

  const circleSize = 150;
  const r = 54, cx = circleSize/2, cy = circleSize/2;
  const circ = 2*Math.PI*r;
  const dashOffset = circ * (1 - pctReduction/100);

  return (
    <div>
      {/* Motivation banner */}
      <div style={{ background:`linear-gradient(135deg,${G},${GL})`, borderRadius:16, padding:"16px 18px", color:CREAM, marginBottom:16, textAlign:"center" }}>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:4 }}>Mon parcours sans tabac</div>
        <div style={{ fontSize:15, fontWeight:700 }}>{motivMsg()}</div>
      </div>

      {/* Donut réduction */}
      {client.quitDate && client.cigsBefore > 0 && (
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          {/* Donut */}
          <div style={{ background:"white", borderRadius:16, border:"1px solid #eee", flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", alignItems:"center" }}>
            <svg width={circleSize} height={circleSize}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth={12}/>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={pctReduction===100?"#34C759":G} strokeWidth={12}
                strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`} style={{ transition:"stroke-dashoffset 0.8s ease" }}/>
              <text x={cx} y={cy-8} textAnchor="middle" fontSize="26" fontWeight="900" fill={G}>{pctReduction}%</text>
              <text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fill="#999">réduction</text>
            </svg>
            <div style={{ fontSize:12, color:"#777", textAlign:"center", marginTop:4 }}>
              {client.cigsNow === 0 ? "🎉 Zéro cigarette !" : `${client.cigsNow} cig/j restantes`}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
            {[
              ["🗓️", `${daysElapsed}`, "jours", "de vape"],
              ["🚬", cigsAvoided.toLocaleString(), "cig.", "évitées"],
              ["💶", `${moneySaved}€`, "", "économisés"],
            ].map(([icon, val, unit, label]) => (
              <div key={label} style={{ background:"white", borderRadius:14, border:"1px solid #eee", padding:"12px 14px", flex:1, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight:900, fontSize:18, color:G }}>{val} <span style={{ fontSize:12, fontWeight:500, color:"#aaa" }}>{unit}</span></div>
                  <div style={{ fontSize:11, color:"#bbb" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone actuel + suivant */}
      {client.quitDate && (
        <div style={{ marginBottom:14 }}>
          {lastMilestone && (
            <div style={{ background:"#edf7f1", border:"1.5px solid #9dd4b4", borderRadius:14, padding:"13px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:28 }}>{lastMilestone.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:G }}>✓ {lastMilestone.label}</div>
                <div style={{ fontSize:12, color:"#555" }}>{lastMilestone.desc}</div>
              </div>
            </div>
          )}
          {nextMilestone && (
            <div style={{ background:"#f9f9f9", border:"1.5px solid #eee", borderRadius:14, padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:28, opacity:0.45 }}>{nextMilestone.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:"#777" }}>Prochain cap : {nextMilestone.label}</div>
                <div style={{ fontSize:12, color:"#bbb" }}>{nextMilestone.desc}</div>
                <div style={{ background:"#eee", borderRadius:6, height:5, marginTop:8, overflow:"hidden" }}>
                  <div style={{ background:G, height:"100%", width:`${Math.min((hoursElapsed/nextMilestone.hours)*100,100)}%`, borderRadius:6, transition:"width 0.5s" }}/>
                </div>
              </div>
            </div>
          )}
          {!nextMilestone && <div style={{ background:`linear-gradient(135deg,${GOLD},#e0a830)`, borderRadius:14, padding:"14px 16px", textAlign:"center", color:"#111", fontWeight:800, fontSize:15 }}>🏆 Tous les caps santé sont atteints — vous êtes un champion !</div>}
        </div>
      )}

      {/* Modifier / saisir */}
      {!editing ? (
        <button onClick={() => setEditing(true)} style={{ width:"100%", padding:"13px", background:"white", border:`1.5px solid ${G}`, borderRadius:14, color:G, fontWeight:700, cursor:"pointer", fontSize:14 }}>
          {client.quitDate ? "✏️ Mettre à jour mes données" : "➕ Commencer mon suivi"}
        </button>
      ) : (
        <div style={{ background:"white", border:"1.5px solid #ddd", borderRadius:16, padding:18 }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:G }}>Mon suivi tabac</div>
          {[
            { label:"📅 Date de passage à la vape", field:"quitDate", type:"date" },
            { label:"🚬 Cigarettes/jour avant la vape", field:"cigsBefore", type:"number", min:1, max:60 },
            { label:"🚬 Cigarettes/jour aujourd'hui", field:"cigsNow", type:"number", min:0, max:60 },
            { label:"💶 Prix du paquet (€)", field:"prixPaquet", type:"number", min:5, max:20 },
          ].map(f => (
            <div key={f.field} style={{ marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#555", marginBottom:6 }}>{f.label}</div>
              <input type={f.type} value={form[f.field]} min={f.min} max={f.max}
                onChange={e => setForm({ ...form, [f.field]: f.type==="number" ? parseInt(e.target.value)||0 : e.target.value })}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #ddd", fontSize:15, boxSizing:"border-box", outline:"none" }}/>
              {f.field==="cigsNow" && form.cigsBefore>0 && (
                <input type="range" min={0} max={form.cigsBefore} value={form.cigsNow}
                  onChange={e => setForm({ ...form, cigsNow: parseInt(e.target.value) })}
                  style={{ width:"100%", marginTop:8, accentColor:G }}/>
              )}
            </div>
          ))}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <button onClick={save} style={{ flex:1, padding:"11px", background:G, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:14 }}>Enregistrer ✓</button>
            <button onClick={() => setEditing(false)} style={{ padding:"11px 16px", background:"#f0f0f0", border:"none", borderRadius:10, cursor:"pointer", fontSize:13 }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

function RewardsTab({ client }) {
  return (
    <div>{REWARDS.map(r => {
      const ok = client.points >= r.points;
      return (
        <div key={r.id} style={{ display:"flex", alignItems:"center", padding:"14px 16px", marginBottom:8, background:ok?"#edf7f1":"#fafafa", borderRadius:14, border:`1.5px solid ${ok?"#9dd4b4":"#e8e8e8"}` }}>
          <span style={{ fontSize:26, marginRight:14 }}>{r.icon}</span>
          <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14 }}>{r.name}</div><div style={{ fontSize:12, color:"#999" }}>{r.points} points</div></div>
          {ok ? <span style={{ background:G, color:"white", padding:"5px 12px", borderRadius:10, fontSize:12, fontWeight:700 }}>Dispo ✓</span>
               : <span style={{ color:"#bbb", fontSize:13, fontWeight:600 }}>−{r.points-client.points} pts</span>}
        </div>
      );
    })}</div>
  );
}

function HistoryTab({ client }) {
  return (
    <div>
      {client.purchases.length===0 && <div style={{ textAlign:"center", color:"#aaa", padding:32 }}>Aucun achat enregistré</div>}
      {client.purchases.map((p,i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", padding:"13px 16px", marginBottom:8, background:"white", borderRadius:14, border:"1px solid #eee" }}>
          <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:14 }}>{p.product}</div><div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{new Date(p.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div></div>
          <div style={{ fontWeight:800, color:G, fontSize:16 }}>{p.amount}€</div>
        </div>
      ))}
    </div>
  );
}

function ProfilTab({ client, setClient }) {
  const [editing, setEditing] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const isFilled = ch => (client[ch.field]||"").trim().length > 3;
  const startEdit = ch => { setEditing(ch.key); setInputVal(client[ch.field]||""); };
  const saveEdit = ch => { setClient({ ...client, [ch.field]: inputVal, preferredChannel: ch.key }); setEditing(null); };
  const setPref = ch => { if (!isFilled(ch)) { startEdit(ch); return; } setClient({ ...client, preferredChannel: ch.key }); };
  return (
    <div>
      <div style={{ fontSize:13, color:"#555", fontWeight:600, marginBottom:8 }}>Ma boutique habituelle</div>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {Object.values(STORES).map(s => (
          <div key={s.key} onClick={() => setClient({ ...client, store: s.key })} style={{ flex:1, padding:"12px 8px", borderRadius:14, border:`2px solid ${client.store===s.key?s.color:"#eee"}`, background:client.store===s.key?`${s.color}18`:"white", cursor:"pointer", textAlign:"center" }}>
            <div style={{ fontSize:26 }}>{s.icon}</div>
            <div style={{ fontWeight:700, fontSize:13, marginTop:4, color:client.store===s.key?s.color:"#444" }}>{s.name}</div>
            <div style={{ fontSize:10, color:"#bbb", marginTop:2 }}>{s.address}</div>
            {client.store===s.key && <div style={{ color:s.color, fontWeight:800, fontSize:12, marginTop:5 }}>✓ Ma boutique</div>}
          </div>
        ))}
      </div>
      <div style={{ fontSize:13, color:"#555", fontWeight:600, marginBottom:8 }}>Mes coordonnées</div>
      {CLIENT_CHANNELS.map(ch => {
        const filled=isFilled(ch), isPref=client.preferredChannel===ch.key, isEd=editing===ch.key;
        return (
          <div key={ch.key} style={{ marginBottom:8, borderRadius:14, border:`2px solid ${isPref?ch.color:filled?"#ddd":"#f0f0f0"}`, background:isPref?`${ch.color}14`:"white", overflow:"hidden" }}>
            <div onClick={() => !isEd && setPref(ch)} style={{ display:"flex", alignItems:"center", padding:"12px 16px", cursor:"pointer" }}>
              <span style={{ fontSize:20, marginRight:12 }}>{ch.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:filled?"#222":"#bbb" }}>{ch.label}</div>
                {filled && !isEd && <div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>{client[ch.field]}</div>}
                {!filled && !isEd && <div style={{ fontSize:11, color:"#ccc", marginTop:1 }}>Appuyer pour renseigner</div>}
              </div>
              {isPref && <span style={{ color:ch.color, fontWeight:800, fontSize:15, marginRight:8 }}>✓</span>}
              {filled && !isPref && <span onClick={e=>{e.stopPropagation();startEdit(ch);}} style={{ fontSize:11, color:"#aaa", padding:"3px 8px", border:"1px solid #ddd", borderRadius:8, cursor:"pointer" }}>Modifier</span>}
              {!filled && <span style={{ fontSize:18, color:ch.color, fontWeight:700 }}>+</span>}
            </div>
            {isEd && (
              <div style={{ padding:"0 14px 14px", borderTop:"1px solid #f5f5f5" }}>
                <input autoFocus value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder={ch.placeholder}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${ch.color}`, fontSize:14, boxSizing:"border-box", outline:"none", marginTop:10 }}/>
                <div style={{ display:"flex", gap:8, marginTop:8 }}>
                  <button onClick={()=>saveEdit(ch)} style={{ flex:1, padding:"10px", background:ch.color, color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:13 }}>Enregistrer ✓</button>
                  <button onClick={()=>setEditing(null)} style={{ padding:"10px 14px", background:"#f0f0f0", border:"none", borderRadius:10, cursor:"pointer", fontSize:13 }}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ContactEquipeTab({ client }) {
  const [sel, setSel] = useState(client.store||"chateau");
  const s = STORES[sel];
  const open = url => window.open(url,"_blank");
  const msg = encodeURIComponent("Bonjour Barbavape ! 🐊");
  return (
    <div>
      <div style={{ fontSize:13, color:"#555", fontWeight:600, marginBottom:8 }}>Choisir une boutique</div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {Object.values(STORES).map(st => (
          <div key={st.key} onClick={()=>setSel(st.key)} style={{ flex:1, padding:"11px 8px", borderRadius:12, border:`2px solid ${sel===st.key?st.color:"#eee"}`, background:sel===st.key?`${st.color}18`:"white", cursor:"pointer", textAlign:"center" }}>
            <div style={{ fontSize:22 }}>{st.icon}</div>
            <div style={{ fontWeight:700, fontSize:12, marginTop:3, color:sel===st.key?st.color:"#555" }}>{st.name}</div>
            <div style={{ fontSize:10, color:"#bbb", marginTop:1 }}>{st.address}</div>
          </div>
        ))}
      </div>
      <div style={{ background:`${s.color}12`, border:`1.5px solid ${s.color}44`, borderRadius:14, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontWeight:700, color:s.color, fontSize:14 }}>{s.icon} {s.name} — {s.address}</div>
      </div>
      <div style={{ fontSize:13, color:"#555", fontWeight:600, marginBottom:8 }}>📞 Téléphone</div>
      <div onClick={()=>open(`tel:${s.phone}`)} style={{ display:"flex", alignItems:"center", padding:"14px 16px", marginBottom:16, background:"#FFF4E6", border:"1.5px solid #FF9500", borderRadius:14, cursor:"pointer" }}>
        <span style={{ fontSize:24, marginRight:14 }}>📞</span>
        <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14, color:"#FF9500" }}>Appeler la boutique</div><div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>{s.phone}</div></div>
        <span style={{ fontSize:22, color:"#FF9500" }}>›</span>
      </div>
      <div style={{ fontSize:13, color:"#555", fontWeight:600, marginBottom:8 }}>💬 Messageries</div>
      <div style={{ background:"white", border:"1.5px solid #eee", borderRadius:14, overflow:"hidden", marginBottom:10 }}>
        {[
          { label:"WhatsApp", icon:"📱", color:"#25D366", url:`https://wa.me/33${s.whatsapp.substring(1)}?text=${msg}` },
          { label:"SMS", icon:"💬", color:"#34C759", url:`sms:${s.phone}` },
          { label:"Messenger", icon:"💙", color:"#0099FF", url:`https://m.me/${s.messenger}` },
        ].map((ch,i,arr) => (
          <div key={ch.label} onClick={()=>open(ch.url)} style={{ display:"flex", alignItems:"center", padding:"14px 16px", borderBottom:i<arr.length-1?"1px solid #f5f5f5":"none", cursor:"pointer" }}>
            <span style={{ fontSize:22, marginRight:14 }}>{ch.icon}</span>
            <span style={{ fontWeight:600, fontSize:14, flex:1 }}>{ch.label}</span>
            <span style={{ color:ch.color, fontWeight:700, fontSize:13 }}>Écrire ›</span>
          </div>
        ))}
      </div>
      <div onClick={()=>open(`mailto:${s.email}`)} style={{ display:"flex", alignItems:"center", padding:"14px 16px", background:"#FFF0EF", border:"1.5px solid #FF3B30", borderRadius:14, cursor:"pointer" }}>
        <span style={{ fontSize:22, marginRight:14 }}>✉️</span>
        <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:14, color:"#FF3B30" }}>Email</div><div style={{ fontSize:11, color:"#aaa", marginTop:1 }}>{s.email}</div></div>
        <span style={{ fontSize:18, color:"#FF3B30" }}>›</span>
      </div>
    </div>
  );
}

function ClientView({ client, setClient }) {
  const [tab, setTab] = useState("rewards");
  const tabs = [["rewards","🎁"],["history","🛒"],["cigs","🚬"],["profil","👤"],["equipe","📞"]];
  const labels = { rewards:"Récompenses", history:"Achats", cigs:"Ma santé", profil:"Profil", equipe:"Contact" };
  return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <LoyaltyCard client={client}/>
      <div style={{ display:"flex", gap:2, margin:"12px 0", background:"#e8e8ec", borderRadius:12, padding:3 }}>
        {tabs.map(([k,icon]) => (
          <button key={k} onClick={()=>setTab(k)} style={{ flex:1, padding:"8px 2px", borderRadius:9, border:"none", cursor:"pointer", fontSize:tab===k?11:17, fontWeight:tab===k?700:400, background:tab===k?G:"transparent", color:tab===k?CREAM:"#888", transition:"all 0.2s", lineHeight:1.2 }} title={labels[k]}>
            {tab===k ? labels[k] : icon}
          </button>
        ))}
      </div>
      {tab==="rewards" && <RewardsTab client={client}/>}
      {tab==="history" && <HistoryTab client={client}/>}
      {tab==="cigs" && <CigaretteTab client={client} setClient={setClient}/>}
      {tab==="profil" && <ProfilTab client={client} setClient={setClient}/>}
      {tab==="equipe" && <ContactEquipeTab client={client}/>}
    </div>
  );
}

function AdminView({ clients, setClients }) {
  const [tab, setTab] = useState("dashboard");
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [addPts, setAddPts] = useState("");
  const [template, setTemplate] = useState(null);
  const [customMsg, setCustomMsg] = useState("");
  const [msgStore, setMsgStore] = useState("all");
  const [toast, setToast] = useState("");

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const getFiltered = () => clients
    .filter(c => {
      const mS = c.name.toLowerCase().includes(search.toLowerCase())||(c.phone||"").includes(search);
      const mStore = storeFilter==="all"||c.store===storeFilter;
      return mS && mStore;
    })
    .sort((a,b) => {
      if (sortBy==="level") return b.points-a.points;
      if (sortBy==="lastpurchase") return lastPurchaseDate(b)-lastPurchaseDate(a);
      if (sortBy==="absent") return daysSince(b)-daysSince(a);
      return a.name.localeCompare(b.name);
    });

  function doAddPoints() {
    const n=parseInt(addPts); if(!n||n<=0) return;
    setClients(prev=>prev.map(c=>c.id===sel.id?{...c,points:c.points+n}:c));
    setSel(prev=>({...prev,points:prev.points+n}));
    setAddPts(""); showToast(`+${n} points ajoutés à ${sel.name} ✓`);
  }

  function sendMsg(client, ch) {
    const txt=template?encodeURIComponent(template.id===5?customMsg:template.text(client.name,client.points)):"";
    window.open(txt?ch.getMsgUrl(client,txt):ch.getUrl(client),"_blank");
    showToast(`Ouverture ${ch.label} pour ${client.name}`);
  }

  const selData = sel?(clients.find(c=>c.id===sel.id)||sel):null;
  const filtered = getFiltered();
  const SORT_OPTIONS = [["name","🔤 Nom"],["level","🏆 Statut"],["lastpurchase","🛒 Dernier achat"],["absent","⏳ Non-venu"]];

  return (
    <div style={{ maxWidth:480, margin:"0 auto", position:"relative" }}>
      {toast && <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:G, color:CREAM, padding:"10px 20px", borderRadius:30, fontWeight:600, fontSize:13, zIndex:999, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", whiteSpace:"nowrap" }}>{toast}</div>}

      <div style={{ background:`linear-gradient(135deg,${GD},${G})`, color:CREAM, padding:"18px 20px", borderRadius:18, marginBottom:14 }}>
        <div style={{ fontSize:10, opacity:0.55, letterSpacing:3, textTransform:"uppercase" }}>Espace Admin</div>
        <div style={{ fontSize:22, fontWeight:800, marginTop:2 }}>Barbavape 🐊</div>
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          {Object.values(STORES).map(s=>(
            <div key={s.key} style={{ background:`${s.color}33`, border:`1px solid ${s.color}66`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600 }}>{s.icon} {s.short} · {clients.filter(c=>c.store===s.key).length} clients</div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:3, background:"#e8e8ec", borderRadius:12, padding:3, marginBottom:14 }}>
        {[["dashboard","📊 Tableau"],["clients","👥 Clients"],["messages","💌 Messages"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setTab(k);setSel(null);}} style={{ flex:1, padding:"9px 4px", borderRadius:9, border:"none", cursor:"pointer", fontSize:12, fontWeight:tab===k?700:500, background:tab===k?G:"transparent", color:tab===k?CREAM:"#666", transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>

      {tab==="dashboard" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[["👥","Clients",clients.length],["⭐","Points distribués",clients.reduce((s,c)=>s+c.points,0).toLocaleString()],["🛒","Achats",clients.reduce((s,c)=>s+c.purchases.length,0)],["🏆","Gold ou +",clients.filter(c=>c.points>=500).length]].map(([icon,label,val])=>(
              <div key={label} style={{ background:"white", border:"1px solid #eee", borderRadius:14, padding:"16px 14px", textAlign:"center" }}>
                <div style={{ fontSize:26, marginBottom:4 }}>{icon}</div>
                <div style={{ fontSize:24, fontWeight:900, color:G }}>{val}</div>
                <div style={{ fontSize:11, color:"#999", marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
          {clients.map(c=>{
            const lvl=getLevel(c.points), d=daysSince(c);
            const pctRed = c.cigsBefore>0?Math.round(((c.cigsBefore-(c.cigsNow||0))/c.cigsBefore)*100):null;
            return (
              <div key={c.id} onClick={()=>{setSel(c);setTab("clients");}} style={{ display:"flex", alignItems:"center", padding:"13px 16px", marginBottom:8, background:"white", borderRadius:14, border:"1px solid #eee", cursor:"pointer" }}>
                <Avatar name={c.name}/>
                <div style={{ flex:1, marginLeft:12 }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:"#aaa", marginTop:2 }}>
                    {c.points} pts · <span style={{ color:absentColor(d) }}>⏳ {absentLabel(d)}</span>
                    {pctRed!==null && <span style={{ color:pctRed===100?"#34C759":G, marginLeft:8 }}>🚬 -{pctRed}%</span>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ background:lvl.color, color:"#111", padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:700 }}>{lvl.name}</span>
                  <StoreBadge storeKey={c.store} small/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="clients" && !selData && (
        <div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Nom ou téléphone..."
            style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"1.5px solid #ddd", fontSize:14, boxSizing:"border-box", marginBottom:10, outline:"none" }}/>
          <div style={{ display:"flex", gap:6, marginBottom:10 }}>
            {[["all","Tous"],["chateau","🏰 Château"],["ecommoy","🛒 Ecommoy"]].map(([k,l])=>(
              <button key={k} onClick={()=>setStoreFilter(k)} style={{ padding:"7px 12px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:storeFilter===k?700:500, background:storeFilter===k?G:"#eee", color:storeFilter===k?CREAM:"#555" }}>{l}</button>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:"#999", fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Trier par</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {SORT_OPTIONS.map(([k,l])=>(
                <button key={k} onClick={()=>setSortBy(k)} style={{ padding:"7px 13px", borderRadius:20, border:`1.5px solid ${sortBy===k?G:"#ddd"}`, cursor:"pointer", fontSize:12, fontWeight:sortBy===k?700:400, background:sortBy===k?G:"white", color:sortBy===k?CREAM:"#666", transition:"all 0.15s" }}>{l}</button>
              ))}
            </div>
          </div>
          {filtered.length===0 && <div style={{ textAlign:"center", color:"#bbb", padding:32 }}>Aucun client trouvé</div>}
          {filtered.map(c=>{
            const lvl=getLevel(c.points), d=daysSince(c);
            const pctRed=c.cigsBefore>0?Math.round(((c.cigsBefore-(c.cigsNow||0))/c.cigsBefore)*100):null;
            return (
              <div key={c.id} onClick={()=>setSel(c)} style={{ display:"flex", alignItems:"center", padding:"14px 16px", marginBottom:8, background:"white", borderRadius:14, border:"1px solid #eee", cursor:"pointer" }}>
                <Avatar name={c.name}/>
                <div style={{ flex:1, marginLeft:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:600, fontSize:14 }}>{c.name}</span>
                    <StoreBadge storeKey={c.store} small/>
                  </div>
                  <div style={{ fontSize:12, color:"#aaa", marginTop:3 }}>
                    {c.points} pts · {c.phone}
                    {pctRed!==null && <span style={{ color:pctRed===100?"#34C759":G, marginLeft:6 }}>🚬 -{pctRed}%</span>}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                  <span style={{ background:lvl.color, color:"#111", padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:700 }}>{lvl.name}</span>
                  <span style={{ color:absentColor(d), fontSize:11, fontWeight:700 }}>⏳ {absentLabel(d)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="clients" && selData && (()=>{
        const c=selData, lvl=getLevel(c.points), pref=ADMIN_CHANNELS.find(ch=>ch.key===c.preferredChannel), st=STORES[c.store];
        const pctRed=c.cigsBefore>0?Math.round(((c.cigsBefore-(c.cigsNow||0))/c.cigsBefore)*100):null;
        return (
          <div>
            <button onClick={()=>setSel(null)} style={{ background:"none", border:"none", cursor:"pointer", color:G, fontWeight:700, fontSize:14, marginBottom:12, padding:0 }}>‹ Retour</button>
            <div style={{ background:`linear-gradient(135deg,${G},${GL})`, borderRadius:18, padding:20, color:CREAM, marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:20, fontWeight:800 }}>{c.name}</div>
                  <div style={{ fontSize:12, opacity:0.65, marginTop:4 }}>{c.phone} · {c.email}</div>
                  {st && <div style={{ marginTop:8, display:"inline-block", background:`${st.color}33`, border:`1px solid ${st.color}66`, borderRadius:14, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{st.icon} {st.name}</div>}
                  {pctRed!==null && <div style={{ marginTop:6, fontSize:12, opacity:0.85 }}>🚬 Réduction tabac : <strong>{pctRed}%</strong> {pctRed===100?"🏆":""}</div>}
                </div>
                <div style={{ background:lvl.color, color:"#111", padding:"5px 14px", borderRadius:18, fontWeight:800, fontSize:12 }}>{lvl.name}</div>
              </div>
              <div style={{ fontSize:36, fontWeight:900, marginTop:14 }}>{c.points.toLocaleString()} <span style={{ fontSize:15, fontWeight:400, opacity:0.7 }}>pts</span></div>
            </div>
            <div style={{ background:"white", borderRadius:14, border:"1px solid #eee", padding:16, marginBottom:10 }}>
              <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>➕ Ajouter des points</div>
              <div style={{ display:"flex", gap:8 }}>
                <input type="number" value={addPts} onChange={e=>setAddPts(e.target.value)} placeholder="Montant achat (€)" style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"1.5px solid #ddd", fontSize:14, outline:"none" }}/>
                <button onClick={doAddPoints} style={{ background:addPts&&parseInt(addPts)>0?G:"#ccc", color:"white", border:"none", borderRadius:10, padding:"10px 16px", cursor:"pointer", fontWeight:700, fontSize:14 }}>+{addPts?Math.max(0,parseInt(addPts)||0):0} pts</button>
              </div>
              <div style={{ fontSize:11, color:"#bbb", marginTop:6 }}>1€ = 1 point</div>
            </div>
            <div style={{ background:"white", borderRadius:14, border:"1px solid #eee", padding:16, marginBottom:10 }}>
              <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>💬 Contacter</div>
              {pref && <button onClick={()=>sendMsg(c,pref)} style={{ width:"100%", padding:"13px", background:pref.color, color:"white", border:"none", borderRadius:12, fontWeight:700, cursor:"pointer", fontSize:14, marginBottom:10 }}>{pref.icon} {pref.label} <span style={{ opacity:0.8, fontWeight:400, fontSize:12 }}>(canal préféré)</span></button>}
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {ADMIN_CHANNELS.filter(ch=>ch.key!==c.preferredChannel).map(ch=>(
                  <button key={ch.key} onClick={()=>sendMsg(c,ch)} style={{ padding:"8px 14px", background:"white", border:`1.5px solid ${ch.color}`, borderRadius:10, cursor:"pointer", fontSize:13, color:ch.color, fontWeight:600 }}>{ch.icon} {ch.label}</button>
                ))}
              </div>
            </div>
            <div style={{ background:"white", borderRadius:14, border:"1px solid #eee", padding:16 }}>
              <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>🛒 Historique</div>
              {c.purchases.map((p,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:i<c.purchases.length-1?"1px solid #f0f0f0":"none" }}>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>{p.product}</div><div style={{ fontSize:11, color:"#bbb", marginTop:2 }}>{new Date(p.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}</div></div>
                  <div style={{ fontWeight:800, color:G }}>{p.amount}€</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {tab==="messages" && (
        <div>
          <div style={{ fontSize:13, color:"#666", fontWeight:500, marginBottom:10 }}>Choisir un message</div>
          {TEMPLATES.map(t=>(
            <div key={t.id} onClick={()=>{setTemplate(template?.id===t.id?null:t);setCustomMsg("");}} style={{ padding:"13px 16px", marginBottom:8, background:template?.id===t.id?"#edf7f1":"white", borderRadius:14, border:`1.5px solid ${template?.id===t.id?"#9dd4b4":"#eee"}`, cursor:"pointer" }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{t.label}</div>
              <div style={{ fontSize:12, color:"#888", fontStyle:"italic" }}>{t.id!==5?t.text("(client)",0).substring(0,75)+"…":"Rédigez votre propre message"}</div>
            </div>
          ))}
          {template?.id===5 && <textarea value={customMsg} onChange={e=>setCustomMsg(e.target.value)} placeholder="Votre message ici..." rows={3} style={{ width:"100%", padding:"12px 14px", borderRadius:14, border:"1.5px solid #ddd", fontSize:14, boxSizing:"border-box", marginBottom:10, resize:"vertical", outline:"none", fontFamily:"inherit" }}/>}
          {template && (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:6, margin:"12px 0 10px", flexWrap:"wrap" }}>
                <span style={{ fontSize:13, fontWeight:700, color:G }}>Envoyer à :</span>
                {[["all","Tous"],["chateau","🏰 Château"],["ecommoy","🛒 Ecommoy"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setMsgStore(k)} style={{ padding:"5px 12px", borderRadius:16, border:"none", cursor:"pointer", fontSize:11, fontWeight:msgStore===k?700:500, background:msgStore===k?G:"#eee", color:msgStore===k?CREAM:"#555" }}>{l}</button>
                ))}
              </div>
              {clients.filter(c=>msgStore==="all"||c.store===msgStore).map(c=>{
                const pref=ADMIN_CHANNELS.find(ch=>ch.key===c.preferredChannel);
                const ready=template.id!==5||customMsg.trim().length>2;
                return (
                  <div key={c.id} style={{ display:"flex", alignItems:"center", padding:"12px 16px", marginBottom:8, background:"white", borderRadius:14, border:"1px solid #eee" }}>
                    <Avatar name={c.name} size={38}/>
                    <div style={{ flex:1, marginLeft:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontWeight:600, fontSize:14 }}>{c.name}</span><StoreBadge storeKey={c.store} small/></div>
                      <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{pref?.icon} via {pref?.label}</div>
                    </div>
                    <button onClick={()=>ready&&sendMsg(c,pref)} style={{ background:ready?(pref?.color||G):"#ddd", color:"white", border:"none", borderRadius:10, padding:"9px 16px", cursor:ready?"pointer":"default", fontSize:13, fontWeight:700 }}>Envoyer</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("admin");
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [activeClient, setActiveClient] = useState(MOCK_CLIENTS[0]);
  return (
    <div style={{ minHeight:"100vh", background:"#f2f2f7", fontFamily:"'Inter',system-ui,-apple-system,sans-serif", padding:"16px 12px 40px" }}>
      <div style={{ display:"flex", gap:3, background:"#e0e0e6", borderRadius:14, padding:4, maxWidth:480, margin:"0 auto 18px" }}>
        {[["client","🐊 Vue Client"],["admin","⚙️ Vue Admin"]].map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)} style={{ flex:1, padding:"11px", borderRadius:11, border:"none", cursor:"pointer", fontWeight:mode===k?700:500, background:mode===k?G:"transparent", color:mode===k?CREAM:"#555", fontSize:14, transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>
      {mode==="client"
        ? <ClientView client={activeClient} setClient={setActiveClient}/>
        : <AdminView clients={clients} setClients={setClients}/>}
    </div>
  );
}
