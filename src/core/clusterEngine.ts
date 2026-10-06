import { BiomechanicalCluster, ClusterId, SportId } from './types';

export const CLUSTERS: Record<ClusterId, BiomechanicalCluster> = {
  CLUSTER_A: {
    id: 'CLUSTER_A',
    name: 'Situazionali & Squadra',
    tagline: 'Agilità reattiva, COD & Prevenzione Traumi',
    colorToken: 'var(--md-sys-color-primary)',
    minBpmTarget: 130,
    sports: ['soccer', 'basketball', 'padel', 'volleyball'],
    biomechanicalPillars: [
      'Agilità reattiva e cambi di direzione multidirezionali (COD)',
      'Mobilità articolare caviglia & dissociazione bacino-anca',
      'Prevenzione rottura legamento crociato anteriore (LCA)',
      'Rinforzo sinergico adduttori/addome per prevenzione pubalgia',
    ],
    description:
      'Progettato per sport con continue accelerazioni, decelerazioni repentine e contatti. Compensa i deficit unilaterali e protegge le ginocchia nei tagli.',
    sampleRoutine: [
      {
        id: 'ex-a1',
        name: 'Drop Jumps a 90° con Stick Landing',
        durationSeconds: 300,
        sets: 4,
        reps: '6 salti x lato',
        biomechanicalFocus: 'Assorbimento eccentrico e allineamento anca-ginocchio-caviglia (Anti-Valgismo)',
        targetJoints: ['Ginocchio', 'Caviglia', 'Anca'],
        injuryPreventionTarget: 'Legamento Crociato Anteriore (LCA)',
        instructions: 'Scendi dal box da 30cm, atterra su una gamba ruotando di 90 gradi. Blocca il ginocchio senza farlo collassare verso l\'interno.',
      },
      {
        id: 'ex-a2',
        name: 'Copenhagen Plank Dinamico',
        durationSeconds: 360,
        sets: 3,
        reps: '30s per lato',
        biomechanicalFocus: 'Attivazione isolata e stabilizzazione del comparto adduttorio',
        targetJoints: ['Bacino', 'Sinfisi Pubica'],
        injuryPreventionTarget: 'Pubalgia cronica e sovraccarico inguinale',
        instructions: 'Piede superiore su panca, solleva il bacino creando una linea retta tra caviglia e spalla.',
      },
      {
        id: 'ex-a3',
        name: 'Dorsi-flessione Caviglia al Muro con Sovraccarico',
        durationSeconds: 240,
        sets: 3,
        reps: '10 rep con stop 3s',
        biomechanicalFocus: 'Range of Motion (ROM) tibio-tarsico e stiffness tendinea',
        targetJoints: ['Articolazione Tibio-Tarsica'],
        injuryPreventionTarget: 'Distorsioni recidive di caviglia & tendinite rotulea',
        instructions: 'Piede a 10cm dalla parete, spingi il ginocchio oltre la punta dell\'alluce senza alzare il tallone.',
      },
      {
        id: 'ex-a4',
        name: 'Single-Leg Skater Bounds con Resisted Band',
        durationSeconds: 420,
        sets: 4,
        reps: '8 balzi controllati',
        biomechanicalFocus: 'Potenza laterale e decelerazione elastica',
        targetJoints: ['Anca', 'Gluteo Medio'],
        injuryPreventionTarget: 'Instabilità laterale del ginocchio',
        instructions: 'Spinta esplosiva laterale, ammortizza piegando caviglia, ginocchio e anca contemporaneamente.',
      },
    ],
  },

  CLUSTER_B: {
    id: 'CLUSTER_B',
    name: 'Forza & Skill',
    tagline: 'Stabilità Scapolare, Cuffia Rotatori & Bracing',
    colorToken: '#835400',
    minBpmTarget: 120,
    sports: ['gym', 'calisthenics', 'powerlifting'],
    biomechanicalPillars: [
      'Depressione e controllo dinamico del ritmo scapolo-omerale',
      'Salute integrata della cuffia dei rotatori e tendine bicipitale',
      'Pressione intra-addominale (IAP) e bracing in catena chiusa',
      'Compressione hollow body per transfer di forza spinale',
    ],
    description:
      'Ideale per atleti che muovono carichi pesanti o il proprio corpo nello spazio. Protegge colonna e spalle preservando la longevità articolare.',
    sampleRoutine: [
      {
        id: 'ex-b1',
        name: 'Powell Raise su Panca Inclinata',
        durationSeconds: 360,
        sets: 4,
        reps: '12 rep x braccio',
        biomechanicalFocus: 'Ipertrofia e attivazione sottospinato & piccolo rotondo',
        targetJoints: ['Articolazione Gleno-Omerale'],
        injuryPreventionTarget: 'Sindrome da impingement subacromiale',
        instructions: 'Sdraiati sul fianco a 30°, solleva il manubrio dal pavimento fin sopra la spalla con gomito bloccato.',
      },
      {
        id: 'ex-b2',
        name: 'Trap 3 Raise al Cavo / Panca',
        durationSeconds: 300,
        sets: 3,
        reps: '10 rep con fermo 2s',
        biomechanicalFocus: 'Attivazione trapezio inferiore e rotazione verso l\'alto della scapola',
        targetJoints: ['Complesso Scapolare'],
        injuryPreventionTarget: 'Discinesia scapolare e dolore cervicale',
        instructions: 'Busto a 45°, pollici ruotati verso il soffitto, eleva le braccia a Y concentrandoti sulla parte bassa delle scapole.',
      },
      {
        id: 'ex-b3',
        name: 'Hollow Body Hold con Diaframma Espanso',
        durationSeconds: 360,
        sets: 4,
        reps: '45s tenuta isometrica',
        biomechanicalFocus: 'Bracing anti-estensione e connessione cingolo pelvico-toracico',
        targetJoints: ['Colonna Lombare', 'Core Anteriore'],
        injuryPreventionTarget: 'Ernie discali e compenso lordotico sotto carico',
        instructions: 'Schiaccia la zona lombare a terra, estendi gambe e braccia, respira senza far staccare la schiena dal pavimento.',
      },
      {
        id: 'ex-b4',
        name: 'Wall Angel con Blocco Lombare',
        durationSeconds: 240,
        sets: 3,
        reps: '12 scorrimenti lenti',
        biomechanicalFocus: 'Mobilità toracica in estensione e depressione scapolare attiva',
        targetJoints: ['Rachide Toracico', 'Cingolo Scapolare'],
        injuryPreventionTarget: 'Cifosi posturale da panca piana & sovraccarico del capo lungo del bicipite',
        instructions: 'Schiena, testa e gomiti a contatto col muro. Fai scorrere le braccia verso l\'alto senza staccare il dorso.',
      },
    ],
  },

  CLUSTER_C: {
    id: 'CLUSTER_C',
    name: 'Endurance & Ciclici',
    tagline: 'Catena Posteriore, Mobilità Diaframma & Tendine d\'Achille',
    colorToken: '#006590',
    minBpmTarget: 135,
    sports: ['running', 'cycling', 'swimming'],
    biomechanicalPillars: [
      'Prevenzione lesioni ischiocrurali a secco (Nordic eccentrico)',
      'Rigidità elastica (Stiffness) del tendine d\'Achille e fascia plantare',
      'Mobilità diaframmatica e decompressione della gabbia toracica',
      'Forza del gluteo medio per evitare la caduta del bacino in corsa',
    ],
    description:
      'Ottimizzato per atleti di resistenza. Riduce l\'usura da gesti ripetitivi ad alto volume e converte l\'energia elastica in efficienza di passo o pedalata.',
    sampleRoutine: [
      {
        id: 'ex-c1',
        name: 'Nordic Hamstring Curl Eccentrico',
        durationSeconds: 360,
        sets: 4,
        reps: '5 rep a cadenza 5-0-0',
        biomechanicalFocus: 'Allungamento e rinforzo eccentrico degli ischiocrurali',
        targetJoints: ['Ginocchio Posteriore', 'Bacino'],
        injuryPreventionTarget: 'Strappi muscolari bicipite femorale e tendinite rotulea',
        instructions: 'Caviglie bloccate, lascia cadere il busto in avanti il più lentamente possibile prima di attutire con le mani.',
      },
      {
        id: 'ex-c2',
        name: 'Isometric Pogo Hops per Stiffness Tendinea',
        durationSeconds: 300,
        sets: 4,
        reps: '3 x 30s di rimbalzi elastici',
        biomechanicalFocus: 'Stiffness del complesso gastrocnemio-tendine d\'Achille',
        targetJoints: ['Complesso Caviglia-Piede'],
        injuryPreventionTarget: 'Tendinopatia achillea e fascite plantare',
        instructions: 'Rimbalzi continui sull\'avampiede senza piegare il ginocchio. Il contatto col suolo deve essere rapido e scattante come una molla.',
      },
      {
        id: 'ex-c3',
        name: 'Single Leg Glute Bridge su Rialzo',
        durationSeconds: 300,
        sets: 3,
        reps: '12 rep x gamba con fermo 2s',
        biomechanicalFocus: 'Estensione pura dell\'anca ed eliminazione del collasso pelvico (Segno di Trendelenburg)',
        targetJoints: ['Anca', 'Glutei'],
        injuryPreventionTarget: 'Sindrome della bandelletta ileotibiale',
        instructions: 'Piede su box, spingi sul tallone sollevando il bacino fino al totale allineamento femore-busto.',
      },
      {
        id: 'ex-c4',
        name: 'Respirazione Diaframmatica 90/90 con Blocco Costale',
        durationSeconds: 300,
        sets: 3,
        reps: '8 cicli respiratori profondi',
        biomechanicalFocus: 'Decompressione della gabbia toracica ed espansione costale posteriore',
        targetJoints: ['Diaframma', 'Rachide Toracico'],
        injuryPreventionTarget: 'Contratture respiratorie e rigidità lombare da ciclismo prolungato',
        instructions: 'Gambe su sedia a 90°, espira completamente finché le costole scendono, mantieni 5s prima di inspirare col naso nel dorso.',
      },
    ],
  },

  CLUSTER_D: {
    id: 'CLUSTER_D',
    name: 'Combat & Reattività',
    tagline: 'Potenza Rotazionale, Collo Isometrico & Buffer Lattacido',
    colorToken: '#9C4146',
    minBpmTarget: 140,
    sports: ['boxing', 'mma', 'bjj'],
    biomechanicalPillars: [
      'Trasferimento di forza rotazionale da caviglia/anca al pugno/presa',
      'Forza isometrica del collo per dispersione degli impatti cranici',
      'Decompressione e mobilità della cerniera toraco-lombare',
      'Capacità di recupero rapido dallo stress anaerobico lattacido',
    ],
    description:
      'Formulato per sport da combattimento e arti marziali. Aumenta la resistenza alle decelerazioni da impatto e fortifica il tronco contro le sottomissioni.',
    sampleRoutine: [
      {
        id: 'ex-d1',
        name: 'Landmine Rotational Punch & Decelerate',
        durationSeconds: 360,
        sets: 4,
        reps: '8 rep x braccio esplosive',
        biomechanicalFocus: 'Catena cinetica spirale: spinta del piede, rotazione d\'anca e blocco del core',
        targetJoints: ['Articolazione Anca', 'Torace', 'Spalla'],
        injuryPreventionTarget: 'Torsioni anomale della colonna lombare',
        instructions: 'Inizia caricando l\'anca posteriore, esplodi ruotando il perno del piede ed estendendo il bilanciere come un diretto.',
      },
      {
        id: 'ex-d2',
        name: 'Isometria Collo a 4 Direzioni con Banda Elastica',
        durationSeconds: 300,
        sets: 3,
        reps: '20s x direzione (Anteriore, Posteriore, Lati)',
        biomechanicalFocus: 'Ipertrofia e rigidità dei muscoli sternocleidomastoideo e trapezio superiore',
        targetJoints: ['Rachide Cervicale'],
        injuryPreventionTarget: 'Colpi di frusta, traumi cranici da KO e stress articolare da ghigliottine',
        instructions: 'Banda intorno alla fronte ancorata a un punto fisso, mantieni la testa neutra resistendo alla trazione senza oscillare.',
      },
      {
        id: 'ex-d3',
        name: 'Sprawl to Reactive Hurdle Hop',
        durationSeconds: 420,
        sets: 5,
        reps: '6 ripetizioni max intensità',
        biomechanicalFocus: 'Recupero pliometrico e risposta lattacida immediata',
        targetJoints: ['Catena Anteriore e Posteriore Integrata'],
        injuryPreventionTarget: 'Calo di reattività per esaurimento glicolitico nei round finali',
        instructions: 'Getta le gambe indietro in sprawl da difesa, rialzati in scatto e salta un ostacolo atterrando in guardia pronta.',
      },
      {
        id: 'ex-d4',
        name: 'Bretzel Stretch Toracico con Rotazione Guidata',
        durationSeconds: 300,
        sets: 3,
        reps: '6 respiri x lato',
        biomechanicalFocus: 'Dissociazione simultanea tra cintura scapolare e cintura pelvica',
        targetJoints: ['Rachide Toracico', 'Flessori dell\'Anca'],
        injuryPreventionTarget: 'Blocco faccette articolari da posizioni di guardia e lotta a terra',
        instructions: 'Sdraiato sul fianco, tieni il ginocchio superiore a terra con una mano e afferra il piede inferiore con l\'altra, ruotando il petto verso l\'alto.',
      },
    ],
  },
};

