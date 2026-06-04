export function regrouperVotesParTutoriel(feedbacks) {
  const statistiquesParTutoriel = {}
  ;(feedbacks || []).forEach(feedback => {
    if (!statistiquesParTutoriel[feedback.tutoriel_id]) {
      statistiquesParTutoriel[feedback.tutoriel_id] = { positifs: 0, negatifs: 0 }
    }
    feedback.utile
      ? statistiquesParTutoriel[feedback.tutoriel_id].positifs++
      : statistiquesParTutoriel[feedback.tutoriel_id].negatifs++
  })
  return statistiquesParTutoriel
}