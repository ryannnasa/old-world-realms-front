/**
 * Données de test pour les tests d'intégration
 * Old World Realms - Battle Reports
 */

export const mockBattleReportsE2E = [
  {
    idBattleReport: 1,
    nameBattleReport: "La Bataille de l'Aube Sanglante",
    descriptionBattleReport: "Une bataille épique entre l'Empire et les forces du Chaos dans les plaines gelées du nord.",
    armyPoints: 2000,
    scenarioName: "Bataille rangée",
    battleDate: "2024-12-15",
    players: [
      {
        playerName: "Maximus Imperialis",
        armyName: "Empire",
        allianceName: "Forces de l'Ordre",
        isWinner: true
      },
      {
        playerName: "Khorne Bloodseeker",
        armyName: "Guerriers du Chaos",
        allianceName: "Forces du Chaos",
        isWinner: false
      }
    ]
  },
  {
    idBattleReport: 2,
    nameBattleReport: "Siège de la Forteresse Dorée",
    descriptionBattleReport: "Les Nains défendent héroïquement leur citadelle contre les hordes d'Orcs et de Gobelins.",
    armyPoints: 1500,
    scenarioName: "Siège",
    battleDate: "2024-12-10",
    players: [
      {
        playerName: "Thorek Marteau-de-Fer",
        armyName: "Forteresses Naines",
        allianceName: "Forces de l'Ordre",
        isWinner: true
      },
      {
        playerName: "Waaagh Boss Grimjaw",
        armyName: "Tribus d'Orques & Gobelins",
        allianceName: "Forces Destructrices",
        isWinner: false
      }
    ]
  },
  {
    idBattleReport: 3,
    nameBattleReport: "Duel des Arcanes",
    descriptionBattleReport: "Les Hauts Elfes affrontent les Elfes Noirs dans une bataille de magie pure.",
    armyPoints: 1000,
    scenarioName: "Bataille rangée",
    battleDate: "2024-12-05",
    players: [
      {
        playerName: "Teclis le Sage",
        armyName: "Royaumes Hauts Elfes",
        allianceName: "Forces de l'Ordre",
        isWinner: false
      },
      {
        playerName: "Malekith l'Ensorceleur",
        armyName: "Elfes Noirs",
        allianceName: "Forces Destructrices",
        isWinner: true
      }
    ]
  }
];

export const newBattleReportData = {
  title: "Test Battle E2E",
  description: "Bataille de test pour les tests d'intégration",
  points: 1000,
  scenario: "Bataille rangée",
  player1: {
    name: "Test Player 1",
    army: "Empire",
    alliance: "Forces de l'Ordre"
  },
  player2: {
    name: "Test Player 2", 
    army: "Guerriers du Chaos",
    alliance: "Forces du Chaos"
  }
};
