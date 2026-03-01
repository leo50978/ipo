import HeaderComponent from './header.js';
import CvCtaFooterComponent from './cvCtaFooter.js';
import { initAuth } from './auth.js';
import { initAccountPanel } from './accountPanel.js';
import { initCvAccessFlow } from './cvAccessFlow.js';
import { initDepositFlow } from './depositFlow.js';

const THEMES = {
  atlas: {
    pageBg: 'linear-gradient(180deg, #eef4ff 0%, #f8fbff 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#f5f9ff',
    line: '#dbe7ff',
    accent: '#2563eb',
    accentStrong: '#1d4ed8',
    accentSoft: '#edf4ff',
    ink: '#102a56',
    muted: '#5c6a83',
    texture: 'grid',
    glowA: 'rgba(37, 99, 235, 0.16)',
    glowB: 'rgba(14, 165, 233, 0.12)'
  },
  ledger: {
    pageBg: 'linear-gradient(180deg, #f2f5ff 0%, #f9fbff 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#eef2ff',
    line: '#d9e0ff',
    accent: '#4f46e5',
    accentStrong: '#3730a3',
    accentSoft: '#eef2ff',
    ink: '#22215d',
    muted: '#61648f',
    texture: 'beams',
    glowA: 'rgba(79, 70, 229, 0.15)',
    glowB: 'rgba(99, 102, 241, 0.10)'
  },
  mint: {
    pageBg: 'linear-gradient(180deg, #effaf8 0%, #f6fffd 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#effcf8',
    line: '#cdeee7',
    accent: '#0f766e',
    accentStrong: '#115e59',
    accentSoft: '#e8fbf8',
    ink: '#123b47',
    muted: '#5c6f79',
    texture: 'dots',
    glowA: 'rgba(15, 118, 110, 0.14)',
    glowB: 'rgba(20, 184, 166, 0.10)'
  },
  plum: {
    pageBg: 'linear-gradient(180deg, #fbf7ff 0%, #fdfbff 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#f7f2ff',
    line: '#eadbff',
    accent: '#7c3aed',
    accentStrong: '#6d28d9',
    accentSoft: '#f5efff',
    ink: '#35225d',
    muted: '#675c82',
    texture: 'mesh',
    glowA: 'rgba(124, 58, 237, 0.13)',
    glowB: 'rgba(168, 85, 247, 0.10)'
  },
  studio: {
    pageBg: 'linear-gradient(180deg, #fffaf3 0%, #fffcf7 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#fff6ea',
    line: '#f6dfbd',
    accent: '#c2410c',
    accentStrong: '#9a3412',
    accentSoft: '#fff3e6',
    ink: '#40210d',
    muted: '#75614c',
    texture: 'bands',
    glowA: 'rgba(194, 65, 12, 0.14)',
    glowB: 'rgba(251, 146, 60, 0.10)'
  },
  method: {
    pageBg: 'linear-gradient(180deg, #f4fff9 0%, #fbfffd 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#f0fff7',
    line: '#d2f3df',
    accent: '#15803d',
    accentStrong: '#166534',
    accentSoft: '#ecfdf3',
    ink: '#163d2b',
    muted: '#5c7365',
    texture: 'grid',
    glowA: 'rgba(21, 128, 61, 0.14)',
    glowB: 'rgba(16, 185, 129, 0.10)'
  },
  ember: {
    pageBg: 'linear-gradient(180deg, #fff8f4 0%, #fffdfb 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#fff2e9',
    line: '#ffd9bf',
    accent: '#ea580c',
    accentStrong: '#c2410c',
    accentSoft: '#fff2e8',
    ink: '#441b08',
    muted: '#7a624d',
    texture: 'dots',
    glowA: 'rgba(234, 88, 12, 0.14)',
    glowB: 'rgba(251, 146, 60, 0.10)'
  },
  cobalt: {
    pageBg: 'linear-gradient(180deg, #f1f6ff 0%, #f9fbff 38%, #ffffff 100%)',
    panel: '#ffffff',
    panelAlt: '#edf4ff',
    line: '#d9e8ff',
    accent: '#2563eb',
    accentStrong: '#1e40af',
    accentSoft: '#eef4ff',
    ink: '#16315e',
    muted: '#5d6c84',
    texture: 'mesh',
    glowA: 'rgba(37, 99, 235, 0.16)',
    glowB: 'rgba(59, 130, 246, 0.10)'
  }
};

