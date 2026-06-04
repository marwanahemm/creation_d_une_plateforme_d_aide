import { describe, it, expect } from 'vitest'
import { regrouperVotesParTutoriel } from '../lib/statistiques.js'

describe('regrouperVotesParTutoriel', () => {
  it('compte les votes positifs et négatifs', () => {
    const stats = regrouperVotesParTutoriel([
      { tutoriel_id: 1, utile: true },
      { tutoriel_id: 1, utile: false },
      { tutoriel_id: 1, utile: true },
    ])
    expect(stats[1].positifs).toBe(2)
    expect(stats[1].negatifs).toBe(1)
  })

  it('sépare bien deux tutoriels différents', () => {
    const stats = regrouperVotesParTutoriel([
      { tutoriel_id: 1, utile: true },
      { tutoriel_id: 2, utile: false },
    ])
    expect(stats[1].positifs).toBe(1)
    expect(stats[2].negatifs).toBe(1)
  })

  it('retourne un objet vide pour un tableau vide', () => {
    expect(regrouperVotesParTutoriel([])).toEqual({})
  })

  it('gère null sans planter', () => {
    expect(regrouperVotesParTutoriel(null)).toEqual({})
  })
})