export const SPORT_TO_CLUSTER: Record<SportId, ClusterId> = {
  soccer: 'CLUSTER_A',
  basketball: 'CLUSTER_A',
  padel: 'CLUSTER_A',
  volleyball: 'CLUSTER_A',

  gym: 'CLUSTER_B',
  calisthenics: 'CLUSTER_B',
  powerlifting: 'CLUSTER_B',

  running: 'CLUSTER_C',
  cycling: 'CLUSTER_C',
  swimming: 'CLUSTER_C',

  boxing: 'CLUSTER_D',
  mma: 'CLUSTER_D',
  bjj: 'CLUSTER_D',
};

export const SPORT_LABELS: Record<SportId, { name: string; icon: string }> = {
  soccer: { name: 'Calcio', icon: '⚽' },
  basketball: { name: 'Basket', icon: '🏀' },
  padel: { name: 'Padel', icon: '🎾' },
  volleyball: { name: 'Volley', icon: '🏐' },

  gym: { name: 'Palestra', icon: '🏋️' },
  calisthenics: { name: 'Calisthenics', icon: '🤸' },
  powerlifting: { name: 'Powerlifting', icon: '🧱' },

  running: { name: 'Corsa', icon: '🏃' },
  cycling: { name: 'Ciclismo', icon: '🚴' },
  swimming: { name: 'Nuoto', icon: '🏊' },

  boxing: { name: 'Boxe', icon: '🥊' },
  mma: { name: 'MMA', icon: '🥋' },
  bjj: { name: 'BJJ', icon: '🤼' },
};

export class ClusterEngine {
  static getCluster(clusterId: ClusterId): BiomechanicalCluster {
    return CLUSTERS[clusterId];
  }

  static getClusterForSport(sportId: SportId): BiomechanicalCluster {
    const clusterId = SPORT_TO_CLUSTER[sportId] || 'CLUSTER_A';
    return CLUSTERS[clusterId];
  }

  static getAllClusters(): BiomechanicalCluster[] {
    return Object.values(CLUSTERS);
  }

  static calculateEstimatedSessionTime(clusterId: ClusterId): number {
    const cluster = this.getCluster(clusterId);
    const totalSeconds = cluster.sampleRoutine.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    return Math.round(totalSeconds / 60); // In minutes (typically 20-30 min)
  }
}