const PAGE_CONFIGS = {
  ressources: {
    title: 'Ressources CV | Hiprofil',
    theme: THEMES.atlas,
    hero: {
      variant: 'split',
      eyebrow: 'Bibliotheque de terrain',
      title: 'Des ressources construites autour des vraies regles de lecture d un CV.',
      copy: 'La structure suit les reperes les plus solides: un premier scan en quelques secondes, des titres standards, une longueur qui reste defendable et des preuves plus visibles que les adjectifs.',
      actions: [
        { label: 'Commencer mon CV', kind: 'cv', tone: 'primary' },
        { label: 'Recevoir les nouveaux guides', kind: 'signup', tone: 'secondary' }
      ],
      metrics: [
        ['7 sec', 'premier balayage visuel a gagner'],
        ['1 a 2 pages', 'selon profondeur du parcours'],
        ['2 a 5 puces', 'par mission vraiment utile']
      ],
      cards: [
        {
          eyebrow: 'ATS propre',
          title: 'Titres lisibles et sections attendues',
          copy: 'Chaque fiche rappelle quoi nommer, quoi supprimer et comment rester sur une trame lisible par un humain comme par un ATS.'
        },
        {
          eyebrow: 'Preuves',
          title: 'Resultats, volume, impact et contexte',
          copy: 'Les guides poussent a quantifier, dater, nommer le scope et montrer ce qui a vraiment change.'
        },
        {
          eyebrow: 'Sortie',
          title: 'Une vraie passe finale avant PDF',
          copy: 'Controle de densite, coherence des dates, coupes de ligne, ordre des rubriques et relecture de surface.'
        }
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Parcours utiles',
          title: 'Des chemins de lecture selon le probleme a resoudre.',
          copy: 'Chaque parcours part d une question concrete: clarifier la cible, nettoyer la forme, renforcer les preuves ou finaliser le document.'
        },
        columns: 4,
        items: [
          {
            eyebrow: 'Demarrer',
            title: 'Poser une base ATS saine',
            copy: 'Verifier la colonne unique, les intitul es attendus et l ordre chronologique avant de travailler le style.'
          },
          {
            eyebrow: 'Cibler',
            title: 'Adapter le CV a une offre',
            copy: 'Extraire les mots cles du poste, reduire le bruit et faire remonter les experiences qui repondent vraiment au besoin.'
          },
          {
            eyebrow: 'Prouver',
            title: 'Reecrire les experiences',
            copy: 'Passer de listes de taches a des puces orient ees action, volume, resultat et impact.'
          },
          {
            eyebrow: 'Finaliser',
            title: 'Faire une derniere passe',
            copy: 'Traquer les doublons, la casse de ligne, la surcharge et les points qui ralentissent la lecture.'
          }
        ]
      },
      {
        type: 'table',
        surface: 'soft',
        intro: {
          eyebrow: 'Bibliotheque active',
          title: 'Le contenu est classe par livrable, pas par jargon.',
          copy: 'Vous trouvez vite le bon format selon le besoin: checklist courte, methode complete, exemple compare ou fiche de correction.'
        },
        columns: ['Format', 'Sujet', 'Ce que vous repartez avec'],
        rows: [
          ['Checklist', 'Audit ATS en 5 points', 'Une passe rapide sur les titres, la structure, les mots cles et les zones que les parseurs lisent mal.'],
          ['Guide', 'Resume et accroche', 'Une methode pour tenir en 3 a 5 lignes avec un message utile et non promotionnel.'],
          ['Modele', 'Experience a fort impact', 'Une trame simple: contexte, action, resultat, outil ou volume.'],
          ['Comparatif', '1 page ou 2 pages', 'Une regle de decision selon seniorite, densite et lisibilite de la premiere page.'],
          ['Tutoriel', 'Retours a la ligne', 'Les ajustements qui evitent une impression de brouillon au moment de l export PDF.']
        ]
      },
      {
        type: 'band',
        surface: 'accent',
        intro: {
          eyebrow: 'Check final',
          title: 'La sortie propre se joue souvent sur trois derniers controles.',
          copy: 'La page rappelle les points que les candidats laissent trop souvent au hasard juste avant l envoi.'
        },
        points: [
          'Verifier que la premiere page expose deja la cible, le niveau et les preuves principales.',
          'Confirmer que le vocabulaire du poste apparait sans forcer ni truffer le document.',
          'Relire hors contexte pour voir si un recruteur comprend votre fil rouge sans effort.'
        ],
        chips: ['Chronologique', 'Titres standards', 'PDF relu', 'Dates coherentes']
      }
    ]
  },
  tarifs: {
    title: 'Tarifs | Hiprofil',
    theme: THEMES.ledger,
    hero: {
      variant: 'command',
      eyebrow: 'Tarifs clairs',
      title: 'Un prix unique et lisible: 500 HTG pour un CV professionnel.',
      copy: 'Le service est simple: vous pouvez construire votre CV librement, puis un depot fixe de 500 GDES debloque le telechargement final du document.',
      actions: [
        { label: 'Commencer mon CV', kind: 'cv', tone: 'primary' },
        { label: 'Creer un compte', kind: 'signup', tone: 'secondary' }
      ],
      metrics: [
        ['500 HTG', 'prix fixe par CV'],
        ['1 depot', 'pour debloquer l export'],
        ['1 service', 'sans paliers compliques']
      ],
      panel: {
        eyebrow: 'Ce que couvre le tarif',
        title: 'Le montant est fixe et le perimetre est clair.',
        copy: 'Le paiement sert a debloquer le telechargement du CV final, sans formule mensuelle ni niveaux caches.',
        points: [
          'Acces au builder pour preparer le CV',
          'Previsualisation pour verifier le rendu',
          'Export PDF une fois le depot approuve',
          'Un seul tarif pour un usage simple et direct'
        ]
      }
    },
    sections: [
      {
        type: 'pricing',
        intro: {
          eyebrow: 'Prix du service',
          title: 'Un seul prix: 500 HTG par CV.',
          copy: 'Pas de plan gratuit, pas d abonnement, pas de formule cachee. Le prix du service est fixe et correspond au telechargement d un CV professionnel.'
        },
        plans: [
          {
            name: 'CV professionnel',
            price: '500 HTG',
            cadence: 'par CV',
            tone: 'accent',
            badge: 'Prix unique',
            summary: 'Vous construisez votre CV, puis le depot de 500 GDES debloque le telechargement final.',
            points: [
              'Builder accessible pour preparer le contenu',
              'Previsualisation du CV avant export',
              'Telechargement PDF apres depot approuve',
              'Tarif fixe: 500 HTG pour ce CV'
            ],
            cta: { label: 'Commencer mon CV', kind: 'cv', tone: 'primary' }
          }
        ]
      },
      {
        type: 'table',
        surface: 'soft',
        intro: {
          eyebrow: 'Ce qui est inclus',
          title: 'Le tarif de 500 HTG couvre un perimetre simple.',
          copy: 'Le service repose sur un usage clair: construire, verifier, puis telecharger le CV final apres validation du depot.'
        },
        columns: ['Element', 'Details'],
        rows: [
          ['Prix', '500 HTG par CV professionnel'],
          ['Mode de paiement', 'Depot fixe de 500 GDES avant telechargement'],
          ['Builder', 'Accessible pour preparer et corriger le CV'],
          ['Export PDF', 'Debloque une fois le depot approuve'],
          ['Abonnement', 'Aucun abonnement mensuel']
        ]
      },
      {
        type: 'faq',
        intro: {
          eyebrow: 'Questions frequentes',
          title: 'Les conditions du tarif sont annoncees sans ambiguite.',
          copy: 'Le but est que le prix et le mode de paiement soient compris en quelques secondes.'
        },
        items: [
          {
            q: 'Quel est le prix du service ?',
            a: 'Le prix est fixe: 500 HTG pour un CV professionnel.'
          },
          {
            q: 'Dois-je payer avant de commencer a construire le CV ?',
            a: 'Non. Vous pouvez construire votre CV librement, puis faire le depot quand vous voulez telecharger le document final.'
          },
          {
            q: 'Que debloque le depot de 500 GDES ?',
            a: 'Le depot approuve debloque le telechargement PDF du CV final.'
          },
          {
            q: 'Y a t il des frais caches ?',
            a: 'Non. Le prix annonce pour ce service est 500 HTG pour un CV.'
          }
        ]
      }
    ]
  },
  contact: {
    title: 'Contact | Hiprofil',
    theme: THEMES.mint,
    hero: {
      variant: 'directory',
      eyebrow: 'Contact utile',
      title: 'Chaque canal a un role clair pour eviter les allers retours.',
      copy: 'La page trie les demandes en trois voies: support produit, besoins commerciaux et partenariats. Le but est d orienter vite et de demander les bonnes informations des le premier message.',
      actions: [
        { label: 'Ouvrir un echange', kind: 'signup', tone: 'primary' },
        { label: 'Ouvrir le builder', kind: 'cv', tone: 'secondary' }
      ],
      cards: [
        {
          eyebrow: 'Support produit',
          title: 'Builder, previsualisation, export PDF',
          copy: 'Capture, etape concernee et comportement attendu suffisent pour traiter vite.',
          meta: 'Cible: sous 1 jour ouvre'
        },
        {
          eyebrow: 'Commercial',
          title: 'Besoin B2B, cadrage et devis',
          copy: 'Volume, type de profils et objectif de deploiement permettent de qualifier la demande.',
          meta: 'Premier retour: sous 24 h'
        },
        {
          eyebrow: 'Partenariats',
          title: 'Contenu, affiliation, presse, co marketing',
          copy: 'Audience, contexte et calendrier donnent le bon niveau de priorite des le depart.',
          meta: 'Reponse: sous 2 jours ouvres'
        }
      ]
    },
    sections: [
      {
        type: 'table',
        intro: {
          eyebrow: 'Orientation',
          title: 'Le bon canal depend surtout du contexte fourni.',
          copy: 'La demande est plus vite trait ee quand elle arrive au bon endroit avec les bons details.'
        },
        columns: ['Votre besoin', 'Canal recommande', 'A preparer'],
        rows: [
          ['Question sur une mise en page ou un export', 'Support produit', 'Capture, navigateur, etape du flux'],
          ['Besoin de deploiement pour une promo ou une equipe', 'Commercial', 'Volume, calendrier, type de profils'],
          ['Demande de contenu ou operation conjointe', 'Partenariats', 'Audience, format, objectif'],
          ['Programme d affiliation', 'Partenariats', 'Canal de diffusion et audience'],
          ['Question sur le compte ou la facturation', 'Support produit', 'Email du compte et contexte']
        ]
      },
      {
        type: 'duo',
        surface: 'soft',
        intro: {
          eyebrow: 'Avant de nous ecrire',
          title: 'Un message bien prepare reduit le temps de traitement.',
          copy: 'La plupart des demandes se debloquent avec quelques pieces de contexte simples.'
        },
        left: {
          eyebrow: 'Temps de reponse',
          title: 'Des fenetres de retour annoncees clairement.',
          copy: 'Le support priorise la reproductibilite du probleme, le commercial la faisabilite du deploiement, les partenariats la compatibilite editoriale.',
          bullets: [
            'Support: demande testable et actionnable',
            'Commercial: perimetre et volume des le premier message',
            'Partenariats: audience et format explicites'
          ]
        },
        right: {
          eyebrow: 'Checklist',
          title: 'Ce qui aide le plus a la premiere lecture',
          items: [
            'Le lien ou la page concernee',
            'La question exacte a trancher',
            'Le bloc qui vous freine reellement',
            'Le niveau d urgence si une candidature part bientot'
          ]
        }
      }
    ]
  },
  blog: {
    title: 'Blog | Hiprofil',
    theme: THEMES.plum,
    hero: {
      variant: 'spotlight',
      eyebrow: 'Analyses et methodes',
      title: 'Un blog qui traite de lisibilite, de preuves et de structure, pas de recettes floues.',
      copy: 'Les angles sont calibres sur les vrais points de friction des CV: densite excessive, sections mal nommees, experiences sans resultats mesurables et erreurs qui cassent la lecture.',
      actions: [
        { label: 'Recevoir la newsletter', kind: 'signup', tone: 'primary' },
        { label: 'Commencer mon CV', kind: 'cv', tone: 'secondary' }
      ],
      feature: {
        eyebrow: 'Angle du moment',
        title: 'Pourquoi un CV trop dense parait plus faible, meme quand le fond est bon',
        copy: 'Une lecture des signaux visuels que les recruteurs interpretent vite: blocs trop longs, manque de respirations, titres noy es et resultats introuvables.',
        meta: 'Edition fevrier 2026 | 6 min'
      },
      aside: [
        'Lecture ATS et mots cles',
        'Choix entre 1 page et 2 pages',
        'Reecriture des experiences',
        'Derniere passe avant PDF'
      ]
    },
    sections: [
      {
        type: 'cards',
        surface: 'soft',
        intro: {
          eyebrow: 'Series editoriales',
          title: 'Chaque serie attaque un probleme precis.',
          copy: 'Le lecteur doit pouvoir trouver un angle utile sans parcourir dix articles generalistes.'
        },
        columns: 3,
        items: [
          {
            eyebrow: 'Redaction',
            title: 'Rendre le resume utile en 3 a 5 lignes',
            copy: 'Comment poser une direction lisible sans s enfermer dans un autoportrait creux.'
          },
          {
            eyebrow: 'Structure',
            title: 'Garder des experiences courtes mais defendables',
            copy: 'Quand couper, quoi grouper et comment faire remonter ce qui porte vraiment la candidature.'
          },
          {
            eyebrow: 'ATS',
            title: 'Les elements que les parseurs lisent mal',
            copy: 'Colonnes, tableaux, intitul es creatifs et autres details qui peuvent casser la lecture machine.'
          },
          {
            eyebrow: 'Conseils RH',
            title: 'Ce qui se voit en quelques secondes',
            copy: 'Les indices qui donnent vite une impression de clarte, de seniorite ou de confusion.'
          },
          {
            eyebrow: 'Exemples',
            title: 'Des avant apres vraiment comparables',
            copy: 'Montrer ce que change une meilleure hi erarchie au lieu de se contenter d un joli visuel.'
          },
          {
            eyebrow: 'Finition',
            title: 'La passe finale avant envoi',
            copy: 'La petite routine qui evit e les erreurs les plus visibles au moment du PDF.'
          }
        ]
      },
      {
        type: 'band',
        intro: {
          eyebrow: 'Promesse editoriale',
          title: 'Peu de bruit, des points exploitables vite.',
          copy: 'Le format reste court, tranche et orient e execution pour que chaque lecture se transforme en correction concrete.'
        },
        points: [
          'Une analyse utile par semaine, centree sur un vrai arbitrage de fond.',
          'Une checklist courte pour passer de la lecture a la correction.',
          'Un ton editorial net: pas de pseudo hack, pas de promesse magique.'
        ],
        chips: ['Hebdo', 'Angles nets', 'Checklists', 'Sans spam']
      }
    ]
  },
  'createur-cv': {
    title: 'Createur de CV | Hiprofil',
    theme: THEMES.atlas,
    hero: {
      variant: 'command',
      eyebrow: 'Le produit',
      title: 'Un createur de CV pense pour sortir un document clair, pas pour empiler des gadgets.',
      copy: 'Le moteur est centre sur ce qui aide vraiment: sections attendues, ordre chronologique, verification visuelle et export final propre. La forme reste au service de la lecture.',
      actions: [
        { label: 'Lancer le builder', kind: 'cv', tone: 'primary' },
        { label: 'Creer un compte', kind: 'signup', tone: 'secondary' }
      ],
      metrics: [
        ['1 colonne', 'pour garder une lecture stable'],
        ['4 etapes', 'de la saisie au PDF'],
        ['0 effet gratuit', 'qui brouille le fond']
      ],
      panel: {
        eyebrow: 'Ce que le builder verrouille',
        title: 'Une trame qui reste defendable.',
        copy: 'Le produit aide a conserver une base propre avant toute finition: intitul es standards, rythme de lecture sain et contenu priorise.',
        points: [
          'Sections lisibles et facilement reconnues',
          'Experience recentee en premier',
          'Zone competences courte et utile',
          'Previsualisation pour voir la densite reelle'
        ]
      }
    },
    sections: [
      {
        type: 'steps',
        intro: {
          eyebrow: 'Flux de travail',
          title: 'Le parcours suit l ordre logique d une vraie production.',
          copy: 'On ne saute pas d un detail visuel a un autre. Le moteur fait avancer dans le bon ordre.'
        },
        layout: 'grid',
        items: [
          {
            title: 'Definir la cible',
            copy: 'Choisir le poste vise et le niveau attendu avant de remplir les rubriques.',
            meta: 'Etape 1'
          },
          {
            title: 'Saisir le contenu',
            copy: 'Remplir les blocs essentiels avec un ordre simple et un niveau de detail maitrise.',
            meta: 'Etape 2'
          },
          {
            title: 'Verifier la lecture',
            copy: 'Observer ce qui surcharge, se repete ou ralentit le regard dans la previsualisation.',
            meta: 'Etape 3'
          },
          {
            title: 'Exporter proprement',
            copy: 'Sortir un PDF presentable apres une derniere passe de coherence et de lisibilite.',
            meta: 'Etape 4'
          }
        ]
      },
      {
        type: 'duo',
        surface: 'soft',
        intro: {
          eyebrow: 'Perimetre',
          title: 'Le moteur aide a finaliser, il ne remplace pas le travail de fond.',
          copy: 'La promesse reste volontairement stricte pour garder un produit utile.'
        },
        left: {
          eyebrow: 'Concu pour',
          title: 'Rendre le CV plus clair plus vite',
          copy: 'Le produit sert surtout a structurer, clarifier et sortir une version presentable sans se perdre dans les reglages.',
          bullets: [
            'Produire une premiere version propre',
            'Reecrire sans casser la structure',
            'Comparer rapidement plusieurs variantes'
          ]
        },
        right: {
          eyebrow: 'Ne remplace pas',
          title: 'Le jugement sur le fond',
          items: [
            'La definition du poste vraiment cible',
            'La qualite des preuves que vous apportez',
            'Le travail de priorisation sur un parcours complexe',
            'Une relecture humaine exigeante quand le contexte le demande'
          ]
        }
      }
    ]
  },
  'centre-connaissances': {
    title: 'Centre de connaissances | Hiprofil',
    theme: THEMES.mint,
    hero: {
      variant: 'directory',
      eyebrow: 'Base de reference',
      title: 'Une base d aide rangee par probleme, pas un fourre tout de billets.',
      copy: 'Le contenu est classe comme un centre de resolution: comprendre la regle, corriger le bloc faible, arbitrer une structure, puis finaliser la sortie.',
      actions: [
        { label: 'Explorer les reperes', kind: 'signup', tone: 'primary' },
        { label: 'Commencer mon CV', kind: 'cv', tone: 'secondary' }
      ],
      cards: [
        {
          eyebrow: 'Comprendre',
          title: 'Les fondamentaux qui tiennent',
          copy: 'Longueur, ordre des rubriques, vocabulaire attendu et niveau de detail defendable.',
          meta: 'Base'
        },
        {
          eyebrow: 'Corriger',
          title: 'Les erreurs qui reviennent le plus',
          copy: 'Rubriques vides, titres flous, blocs trop denses, competences sans preuve.',
          meta: 'Correction'
        },
        {
          eyebrow: 'Finaliser',
          title: 'Le dernier controle',
          copy: 'PDF, coherence, premiere page, dates, orthographe et mise en avant des points forts.',
          meta: 'Sortie'
        }
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Rayons',
          title: 'Quatre entrees pour trouver vite la bonne reponse.',
          copy: 'Chaque rayon renvoie vers une famille de corrections et non vers un simple tas d articles.'
        },
        columns: 4,
        items: [
          {
            eyebrow: 'A',
            title: 'Longueur et lisibilite',
            copy: 'Choisir entre 1 page et 2 pages, couper proprement et donner la priorite a la premiere page.'
          },
          {
            eyebrow: 'B',
            title: 'Sections et intitul es',
            copy: 'Garder des titres standards et une architecture que les recruteurs reconnaissent instantanement.'
          },
          {
            eyebrow: 'C',
            title: 'Experiences et preuves',
            copy: 'Transformer des taches en preuves avec action, contexte, resultat et ordre logique.'
          },
          {
            eyebrow: 'D',
            title: 'Sortie et relecture',
            copy: 'Verifier le rendu, l orthographe, les dates et l impression generale avant diffusion.'
          }
        ]
      },
      {
        type: 'timeline',
        surface: 'soft',
        intro: {
          eyebrow: 'Mode d emploi',
          title: 'Le centre s utilise comme un circuit de resolution.',
          copy: 'La logique est simple: identifier le bloc faible, ouvrir la bonne regle, corriger, puis verifier le rendu final.'
        },
        items: [
          {
            title: 'Identifier le vrai point de friction',
            copy: 'Longueur, clarte, ordre, preuves ou finition: un seul angle a la fois.'
          },
          {
            title: 'Aller sur la fiche qui tranche',
            copy: 'Une bonne fiche doit vous aider a decider, pas seulement rappeler des banalites.'
          },
          {
            title: 'Appliquer une correction visible',
            copy: 'Reecrire, couper, renommer ou deplacer pour produire un effet net a l ecran.'
          },
          {
            title: 'Verifier dans le rendu final',
            copy: 'Le dernier juge reste la lecture globale du document, pas la theorie seule.'
          }
        ]
      },
      {
        type: 'band',
        intro: {
          eyebrow: 'Les plus consultes',
          title: 'Les questions qui reviennent le plus sont exposees d entree.',
          copy: 'Ces sujets couvrent la majorite des blocages quand un CV est deja rempli mais encore peu convaincant.'
        },
        chips: [
          'Quand une rubrique doit disparaitre',
          'Comment tenir sur 1 page',
          'Que faire d un parcours hybride',
          'Comment prouver une competence',
          'Que verifier avant le PDF'
        ]
      }
    ]
  },
  services: {
    title: 'Services | Hiprofil',
    theme: THEMES.studio,
    hero: {
      variant: 'split',
      eyebrow: 'Accompagnement cible',
      title: 'Des interventions courtes et concretes pour debloquer ce que le produit seul ne tranche pas.',
      copy: 'Les services portent sur les vrais points de friction: clarifier une cible, reordonner le document, reecrire les preuves ou faire une relecture finale exigeante.',
      actions: [
        { label: 'Discuter de mon besoin', kind: 'signup', tone: 'primary' },
        { label: 'Commencer mon CV', kind: 'cv', tone: 'secondary' }
      ],
      metrics: [
        ['48 h', 'pour un diagnostic express'],
        ['72 h', 'pour une relecture de sortie'],
        ['1 atelier', 'pour cadrer un besoin equipe']
      ],
      cards: [
        {
          eyebrow: 'Diagnostic',
          title: 'Voir vite ce qui bloque',
          copy: 'Identifier la faiblesse qui fait perdre de la force a l ensemble.'
        },
        {
          eyebrow: 'Reecriture',
          title: 'Rendre les preuves plus nettes',
          copy: 'Reserrer les rubriques et reformuler ce qui parait generique.'
        },
        {
          eyebrow: 'Validation',
          title: 'Sortir une version propre',
          copy: 'Faire la passe finale avant diffusion ou partage a un client.'
        }
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Formats disponibles',
          title: 'Des prestations courtes, chacune avec un livrable net.',
          copy: 'La page ne vend pas du flou. Chaque intervention annonce son objectif et sa sortie.'
        },
        columns: 2,
        items: [
          {
            eyebrow: '48 h',
            title: 'Diagnostic express',
            copy: 'Lecture rapide du CV, identification des risques et priorites de correction a traiter en premier.'
          },
          {
            eyebrow: '72 h',
            title: 'Relecture de sortie',
            copy: 'Controle du rendu final: coherence, densite, titres, dates, niveau de preuve et lisibilite globale.'
          },
          {
            eyebrow: '3 a 5 jours',
            title: 'Optimisation de structure',
            copy: 'Revoir l ordre des rubriques, l amplitude des experiences et le poids de chaque bloc.'
          },
          {
            eyebrow: 'Sur planning',
            title: 'Atelier equipe',
            copy: 'Cadrer une methode commune pour des promotions, cabinets ou collectifs.'
          }
        ]
      },
      {
        type: 'steps',
        surface: 'soft',
        intro: {
          eyebrow: 'Sequence de travail',
          title: 'Le deroulement reste volontairement simple.',
          copy: 'Moins d allers retours, plus de decisions utiles.'
        },
        layout: 'rail',
        items: [
          {
            title: 'Lecture de la version actuelle',
            copy: 'Comprendre le profil, la cible et la faiblesse qui casse la perception.'
          },
          {
            title: 'Priorisation',
            copy: 'Choisir les corrections qui changent vraiment la lecture au lieu de disperser l effort.'
          },
          {
            title: 'Correction ou cadrage',
            copy: 'Reecrire, couper, deplacer ou fixer un plan de reprise actionnable.'
          },
          {
            title: 'Validation finale',
            copy: 'Confirmer que la nouvelle version tient mieux la route au premier scan.'
          }
        ]
      },
      {
        type: 'band',
        intro: {
          eyebrow: 'Livrables',
          title: 'Ce que vous recevez doit pouvoir etre applique tout de suite.',
          copy: 'Le service est juge sur sa capacite a faire gagner du temps de correction reel.'
        },
        points: [
          'Un retour exploitable, structure par priorite.',
          'Des corrections proposes ou un plan de reprise tres concret.',
          'Une lecture finale centree sur l effet de la premiere page.'
        ]
      }
    ]
  },
  'conseils-rh': {
    title: 'Conseils RH par champ | Hiprofil',
    theme: THEMES.plum,
    hero: {
      variant: 'directory',
      eyebrow: 'Lecture recruteur',
      title: 'Des conseils attaches a chaque rubrique, avec une logique de scan reel.',
      copy: 'La page colle au comportement de lecture le plus courant: quelques secondes pour comprendre le metier, le niveau, la coherence du parcours et la presence de preuves.',
      actions: [
        { label: 'Creer un compte', kind: 'signup', tone: 'primary' },
        { label: 'Commencer mon CV', kind: 'cv', tone: 'secondary' }
      ],
      cards: [
        {
          eyebrow: 'Titre',
          title: 'Doit dire le metier sans ambiguite',
          copy: 'Un intitul e lisible vaut mieux qu une formule creative qui ralentit.',
          meta: 'Lecture immediate'
        },
        {
          eyebrow: 'Resume',
          title: 'Doit orienter sans survendre',
          copy: 'Trois a cinq lignes utiles, pas une liste d adjectifs abstraits.',
          meta: 'Contexte'
        },
        {
          eyebrow: 'Experience',
          title: 'Doit prouver le niveau',
          copy: 'Le lecteur cherche des faits, des resultats, des volumes, pas une accumulation de verbes vagues.',
          meta: 'Preuves'
        }
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Rubriques',
          title: 'Chaque bloc a un role different dans la decision.',
          copy: 'Le bon niveau de detail change selon la rubrique. Tout n a pas besoin du meme volume.'
        },
        columns: 3,
        items: [
          {
            eyebrow: '01',
            title: 'Titre ou metier',
            copy: 'Il doit etre lisible en une seconde et coherent avec le poste vise.'
          },
          {
            eyebrow: '02',
            title: 'Resume',
            copy: 'Il doit donner une direction et un niveau sans repeter le titre.'
          },
          {
            eyebrow: '03',
            title: 'Experiences',
            copy: 'Elles doivent porter la preuve principale de la candidature.'
          },
          {
            eyebrow: '04',
            title: 'Formation',
            copy: 'Elle prend plus ou moins de place selon seniorite et pertinence.'
          },
          {
            eyebrow: '05',
            title: 'Competences',
            copy: 'Elles doivent confirmer le positionnement, pas l elargir dans tous les sens.'
          }
        ]
      },
      {
        type: 'cards',
        surface: 'soft',
        intro: {
          eyebrow: 'Grille RH',
          title: 'Quatre questions structurent souvent la premiere impression.',
          copy: 'Ces points servent a evaluer un CV sans passer par une lecture ligne a ligne.'
        },
        columns: 2,
        items: [
          {
            eyebrow: 'Lisibilite',
            title: 'Je comprends vite ce que fait cette personne',
            copy: 'Si ce point ne passe pas, le reste est relu plus durement.'
          },
          {
            eyebrow: 'Cohesion',
            title: 'Les rubriques racontent la meme histoire',
            copy: 'Le titre, le resume et les experiences doivent pointer dans la meme direction.'
          },
          {
            eyebrow: 'Preuves',
            title: 'Le niveau revendique est observable',
            copy: 'Les experiences doivent montrer une execution, pas seulement des intentions.'
          },
          {
            eyebrow: 'Priorisation',
            title: 'Les bons elements apparaissent en premier',
            copy: 'Une bonne hi erarchie economise du temps de lecture et rassure plus vite.'
          }
        ]
      },
      {
        type: 'band',
        intro: {
          eyebrow: 'Signaux forts',
          title: 'Ce qui rassure vite un lecteur presse.',
          copy: 'La page insiste sur les indices qui se voient avant meme d entrer dans les details.'
        },
        points: [
          'Un titre de poste simple et defendable.',
          'Des dates coh erentes et faciles a suivre.',
          'Une premiere page qui montre deja les preuves majeures.'
        ]
      }
    ]
  },
  'exemples-cv': {
    title: 'Exemples de CV | Hiprofil',
    theme: THEMES.ledger,
    hero: {
      variant: 'spotlight',
      eyebrow: 'Cas concrets',
      title: 'Des exemples classes par contexte de candidature, avec la logique derriere chaque choix.',
      copy: 'Au lieu de montrer un simple rendu, la page explique pourquoi la structure fonctionne: ce qui monte en premier, ce qui est coupe, ce qui prouve vraiment le niveau.',
      actions: [
        { label: 'Commencer mon CV', kind: 'cv', tone: 'primary' },
        { label: 'Creer un compte', kind: 'signup', tone: 'secondary' }
      ],
      feature: {
        eyebrow: 'Exemple guide',
        title: 'Jeune diplome: une page nette, lisible et basee sur le potentiel prouve',
        copy: 'La logique ici est simple: faire ressortir les experiences les plus utiles, garder la formation visible, eviter le remplissage et conserver une lecture courte.',
        meta: 'Etude type | 1 page'
      },
      aside: [
        'Jeune diplome',
        'Profil polyvalent',
        'Manager',
        'Freelance ou missions'
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Galerie',
          title: 'Chaque cas repond a une tension differente.',
          copy: 'Le bon exemple depend surtout du contexte de candidature et du niveau de seniorite.'
        },
        columns: 3,
        items: [
          {
            eyebrow: 'Cas 1',
            title: 'Jeune diplome',
            copy: 'Faire tenir la cible, la formation et quelques preuves solides sur une page respirable.'
          },
          {
            eyebrow: 'Cas 2',
            title: 'Profil hybride',
            copy: 'Regrouper des experiences diverses sans diluer le metier cible.'
          },
          {
            eyebrow: 'Cas 3',
            title: 'Manager',
            copy: 'Faire remonter impact, perimetre et responsabilites avant les details secondaires.'
          },
          {
            eyebrow: 'Cas 4',
            title: 'Freelance',
            copy: 'Ordonner des missions multiples avec une vraie progression lisible.'
          },
          {
            eyebrow: 'Cas 5',
            title: 'Tech ou produit',
            copy: 'Nommer les outils sans les laisser devorer le document.'
          },
          {
            eyebrow: 'Cas 6',
            title: 'Reconversion',
            copy: 'Mettre les preuves transferables au centre et couper le hors sujet.'
          }
        ]
      },
      {
        type: 'duo',
        surface: 'soft',
        intro: {
          eyebrow: 'Avant / apres',
          title: 'La valeur d un exemple se voit dans l ecart entre deux versions.',
          copy: 'Le contraste le plus utile porte sur la hi erarchie et la vitesse de comprehension.'
        },
        left: {
          eyebrow: 'Avant',
          title: 'Une version qui fatigue vite',
          copy: 'Titre vague, experience trop longue, details secondaires trop visibles et aucun point saillant sur la premiere page.',
          bullets: [
            'Le lecteur cherche le metier cible',
            'Les preuves sont enterrees dans le texte',
            'Les rubriques n ont pas le bon poids'
          ]
        },
        right: {
          eyebrow: 'Apres',
          title: 'Une version qui se defend mieux',
          items: [
            'Titre plus net et meilleur cadrage du niveau',
            'Experiences raccourcies mais plus probantes',
            'Competences remises a leur juste place',
            'Premiere page qui expose deja le coeur du profil'
          ]
        }
      }
    ]
  },
  'guide-redaction-cv': {
    title: 'Guide de redaction CV | Hiprofil',
    theme: THEMES.method,
    hero: {
      variant: 'split',
      eyebrow: 'Methode complete',
      title: 'Une sequence de redaction qui suit le vrai ordre des decisions.',
      copy: 'Le guide part de la cible, passe par le titre et le resume, puis descend vers les experiences et la relecture finale. L objectif est d eviter les re ecritures sans fin.',
      actions: [
        { label: 'Commencer mon CV', kind: 'cv', tone: 'primary' },
        { label: 'Creer un compte', kind: 'signup', tone: 'secondary' }
      ],
      metrics: [
        ['3 a 5 lignes', 'pour un resume utile'],
        ['2 a 5 puces', 'par experience forte'],
        ['1 passe finale', 'avant tout envoi']
      ],
      cards: [
        {
          eyebrow: 'Regle 1',
          title: 'Nommer le poste vise',
          copy: 'Un CV sans cible claire oblige le lecteur a deviner trop de choses.'
        },
        {
          eyebrow: 'Regle 2',
          title: 'Prouver plus que qualifier',
          copy: 'Les faits, volumes et resultats tiennent mieux que les auto descriptions.'
        },
        {
          eyebrow: 'Regle 3',
          title: 'Relire sur le rendu final',
          copy: 'Le texte n est pas juge en brouillon mais sur sa version diffusee.'
        }
      ]
    },
    sections: [
      {
        type: 'steps',
        intro: {
          eyebrow: 'La methode',
          title: 'Six etapes, dans le bon ordre.',
          copy: 'La redaction va plus vite quand chaque bloc arrive au moment ou il devient utile.'
        },
        layout: 'grid',
        items: [
          {
            title: 'Clarifier la cible',
            copy: 'Definir le poste, le niveau et l angle principal avant d ecrire.',
            meta: '01'
          },
          {
            title: 'Poser un titre defendable',
            copy: 'Dire clairement ce que vous faites ou visez, sans chercher l originalite.',
            meta: '02'
          },
          {
            title: 'Rediger un resume court',
            copy: 'Trois a cinq lignes qui orientent la lecture et plantent le contexte.',
            meta: '03'
          },
          {
            title: 'Structurer les experiences',
            copy: 'Contexte, action, resultat, puis seulement les details de methode.',
            meta: '04'
          },
          {
            title: 'Trier les competences',
            copy: 'Garder ce qui confirme la cible et retirer les listes trop generiques.',
            meta: '05'
          },
          {
            title: 'Faire le controle final',
            copy: 'Verifier densite, dates, orthographe, coupe de ligne et force de la premiere page.',
            meta: '06'
          }
        ]
      },
      {
        type: 'cards',
        surface: 'soft',
        intro: {
          eyebrow: 'Erreurs a eviter',
          title: 'Ce que la methode empeche en priorite.',
          copy: 'Ces erreurs coutent cher parce qu elles affaiblissent le document meme quand le parcours est bon.'
        },
        columns: 2,
        items: [
          {
            eyebrow: 'A',
            title: 'Confondre precision et surcharge',
            copy: 'Plus de texte ne veut pas dire plus de credibilite si le lecteur ne voit plus l essentiel.'
          },
          {
            eyebrow: 'B',
            title: 'Laisser une rubrique faible juste pour remplir',
            copy: 'Mieux vaut couper un bloc peu utile qu exhiber une section vide ou hors sujet.'
          },
          {
            eyebrow: 'C',
            title: 'Empiler des competences sans preuves',
            copy: 'Une liste ne vaut que si les experiences confirment ensuite le niveau revendique.'
          },
          {
            eyebrow: 'D',
            title: 'Traiter la previsualisation comme un editeur libre',
            copy: 'La finition sert a confirmer la lecture, pas a reconstruire le CV en bout de chaine.'
          }
        ]
      }
    ]
  },
  'competences-cv': {
    title: 'Competences CV | Hiprofil',
    theme: THEMES.ember,
    hero: {
      variant: 'command',
      eyebrow: 'Competences et preuves',
      title: 'La rubrique competences doit confirmer le poste vise, jamais diluer votre positionnement.',
      copy: 'Les bonnes listes sont courtes, reliees au vocabulaire du poste et appuy ees par les experiences. Le reste ressemble vite a du remplissage.',
      actions: [
        { label: 'Construire mon CV', kind: 'cv', tone: 'primary' },
        { label: 'Creer un compte', kind: 'signup', tone: 'secondary' }
      ],
      metrics: [
        ['Mots exacts', 'repris de l offre quand ils sont justes'],
        ['Preuves', 'visibles dans les experiences'],
        ['Familles claires', 'metier, outils, methode']
      ],
      panel: {
        eyebrow: 'Role de la rubrique',
        title: 'Confirmer et orienter la lecture.',
        copy: 'La rubrique competences aide surtout le lecteur a reconnaitre plus vite votre terrain de jeu, pas a decouvrir des dizaines de possibilites contradictoires.',
        points: [
          'Reprendre les termes attendus quand vous les maitrisez vraiment',
          'Grouper les competences par famille lisible',
          'Limiter les termes mous ou impossibles a prouver',
          'Faire echo aux experiences les plus fortes'
        ]
      }
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Familles',
          title: 'Quatre familles suffisent dans la plupart des cas.',
          copy: 'Cette structure evite les listes longues et melangees.'
        },
        columns: 2,
        items: [
          {
            eyebrow: 'Metier',
            title: 'Competences coeur',
            copy: 'Celles qui prouvent que vous savez tenir le poste cible.'
          },
          {
            eyebrow: 'Outils',
            title: 'Environnements et logiciels',
            copy: 'A garder quand ils servent directement l execution et la lecture de votre niveau.'
          },
          {
            eyebrow: 'Methode',
            title: 'Cadres et approches',
            copy: 'Utiles si elles structurent reellement votre facon de travailler.'
          },
          {
            eyebrow: 'Transversal',
            title: 'Soft skills avec parcimonie',
            copy: 'Seulement quand elles sont visibles dans des faits, jamais comme simple declaration.'
          }
        ]
      },
      {
        type: 'table',
        surface: 'soft',
        intro: {
          eyebrow: 'Carte des preuves',
          title: 'Une competence n existe vraiment que si le CV peut la montrer.',
          copy: 'La bonne question est toujours: ou est ce que je la prouve dans le document ?'
        },
        columns: ['Competence', 'Ou la montrer'],
        rows: [
          ['Pilotage de projet', 'Dans une experience qui expose perimetre, coordination, delais et resultat.'],
          ['Analyse', 'Dans une decision prise, un probleme resolu ou un arbitrage explique.'],
          ['Communication', 'Dans une animation, une restitution, une coordination ou une relation client.'],
          ['Outils', 'Dans les missions ou ils servent a produire un resultat concret.'],
          ['Methodes', 'Dans la facon de structurer ou mener le travail, pas dans une liste isolee.']
        ]
      }
    ]
  },
  'a-propos': {
    title: 'A propos | Hiprofil',
    theme: THEMES.cobalt,
    hero: {
      variant: 'manifesto',
      eyebrow: 'Pourquoi Hiprofil',
      title: 'Le projet part d une idee simple: mieux finir un CV en moins de friction.',
      copy: 'Trop d outils ajoutent des options mais n aident pas a prendre les bonnes decisions de lecture. Hiprofil part de l inverse: clarifier, prioriser, sortir un document presentable.',
      actions: [
        { label: 'Commencer mon CV', kind: 'cv', tone: 'primary' },
        { label: 'Creer un compte', kind: 'signup', tone: 'secondary' }
      ],
      pillars: [
        'Clarifier avant d embellir',
        'Limiter les options qui ne changent rien',
        'Traiter le PDF comme le vrai livrable',
        'Garder un outil rapide a prendre en main'
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Principes',
          title: 'La direction produit reste volontairement stricte.',
          copy: 'Chaque choix cherche a raccourcir le chemin entre un contenu imparfait et un CV plus defendable.'
        },
        columns: 2,
        items: [
          {
            eyebrow: '01',
            title: 'Clarifier le message',
            copy: 'Le contenu passe avant la decoration. Un bon CV se comprend avant de se contempler.'
          },
          {
            eyebrow: '02',
            title: 'Supprimer les faux choix',
            copy: 'Si un reglage ne change pas vraiment la lecture, il n a pas vocation a encombrer le produit.'
          },
          {
            eyebrow: '03',
            title: 'Concevoir pour le temps court',
            copy: 'La majorite des utilisateurs viennent pour sortir une version solide, pas pour tout reimaginer.'
          },
          {
            eyebrow: '04',
            title: 'Rester centre sur la sortie',
            copy: 'Le rendu final, partageable et lisible, reste la mesure principale de qualite.'
          }
        ]
      },
      {
        type: 'timeline',
        surface: 'soft',
        intro: {
          eyebrow: 'Parcours',
          title: 'Une evolution centree sur la reduction de friction.',
          copy: 'Le projet a ete resserre a plusieurs reprises pour rester utile.'
        },
        items: [
          {
            title: 'Constat de depart',
            copy: 'Trop de createurs de CV poussent vers la personnalisation avant meme de clarifier la structure.'
          },
          {
            title: 'Premier prototype',
            copy: 'Le flux a ete pense autour du builder guide puis de la previsualisation comme outil de verification.'
          },
          {
            title: 'Resserrement du produit',
            copy: 'Les options qui n apportaient pas un vrai gain de lecture ont ete mises de cote.'
          },
          {
            title: 'Cap actuel',
            copy: 'Rendre la production plus rapide, plus claire et plus stable pour des candidatures reelles.'
          }
        ]
      }
    ]
  },
  entreprises: {
    title: 'Hiprofil pour les entreprises | Hiprofil',
    theme: THEMES.ledger,
    hero: {
      variant: 'command',
      eyebrow: 'Usage B2B',
      title: 'Un cadre commun pour produire des CV plus coherents dans un contexte equipe.',
      copy: 'La proposition est operationnelle: standardiser la structure, accelerer les relectures et sortir des documents plus stables pour des clients, jurys ou recruteurs.',
      actions: [
        { label: 'Parler a l equipe B2B', kind: 'signup', tone: 'primary' },
        { label: 'Ouvrir le builder', kind: 'cv', tone: 'secondary' }
      ],
      metrics: [
        ['1 base commune', 'pour tous les profils'],
        ['Moins de reprises', 'sur la forme et la structure'],
        ['PDF stables', 'pour les livrables envoy es']
      ],
      panel: {
        eyebrow: 'Le cadre equipe',
        title: 'Aligner sans uniformiser betement.',
        copy: 'L objectif n est pas de rendre tous les CV identiques, mais de partager les memes reperes: ordre de lecture, sections attendues, niveau de detail et routine de controle.',
        points: [
          'Trame commune et intitul es stables',
          'Regles de redaction partagees',
          'Rituels de relecture plus rapides',
          'Sortie plus consistente entre profils'
        ]
      }
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Cas d usage',
          title: 'Le meme besoin revient dans plusieurs contextes collectifs.',
          copy: 'Les structures qui produisent plusieurs CV gagnent surtout sur la coh erence et la vitesse de relecture.'
        },
        columns: 3,
        items: [
          {
            eyebrow: 'Cabinets',
            title: 'Intermediation et conseil',
            copy: 'Sortir des profils plus homog enes et plus defendables sans reprendre chaque document a la main.'
          },
          {
            eyebrow: 'Collectifs',
            title: 'Consultants et freelances',
            copy: 'Poser un cadre commun tout en laissant une marge de personnalisation raisonnable.'
          },
          {
            eyebrow: 'Formation',
            title: 'Promotions et programmes',
            copy: 'Faire produire a plusieurs personnes des documents plus lisibles et plus comparables.'
          }
        ]
      },
      {
        type: 'steps',
        surface: 'soft',
        intro: {
          eyebrow: 'Deploiement',
          title: 'Le roll out se fait en quatre temps.',
          copy: 'Le but est de definir vite un cadre utile, puis de le rendre simple a utiliser.'
        },
        layout: 'rail',
        items: [
          {
            title: 'Diagnostic de depart',
            copy: 'Comprendre les formats actuels, les irritants et le niveau de dispersion.'
          },
          {
            title: 'Definition des regles communes',
            copy: 'Fixer sections, intitul es, niveau de detail et rituels de controle.'
          },
          {
            title: 'Mise en place du flux',
            copy: 'Outiller les equipes avec une trame simple et un chemin de production stable.'
          },
          {
            title: 'Suivi des usages',
            copy: 'Mesurer les reprises evitees et ajuster ce qui freine encore.'
          }
        ]
      },
      {
        type: 'cards',
        intro: {
          eyebrow: 'Effets attendus',
          title: 'Le gain porte sur le temps et la lisibilite.',
          copy: 'Les benefices cherches restent tres concrets.'
        },
        columns: 3,
        items: [
          {
            eyebrow: 'Temps',
            title: 'Moins de corrections repetitives',
            copy: 'Les erreurs de structure et de presentation sont traitees plus en amont.'
          },
          {
            eyebrow: 'Qualite',
            title: 'Des livrables plus coherents',
            copy: 'Le niveau de lecture devient plus stable d un profil a l autre.'
          },
          {
            eyebrow: 'Pilotage',
            title: 'Un cadre plus simple a faire respecter',
            copy: 'Les relectures se concentrent sur le fond au lieu de rattraper les bases.'
          }
        ]
      }
    ]
  },
  affiliation: {
    title: 'Programme d affiliation | Hiprofil',
    theme: THEMES.studio,
    hero: {
      variant: 'split',
      eyebrow: 'Partenaires',
      title: 'Un programme d affiliation simple a expliquer, a activer et a suivre.',
      copy: 'La page pose un cadre net: pour qui c est utile, comment la commission fonctionne, quels assets sont fournis et quelles regles prot egent la qualite du message.',
      actions: [
        { label: 'Rejoindre le programme', kind: 'signup', tone: 'primary' },
        { label: 'Commencer mon CV', kind: 'cv', tone: 'secondary' }
      ],
      metrics: [
        ['Jusqu a 25 %', 'sur les abonnements Pro eligibles'],
        ['Validation mensuelle', 'avant paiement'],
        ['Kit de lancement', 'pour demarrer proprement']
      ],
      cards: [
        {
          eyebrow: 'Commission',
          title: 'Mode de remuneration lisible',
          copy: 'Le cadre est simple: attribution claire, validation mensuelle, paiement ensuite.'
        },
        {
          eyebrow: 'Assets',
          title: 'Messages et visuels fournis',
          copy: 'Le programme evite de reinventer les promesses commerciales a chaque partenaire.'
        },
        {
          eyebrow: 'Qualite',
          title: 'Des regles de positionnement',
          copy: 'Le discours doit rester coherent avec ce que le produit fait reellement.'
        }
      ]
    },
    sections: [
      {
        type: 'cards',
        intro: {
          eyebrow: 'Profils adaptes',
          title: 'Le programme est surtout utile aux acteurs qui parlent deja emploi ou repositionnement.',
          copy: 'Le meilleur partenariat est celui qui reste coherent avec l audience.'
        },
        columns: 3,
        items: [
          {
            eyebrow: 'Createurs',
            title: 'Contenu et media',
            copy: 'Pour recommander un outil de production de CV a une audience en recherche active.'
          },
          {
            eyebrow: 'Accompagnement',
            title: 'Coachs et formateurs',
            copy: 'Pour completer un accompagnement avec un outil plus cadre.'
          },
          {
            eyebrow: 'Communautes',
            title: 'Ecoles et reseaux',
            copy: 'Pour proposer une solution simple avec un suivi propre des activations.'
          }
        ]
      },
      {
        type: 'band',
        surface: 'accent',
        intro: {
          eyebrow: 'Regles du programme',
          title: 'Le cadre protege autant le partenaire que la marque.',
          copy: 'Les regles evitent les promesses trompeuses et les positionnements qui deconn ectent le produit de son usage reel.'
        },
        points: [
          'Pas de promesse de resultat automatique ou garanti.',
          'Pas de communication aggressive ou de faux sentiment d urgence.',
          'Positionner Hiprofil comme un outil de clarification et de finition, pas comme une solution miracle.',
          'Utiliser les messages et visuels valid es quand ils existent.'
        ],
        chips: ['Cadre clair', 'Paiement mensuel', 'Assets fournis', 'Message coherent']
      }
    ]
  }
};

