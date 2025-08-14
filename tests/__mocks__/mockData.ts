// Mock pour les stores Pinia
export const mockStores = {
  armyName: [
    { idArmyName: 1, nameArmyName: 'Empire' },
    { idArmyName: 2, nameArmyName: 'Orcs & Goblins' },
    { idArmyName: 3, nameArmyName: 'Bretonnians' }
  ],
  armyPhoto: [
    { armyName_idArmyName: 1, photoArmyName: 'empire.jpg' },
    { armyName_idArmyName: 2, photoArmyName: 'orcs.jpg' },
    { armyName_idArmyName: 3, photoArmyName: 'bretonnians.jpg' }
  ],
  alliance: [
    { idAlliance: 1, allianceName: 'Forces du Bien' },
    { idAlliance: 2, allianceName: 'Forces du Mal' },
    { idAlliance: 3, allianceName: 'Neutres' },
    { idAlliance: 4, allianceName: 'Aucune Alliance' }
  ],
  scenario: [
    { idScenario: 1, scenarioName: 'Bataille rangée' },
    { idScenario: 2, scenarioName: 'Siège' },
    { idScenario: 3, scenarioName: 'Escarmouche' }
  ]
};

// Mock data pour les battle reports
export const mockBattleReports = [
  {
    idBattleReport: 1,
    nameBattleReport: 'Bataille de Testheim',
    descriptionBattleReport: 'Une bataille épique entre l\'Empire et les Orcs',
    armyPoints: 1000,
    idUser: 'user123',
    scenario_idScenario: 1,
    players: [
      {
        idPlayer: 1,
        name: 'Joueur Empire',
        faction: 'Empire',
        armyName: 'Armée Impériale',
        points: 500,
        battleReport_idBattleReport: 1,
        allianceId: 1
      },
      {
        idPlayer: 2,
        name: 'Joueur Orc',
        faction: 'Orcs & Goblins',
        armyName: 'Warband Orc',
        points: 500,
        battleReport_idBattleReport: 1,
        allianceId: 2
      }
    ],
    battleReportPhotos: [
      {
        id: 1,
        name: 'bataille_photo1.jpg',
        battleReport_idBattleReport: 1
      }
    ]
  }
];

// Mock players pour tester le groupement par alliance
export const mockPlayers = [
  { name: 'Player1', allianceId: 1, army: 'Empire' },
  { name: 'Player2', allianceId: 2, army: 'Orcs' },
  { name: 'Player3', allianceId: 1, army: 'Bretonnians' },
  { name: 'Player4', allianceId: null, army: 'Mercenaires' },
  { name: 'Player5', allianceId: 4, army: 'Indépendants' }
];