const HERO_VIDEO_POOL = [
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    label: 'Demonstration guidee'
  },
  {
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    label: 'Parcours visuel'
  },
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    label: 'Vue rapide'
  }
];

function hashValue(input = '') {
  return String(input)
    .split('')
    .reduce((sum, char, index) => sum + (char.charCodeAt(0) * (index + 17)), 0);
}

function clampLabel(value, maxLength = 44) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function escapeSvgText(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toSvgDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildIllustrationSrc(theme, seed, eyebrow, title) {
  const chip = escapeSvgText(clampLabel(eyebrow || 'Hiprofil', 20) || 'Hiprofil');
  const heading = escapeSvgText(clampLabel(title || 'Contenu structure', 34) || 'Contenu structure');
  const detail = escapeSvgText(clampLabel('Images visibles et sections plus demonstratives.', 44));
  const layout = seed % 3;
  const accentSoft = theme.accentSoft;
  const line = theme.line;
  const ink = theme.ink;
  const accent = theme.accent;
  const accentStrong = theme.accentStrong;
  const panel = theme.panel;
  const panelAlt = theme.panelAlt;

  const layouts = [
    `
      <rect x="70" y="122" width="370" height="262" rx="28" fill="${panel}" stroke="${line}" />
      <rect x="96" y="150" width="168" height="124" rx="20" fill="${accentSoft}" />
      <rect x="284" y="150" width="126" height="18" rx="9" fill="${line}" />
      <rect x="284" y="184" width="110" height="18" rx="9" fill="${line}" />
      <rect x="284" y="218" width="90" height="18" rx="9" fill="${line}" />
      <rect x="96" y="304" width="314" height="18" rx="9" fill="${line}" />
      <rect x="96" y="336" width="234" height="18" rx="9" fill="${line}" />
      <rect x="488" y="122" width="642" height="524" rx="36" fill="${panel}" stroke="${line}" />
      <rect x="528" y="162" width="562" height="48" rx="24" fill="${accentSoft}" />
      <rect x="528" y="240" width="320" height="212" rx="28" fill="${panelAlt}" />
      <rect x="878" y="240" width="212" height="212" rx="28" fill="${accentStrong}" opacity="0.92" />
      <rect x="528" y="486" width="562" height="24" rx="12" fill="${line}" />
      <rect x="528" y="530" width="428" height="24" rx="12" fill="${line}" />
    `,
    `
      <rect x="70" y="122" width="1060" height="524" rx="40" fill="${panel}" stroke="${line}" />
      <rect x="110" y="162" width="226" height="196" rx="28" fill="${accentStrong}" opacity="0.92" />
      <rect x="366" y="162" width="216" height="196" rx="28" fill="${panelAlt}" />
      <rect x="612" y="162" width="216" height="196" rx="28" fill="${accentSoft}" />
      <rect x="858" y="162" width="232" height="196" rx="28" fill="${panelAlt}" />
      <rect x="110" y="406" width="980" height="42" rx="21" fill="${line}" />
      <rect x="110" y="470" width="756" height="24" rx="12" fill="${line}" />
      <rect x="110" y="516" width="624" height="24" rx="12" fill="${line}" />
      <rect x="110" y="562" width="484" height="24" rx="12" fill="${line}" />
    `,
    `
      <rect x="70" y="122" width="1060" height="524" rx="40" fill="${panel}" stroke="${line}" />
      <rect x="110" y="162" width="368" height="444" rx="34" fill="${panelAlt}" />
      <rect x="518" y="162" width="572" height="120" rx="28" fill="${accentSoft}" />
      <rect x="518" y="314" width="270" height="292" rx="28" fill="${panelAlt}" />
      <rect x="820" y="314" width="270" height="292" rx="28" fill="${accentStrong}" opacity="0.92" />
      <rect x="150" y="202" width="288" height="22" rx="11" fill="${line}" />
      <rect x="150" y="246" width="212" height="22" rx="11" fill="${line}" />
      <rect x="150" y="304" width="288" height="208" rx="28" fill="${panel}" />
      <rect x="150" y="544" width="198" height="22" rx="11" fill="${line}" />
    `
  ];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${heading}">
      <defs>
        <linearGradient id="bg-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentSoft}" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="48" fill="url(#bg-${seed})" />
      <circle cx="1080" cy="126" r="96" fill="${accent}" opacity="0.12" />
      <circle cx="126" cy="748" r="122" fill="${accent}" opacity="0.1" />
      <rect x="70" y="70" width="206" height="44" rx="22" fill="${accentStrong}" opacity="0.96" />
      <text x="173" y="98" fill="#ffffff" font-size="22" font-family="Arial, sans-serif" text-anchor="middle" font-weight="700">${chip}</text>
      <text x="70" y="736" fill="${ink}" font-size="58" font-family="Arial, sans-serif" font-weight="800">${heading}</text>
      <text x="70" y="784" fill="${ink}" opacity="0.62" font-size="26" font-family="Arial, sans-serif" font-weight="600">${detail}</text>
      ${layouts[layout]}
    </svg>
  `;

  return toSvgDataUri(svg);
}

function pickVideoAsset(seed) {
  return HERO_VIDEO_POOL[seed % HERO_VIDEO_POOL.length];
}

function resolveSectionFocus(section) {
  if (section?.intro?.title) return section.intro.title;
  if (Array.isArray(section?.items) && section.items[0]?.title) return section.items[0].title;
  if (Array.isArray(section?.rows) && Array.isArray(section.rows[0]) && section.rows[0][0]) return section.rows[0][0];
  if (Array.isArray(section?.plans) && section.plans[0]?.name) return section.plans[0].name;
  if (section?.left?.title) return section.left.title;
  if (section?.right?.title) return section.right.title;
  if (Array.isArray(section?.points) && section.points[0]) return section.points[0];
  if (Array.isArray(section?.chips) && section.chips[0]) return section.chips[0];
  if (Array.isArray(section?.columns) && section.columns[0]) return section.columns[0];
  return 'Contenu detaille';
}

function createIllustration(theme, seed, eyebrow, title) {
  return {
    src: buildIllustrationSrc(theme, seed, eyebrow, title),
    alt: `${clampLabel(eyebrow || 'Hiprofil', 20) || 'Hiprofil'} - ${clampLabel(title || 'Contenu', 34) || 'Contenu'}`
  };
}

function renderIllustrationFrame(theme, media, options = {}) {
  if (!media) return '';
  const compact = Boolean(options.compact);
  const title = clampLabel(options.title || '', 36);
  const copy = clampLabel(options.copy || '', 70);
  const wrapperClass = compact
    ? 'rounded-[1.7rem] p-3'
    : 'rounded-[2.1rem] p-4 md:p-5';
  const imageMinHeight = compact ? '220px' : '280px';

  return `
    <figure class="border shadow-sm ${wrapperClass}" style="border-color:${theme.line}; background:${theme.panel};">
      <div class="overflow-hidden rounded-[1.35rem] border" style="border-color:${theme.line};">
        <img src="${media.src}" alt="${media.alt}" class="block h-full w-full object-cover" style="min-height:${imageMinHeight};">
      </div>
      ${title ? `<figcaption class="mt-4"><p class="text-sm font-semibold leading-6">${title}</p>${copy ? `<p class="mt-2 text-sm leading-6" style="color:${theme.muted};">${copy}</p>` : ''}</figcaption>` : ''}
    </figure>
  `;
}

function renderVideoFrame(theme, videoAsset, poster, title, copy, options = {}) {
  if (!videoAsset) return '';
  const compact = Boolean(options.compact);
  const wrapperClass = compact
    ? 'rounded-[1.7rem] p-3'
    : 'rounded-[2.1rem] p-4 md:p-5';
  const videoMinHeight = compact ? '220px' : '280px';

  return `
    <div class="border shadow-sm ${wrapperClass}" style="border-color:${theme.line}; background:linear-gradient(180deg, ${theme.panel} 0%, ${theme.panelAlt} 100%);">
      <div class="relative overflow-hidden rounded-[1.35rem] border" style="border-color:${theme.line};">
        <video
          class="block h-full w-full object-cover"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="${poster}"
          style="min-height:${videoMinHeight};"
        >
          <source src="${videoAsset.src}" type="video/mp4">
        </video>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-24" style="background:linear-gradient(180deg, rgba(15,23,42,0) 0%, rgba(15,23,42,0.72) 100%);"></div>
        <div class="pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white" style="background:rgba(15,23,42,0.55);">
          ${videoAsset.label}
        </div>
      </div>
      <div class="mt-4">
        <p class="text-sm font-semibold leading-6">${clampLabel(title || 'Video de contexte', 34)}</p>
        <p class="mt-2 text-sm leading-6" style="color:${theme.muted};">${clampLabel(copy || 'Une demonstration visuelle renforce la lecture de la page.', 78)}</p>
      </div>
    </div>
  `;
}

function renderHeroMedia(config, options = {}) {
  const { theme, hero } = config;
  const seedBase = hashValue(`${config.pageKey || config.title}:hero`);
  const posterVisual = createIllustration(theme, seedBase, hero.eyebrow, hero.title);
  const sideVisualA = createIllustration(theme, seedBase + 1, hero.eyebrow, hero.copy || hero.title);
  const sideVisualB = createIllustration(theme, seedBase + 2, 'Hiprofil', (hero.metrics && hero.metrics[0] && hero.metrics[0][1]) || 'Lecture rapide');
  const videoAsset = pickVideoAsset(seedBase);
  const compact = Boolean(options.compact);
  const gridClass = compact ? 'max-w-5xl mx-auto mt-10 grid gap-4 md:grid-cols-[1.2fr_0.8fr]' : 'grid gap-4';

  return `
    <div class="${gridClass}">
      <div>
        ${renderVideoFrame(theme, videoAsset, posterVisual.src, hero.title, hero.copy, { compact })}
      </div>
      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
        ${renderIllustrationFrame(theme, sideVisualA, {
          compact: true,
          title: hero.eyebrow || 'Contenu visible',
          copy: 'Des visuels plus explicites rendent la page plus concrete.'
        })}
        ${renderIllustrationFrame(theme, sideVisualB, {
          compact: true,
          title: 'Mise en situation',
          copy: 'Le visiteur comprend mieux le service avec un support graphique immediat.'
        })}
      </div>
    </div>
  `;
}

function renderSectionMedia(config, section, sectionIndex = 0) {
  const { theme } = config;
  const focus = resolveSectionFocus(section);
  const seedBase = hashValue(`${config.pageKey || config.title}:${section.type}:${sectionIndex}`);
  const primary = createIllustration(theme, seedBase, section.intro?.eyebrow || 'Section', section.intro?.title || focus);
  const secondary = createIllustration(theme, seedBase + 1, 'Detail', focus);

  return `
    <div class="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
      ${renderIllustrationFrame(theme, primary, {
        title: section.intro?.title || focus,
        copy: section.intro?.copy || 'Chaque section expose maintenant un visuel explicite pour renforcer la comprehension.'
      })}
      <div class="grid gap-4">
        ${renderIllustrationFrame(theme, secondary, {
          compact: true,
          title: focus,
          copy: 'Le contenu gagne en relief avec une image claire juste avant les details.'
        })}
        <div class="rounded-[1.9rem] border p-5 shadow-sm" style="border-color:${theme.line}; background:${theme.panelAlt};">
          <p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">Lecture visuelle</p>
          <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">Cette zone sert de repere visuel constant: le visiteur identifie plus vite le sujet de la section avant meme de lire tous les paragraphes.</p>
        </div>
      </div>
    </div>
  `;
}

function joinItems(items, renderItem) {
  return items.map((item, index) => renderItem(item, index)).join('');
}

function gridClass(columns = 3) {
  if (columns === 2) return 'md:grid-cols-2';
  if (columns === 4) return 'md:grid-cols-2 xl:grid-cols-4';
  return 'md:grid-cols-2 xl:grid-cols-3';
}

function resolveActionAttributes(kind) {
  if (kind === 'cv') return 'data-cv-start="1"';
  if (kind === 'signup') return 'data-auth-mode="signup"';
  if (kind === 'login') return 'data-auth-mode="login"';
  if (kind === 'deposit') return 'data-open-deposit="1"';
  return '';
}

function renderButton(theme, action) {
  const attrs = resolveActionAttributes(action.kind);
  const commonAttrs = action.kind === 'cv'
    ? 'data-signed-in-text="Ouvrir le builder"'
    : 'data-signed-in-text="Ouvrir le builder"';
  const isPrimary = action.tone !== 'secondary';
  const className = isPrimary
    ? 'rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95'
    : 'rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5';
  const style = isPrimary
    ? `background:${theme.accentStrong};`
    : `border-color:${theme.line}; background:${theme.panel}; color:${theme.ink};`;
  return `<button type="button" ${attrs} ${commonAttrs} class="${className}" style="${style}">${action.label}</button>`;
}

function renderActionRow(theme, actions = [], align = 'left') {
  if (!actions.length) return '';
  const justifyClass = align === 'center' ? 'justify-center' : '';
  return `
    <div class="mt-8 flex flex-wrap gap-3 ${justifyClass}">
      ${joinItems(actions, (action) => renderButton(theme, action))}
    </div>
  `;
}

function renderIntro(theme, intro, align = 'left') {
  if (!intro) return '';
  const introAlign = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const introWidth = align === 'center' ? 'max-w-3xl' : 'max-w-3xl';
  return `
    <div class="${introAlign} ${introWidth}">
      <p class="text-xs font-semibold uppercase tracking-[0.24em]" style="color:${theme.accent};">${intro.eyebrow}</p>
      <h2 class="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">${intro.title}</h2>
      ${intro.copy ? `<p class="mt-4 text-sm leading-7 md:text-base" style="color:${theme.muted};">${intro.copy}</p>` : ''}
    </div>
  `;
}

function renderMetricCards(theme, metrics = []) {
  if (!metrics.length) return '';
  return `
    <div class="mt-8 grid gap-3 sm:grid-cols-3">
      ${joinItems(metrics, ([value, label]) => `
        <div class="rounded-3xl border px-5 py-4" style="border-color:${theme.line}; background:${theme.panel};">
          <p class="text-sm font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${value}</p>
          <p class="mt-2 text-sm leading-6" style="color:${theme.muted};">${label}</p>
        </div>
      `)}
    </div>
  `;
}

function renderBackdrop(theme) {
  const glowMarkup = `
    <div class="absolute -left-16 -top-12 h-56 w-56 rounded-full blur-3xl" style="background:${theme.glowA};"></div>
    <div class="absolute right-0 top-20 h-64 w-64 rounded-full blur-3xl" style="background:${theme.glowB};"></div>
  `;

  if (theme.texture === 'grid') {
    return `
      <div class="absolute inset-0 opacity-60" style="background-image:linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 64px 64px;"></div>
      ${glowMarkup}
    `;
  }

  if (theme.texture === 'dots') {
    return `
      <div class="absolute inset-0 opacity-70" style="background-image:radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px); background-size: 24px 24px;"></div>
      ${glowMarkup}
    `;
  }

  if (theme.texture === 'beams') {
    return `
      <div class="absolute inset-x-0 top-0 h-80 opacity-70" style="background:linear-gradient(120deg, rgba(255,255,255,0.72) 0%, transparent 34%), linear-gradient(300deg, rgba(255,255,255,0.72) 0%, transparent 36%);"></div>
      ${glowMarkup}
    `;
  }

  if (theme.texture === 'bands') {
    return `
      <div class="absolute inset-0 opacity-70" style="background:linear-gradient(180deg, rgba(255,255,255,0.72) 0%, transparent 24%), repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 14px, transparent 14px 34px);"></div>
      ${glowMarkup}
    `;
  }

  return `
    <div class="absolute inset-0 opacity-70" style="background:radial-gradient(circle at 15% 10%, rgba(255,255,255,0.76) 0, transparent 28%), radial-gradient(circle at 85% 5%, rgba(255,255,255,0.72) 0, transparent 24%);"></div>
    ${glowMarkup}
  `;
}

function renderHero(config) {
  const { hero } = config;

  if (hero.variant === 'command') return renderCommandHero(config);
  if (hero.variant === 'spotlight') return renderSpotlightHero(config);
  if (hero.variant === 'directory') return renderDirectoryHero(config);
  if (hero.variant === 'manifesto') return renderManifestoHero(config);

  return renderSplitHero(config);
}

function renderSplitHero(config) {
  const { theme, hero } = config;
  return `
    <section class="border-b" style="border-color:${theme.line};">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 xl:grid-cols-[1.08fr_0.92fr]">
        <div>
          ${renderIntro(theme, hero)}
          ${renderActionRow(theme, hero.actions)}
          ${renderMetricCards(theme, hero.metrics)}
        </div>
        <div class="grid gap-4">
          ${renderHeroMedia(config)}
          ${joinItems(hero.cards || [], (card, index) => `
            <article class="rounded-[2rem] border p-6 shadow-sm ${index === 0 ? '' : ''}" style="border-color:${theme.line}; background:${index === 1 ? theme.panelAlt : theme.panel};">
              <p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${card.eyebrow}</p>
              <h3 class="mt-3 text-xl font-bold leading-tight">${card.title}</h3>
              <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${card.copy}</p>
            </article>
          `)}
        </div>
      </div>
    </section>
  `;
}

function renderCommandHero(config) {
  const { theme, hero } = config;
  const panel = hero.panel || { points: [] };

  return `
    <section class="border-b" style="border-color:${theme.line};">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 xl:grid-cols-[1fr_1fr] xl:items-start">
        <div>
          ${renderIntro(theme, hero)}
          ${renderActionRow(theme, hero.actions)}
          ${renderMetricCards(theme, hero.metrics)}
        </div>
        <div class="grid gap-4">
          ${renderHeroMedia(config)}
          <div class="rounded-[2.4rem] border p-7 shadow-sm" style="border-color:${theme.line}; background:linear-gradient(180deg, ${theme.panel} 0%, ${theme.accentSoft} 160%);">
            <p class="text-xs font-semibold uppercase tracking-[0.2em]" style="color:${theme.accent};">${panel.eyebrow}</p>
            <h3 class="mt-4 text-2xl font-extrabold leading-tight">${panel.title}</h3>
            <p class="mt-4 text-sm leading-7" style="color:${theme.muted};">${panel.copy}</p>
            <div class="mt-6 grid gap-3">
              ${joinItems(panel.points || [], (point, index) => `
                <div class="rounded-2xl border px-4 py-4" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : 'rgba(255,255,255,0.86)'};">
                  <div class="flex gap-3">
                    <span class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">0${index + 1}</span>
                    <p class="text-sm leading-7" style="color:${theme.muted};">${point}</p>
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSpotlightHero(config) {
  const { theme, hero } = config;
  const feature = hero.feature || {};

  return `
    <section class="border-b" style="border-color:${theme.line};">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 xl:grid-cols-[1.02fr_0.98fr]">
        <div>
          ${renderIntro(theme, hero)}
          ${renderActionRow(theme, hero.actions)}
        </div>
        <div class="grid gap-5">
          ${renderHeroMedia(config)}
          <article class="rounded-[2.4rem] border p-7 shadow-sm" style="border-color:${theme.line}; background:${theme.panel};">
            <p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${feature.eyebrow}</p>
            <h3 class="mt-4 text-3xl font-extrabold leading-tight">${feature.title}</h3>
            <p class="mt-4 text-sm leading-7" style="color:${theme.muted};">${feature.copy}</p>
            <p class="mt-5 text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.muted};">${feature.meta}</p>
          </article>
          <div class="grid gap-3 sm:grid-cols-2">
            ${joinItems(hero.aside || [], (item, index) => `
              <div class="rounded-2xl border px-4 py-4" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panelAlt : theme.panel};">
                <p class="text-sm font-semibold leading-6">${item}</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderDirectoryHero(config) {
  const { theme, hero } = config;
  return `
    <section class="border-b" style="border-color:${theme.line};">
      <div class="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        <div class="grid gap-10 xl:grid-cols-[0.92fr_1.08fr]">
          <div>
            ${renderIntro(theme, hero)}
            ${renderActionRow(theme, hero.actions)}
          </div>
          <div class="grid gap-4">
            ${renderHeroMedia(config)}
            <div class="grid gap-4 md:grid-cols-3">
              ${joinItems(hero.cards || [], (card, index) => `
                <article class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${index === 1 ? theme.panelAlt : theme.panel};">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${card.eyebrow}</p>
                  <h3 class="mt-4 text-xl font-bold leading-tight">${card.title}</h3>
                  <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${card.copy}</p>
                  ${card.meta ? `<p class="mt-4 text-xs font-semibold uppercase tracking-[0.16em]" style="color:${theme.muted};">${card.meta}</p>` : ''}
                </article>
              `)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderManifestoHero(config) {
  const { theme, hero } = config;
  return `
    <section class="border-b" style="border-color:${theme.line};">
      <div class="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        ${renderIntro(theme, hero, 'center')}
        ${renderActionRow(theme, hero.actions, 'center')}
        ${renderHeroMedia(config, { compact: true })}
        <div class="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-4">
          ${joinItems(hero.pillars || [], (pillar, index) => `
            <div class="rounded-[1.8rem] border px-5 py-5 text-center" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : theme.panelAlt};">
              <p class="text-sm font-semibold leading-6">${pillar}</p>
            </div>
          `)}
        </div>
      </div>
    </section>
  `;
}

function resolveSectionSurface(theme, section) {
  if (section.surface === 'accent') {
    return {
      className: 'border-y',
      style: `border-color:${theme.line}; background:${theme.accentSoft};`
    };
  }

  if (section.surface === 'soft') {
    return {
      className: 'border-y',
      style: `border-color:${theme.line}; background:rgba(255,255,255,0.82);`
    };
  }

  return { className: '', style: '' };
}

function renderSection(config, section, sectionIndex = 0) {
  const surface = resolveSectionSurface(config.theme, section);
  const renderer = SECTION_RENDERERS[section.type];

  if (!renderer) return '';

  return `
    <section class="${surface.className}" style="${surface.style}">
      <div class="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        ${renderIntro(config.theme, section.intro)}
        ${renderSectionMedia(config, section, sectionIndex)}
        ${renderer(config, section)}
      </div>
    </section>
  `;
}

function renderCardsSection(config, section) {
  const { theme } = config;
  return `
    <div class="mt-8 grid gap-5 ${gridClass(section.columns)}">
      ${joinItems(section.items || [], (item, index) => `
        <article class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${index % 3 === 1 ? theme.panelAlt : theme.panel};">
          ${item.eyebrow ? `<p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${item.eyebrow}</p>` : ''}
          <h3 class="mt-3 text-xl font-bold leading-tight">${item.title}</h3>
          <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${item.copy}</p>
          ${item.meta ? `<p class="mt-4 text-xs font-semibold uppercase tracking-[0.16em]" style="color:${theme.muted};">${item.meta}</p>` : ''}
          ${item.bullets && item.bullets.length ? `
            <ul class="mt-5 space-y-2 text-sm" style="color:${theme.muted};">
              ${joinItems(item.bullets, (bullet) => `<li class="flex gap-3"><span style="color:${theme.accent};">•</span><span>${bullet}</span></li>`)}
            </ul>
          ` : ''}
        </article>
      `)}
    </div>
  `;
}

function renderTableSection(config, section) {
  const { theme } = config;
  const template = `repeat(${(section.columns || []).length}, minmax(180px, 1fr))`;

  return `
    <div class="mt-8 overflow-x-auto rounded-[2rem] border shadow-sm" style="border-color:${theme.line}; background:${theme.panel};">
      <div class="min-w-[720px]">
        <div class="grid gap-4 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent}; grid-template-columns:${template};">
          ${joinItems(section.columns || [], (column) => `<span>${column}</span>`)}
        </div>
        ${joinItems(section.rows || [], (row, index) => `
          <div class="grid gap-4 px-5 py-4 text-sm ${index === 0 ? 'border-t' : 'border-t'}" style="border-color:${theme.line}; grid-template-columns:${template};">
            ${joinItems(row, (cell, cellIndex) => `
              <span ${cellIndex === 0 ? 'class="font-semibold"' : ''} style="color:${cellIndex === 0 ? theme.ink : theme.muted};">${cell}</span>
            `)}
          </div>
        `)}
      </div>
    </div>
  `;
}

function renderStepsSection(config, section) {
  const { theme } = config;
  const isRail = section.layout === 'rail';

  if (isRail) {
    return `
      <div class="mt-8 space-y-4">
        ${joinItems(section.items || [], (item, index) => `
          <div class="grid gap-4 rounded-[2rem] border p-6 md:grid-cols-[84px_1fr]" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : theme.panelAlt};">
            <div class="rounded-2xl px-4 py-3 text-center" style="background:${theme.accentSoft}; color:${theme.accent};">
              <p class="text-xs font-semibold uppercase tracking-[0.18em]">${item.meta || `0${index + 1}`}</p>
            </div>
            <div>
              <h3 class="text-xl font-bold leading-tight">${item.title}</h3>
              <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${item.copy}</p>
            </div>
          </div>
        `)}
      </div>
    `;
  }

  return `
    <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      ${joinItems(section.items || [], (item, index) => `
        <article class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : theme.panelAlt};">
          <p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${item.meta || `0${index + 1}`}</p>
          <h3 class="mt-3 text-xl font-bold leading-tight">${item.title}</h3>
          <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${item.copy}</p>
        </article>
      `)}
    </div>
  `;
}

function renderTimelineSection(config, section) {
  const { theme } = config;
  return `
    <div class="mt-8 space-y-4">
      ${joinItems(section.items || [], (item, index) => `
        <div class="grid gap-5 rounded-[2rem] border p-6 md:grid-cols-[72px_1fr]" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : theme.panelAlt};">
          <div class="flex items-start">
            <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style="background:${theme.accentSoft}; color:${theme.accent};">0${index + 1}</span>
          </div>
          <div>
            <h3 class="text-xl font-bold leading-tight">${item.title}</h3>
            <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${item.copy}</p>
          </div>
        </div>
      `)}
    </div>
  `;
}

function renderDuoSection(config, section) {
  const { theme } = config;
  const left = section.left || {};
  const right = section.right || {};

  return `
    <div class="mt-8 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <div class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${theme.panel};">
        ${left.eyebrow ? `<p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${left.eyebrow}</p>` : ''}
        <h3 class="mt-3 text-2xl font-extrabold leading-tight">${left.title}</h3>
        <p class="mt-4 text-sm leading-7" style="color:${theme.muted};">${left.copy}</p>
        ${left.bullets && left.bullets.length ? `
          <ul class="mt-5 space-y-3 text-sm" style="color:${theme.muted};">
            ${joinItems(left.bullets, (bullet) => `<li class="flex gap-3"><span style="color:${theme.accent};">•</span><span>${bullet}</span></li>`)}
          </ul>
        ` : ''}
      </div>
      <div class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${theme.panelAlt};">
        ${right.eyebrow ? `<p class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">${right.eyebrow}</p>` : ''}
        <h3 class="mt-3 text-2xl font-extrabold leading-tight">${right.title}</h3>
        <div class="mt-5 grid gap-3">
          ${joinItems(right.items || [], (item, index) => `
            <div class="rounded-2xl border px-4 py-4" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : 'rgba(255,255,255,0.76)'};">
              <div class="flex gap-3">
                <span class="text-xs font-semibold uppercase tracking-[0.18em]" style="color:${theme.accent};">0${index + 1}</span>
                <p class="text-sm leading-7" style="color:${theme.muted};">${item}</p>
              </div>
            </div>
          `)}
        </div>
      </div>
    </div>
  `;
}

function renderFaqSection(config, section) {
  const { theme } = config;
  return `
    <div class="mt-8 grid gap-5 md:grid-cols-2">
      ${joinItems(section.items || [], (item, index) => `
        <article class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panel : theme.panelAlt};">
          <h3 class="text-lg font-bold leading-tight">${item.q}</h3>
          <p class="mt-3 text-sm leading-7" style="color:${theme.muted};">${item.a}</p>
        </article>
      `)}
    </div>
  `;
}

function renderPricingSection(config, section) {
  const { theme } = config;
  const planCount = Array.isArray(section.plans) ? section.plans.length : 0;
  const wrapperClass = planCount <= 1
    ? 'mt-8 max-w-3xl'
    : 'mt-8 grid gap-5 xl:grid-cols-3';
  return `
    <div class="${wrapperClass}">
      ${joinItems(section.plans || [], (plan) => {
        const toneStyle = plan.tone === 'accent'
          ? `background:${theme.accentStrong}; border-color:${theme.accentStrong}; color:#ffffff;`
          : plan.tone === 'dark'
            ? 'background:#1f2357; border-color:#1f2357; color:#ffffff;'
            : `background:${theme.panel}; border-color:${theme.line}; color:${theme.ink};`;
        const bodyColor = plan.tone === 'light' ? theme.muted : 'rgba(255,255,255,0.82)';
        const ctaMarkup = plan.tone === 'light'
          ? renderButton(theme, plan.cta)
          : `<button type="button" ${resolveActionAttributes(plan.cta.kind)} data-signed-in-text="Ouvrir le builder" class="rounded-2xl border px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95" style="border-color:rgba(255,255,255,0.28); background:rgba(255,255,255,0.12);">${plan.cta.label}</button>`;
        return `
          <article class="rounded-[2.2rem] border p-6 shadow-sm" style="${toneStyle}">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.18em]">${plan.name}</p>
                <p class="mt-3 text-3xl font-extrabold">${plan.price}</p>
                <p class="mt-1 text-sm" style="color:${bodyColor};">${plan.cadence}</p>
              </div>
              ${plan.badge ? `<span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:rgba(255,255,255,0.16); color:#ffffff;">${plan.badge}</span>` : ''}
            </div>
            <p class="mt-4 text-sm leading-7" style="color:${bodyColor};">${plan.summary}</p>
            <ul class="mt-5 space-y-2 text-sm" style="color:${bodyColor};">
              ${joinItems(plan.points || [], (point) => `<li class="flex gap-3"><span>•</span><span>${point}</span></li>`)}
            </ul>
            <div class="mt-6">
              ${ctaMarkup}
            </div>
          </article>
        `;
      })}
    </div>
  `;
}

function renderBandSection(config, section) {
  const { theme } = config;
  const hasPoints = section.points && section.points.length;
  const hasChips = section.chips && section.chips.length;

  return `
    <div class="mt-8 grid gap-8 xl:grid-cols-[1fr_0.95fr] xl:items-start">
      <div class="rounded-[2rem] border p-6 shadow-sm" style="border-color:${theme.line}; background:${theme.panel};">
        ${hasPoints ? `
          <ul class="space-y-3 text-sm" style="color:${theme.muted};">
            ${joinItems(section.points, (point) => `<li class="flex gap-3"><span style="color:${theme.accent};">•</span><span>${point}</span></li>`)}
          </ul>
        ` : `<p class="text-sm leading-7" style="color:${theme.muted};">${section.note || ''}</p>`}
      </div>
      <div class="grid gap-3 ${hasChips && section.chips.length > 4 ? 'md:grid-cols-2' : ''}">
        ${hasChips ? joinItems(section.chips, (chip, index) => `
          <div class="rounded-2xl border px-4 py-4" style="border-color:${theme.line}; background:${index % 2 === 0 ? theme.panelAlt : theme.panel};">
            <p class="text-sm font-semibold leading-6">${chip}</p>
          </div>
        `) : ''}
      </div>
    </div>
  `;
}

const SECTION_RENDERERS = {
  cards: renderCardsSection,
  table: renderTableSection,
  steps: renderStepsSection,
  timeline: renderTimelineSection,
  duo: renderDuoSection,
  faq: renderFaqSection,
  pricing: renderPricingSection,
  band: renderBandSection
};

function renderPageShell(config) {
  return `
    <div class="min-h-screen overflow-hidden" style="background:${config.theme.pageBg}; color:${config.theme.ink};">
      <div class="relative isolate">
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          ${renderBackdrop(config.theme)}
        </div>
        <div class="relative">
          <div id="sierra-header-root"></div>
          <main>
            ${renderHero(config)}
            ${joinItems(config.sections || [], (section, index) => renderSection(config, section, index))}
          </main>
          <div id="sierra-cv-cta-footer-root"></div>
        </div>
      </div>
    </div>
  `;
}

function startCvFlow() {
  window.dispatchEvent(new CustomEvent('app:request-cv-start'));
}

function syncAuthUi(root, authApi) {
  const user = authApi?.getCurrentUser?.() || null;

  root.querySelectorAll('[data-auth-mode]').forEach((button) => {
    if (!(button instanceof HTMLElement)) return;

    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = button.textContent.trim();
    }

    if (user) {
      button.textContent = button.dataset.signedInText || 'Ouvrir le builder';
      return;
    }

    button.textContent = button.dataset.originalLabel;
  });
}

function bindPageActions(root, authApi) {
  root.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const actionNode = target.closest('[data-auth-mode], [data-cv-start], [data-open-deposit]');
    if (!actionNode) return;

    if (actionNode.hasAttribute('data-cv-start')) {
      startCvFlow();
      return;
    }

    if (actionNode.hasAttribute('data-open-deposit')) {
      window.dispatchEvent(new CustomEvent('app:open-deposit'));
      return;
    }

    const mode = actionNode.getAttribute('data-auth-mode') || 'signup';
    if (authApi?.getCurrentUser?.()) {
      startCvFlow();
      return;
    }
    authApi?.open?.(mode);
  });

  window.addEventListener('auth:changed', () => syncAuthUi(root, authApi));
}

function applyThemeVariables(theme) {
  document.body.style.background = theme.pageBg;
  document.body.style.setProperty('--hp-blue-900', theme.accentStrong);
  document.body.style.setProperty('--hp-blue-700', theme.accent);
  document.body.style.setProperty('--hp-blue-500', theme.accent);
  document.body.style.setProperty('--hp-ink', theme.ink);
  document.body.style.setProperty('--hp-bg', theme.pageBg);
  document.body.style.setProperty('--hp-card', theme.panel);
  document.body.style.setProperty('--hp-line', theme.line);
}

export function bootstrapMarketingPage(pageKey) {
  const pageRoot = document.getElementById('sierra-page-root');
  const config = PAGE_CONFIGS[pageKey];

  if (!pageRoot) {
    console.error('Racine marketing introuvable: sierra-page-root');
    return;
  }

  if (!config) {
    console.error(`Page marketing inconnue: ${pageKey}`);
    return;
  }

  const renderConfig = { ...config, pageKey };
  document.title = renderConfig.title;
  applyThemeVariables(renderConfig.theme);
  pageRoot.innerHTML = renderPageShell(renderConfig);

  const authApi = initAuth();
  initAccountPanel(authApi);
  initCvAccessFlow(authApi);
  initDepositFlow(authApi);
  new HeaderComponent('sierra-header-root', { authApi });
  new CvCtaFooterComponent('sierra-cv-cta-footer-root');

  bindPageActions(pageRoot, authApi);
  syncAuthUi(pageRoot, authApi);
}
