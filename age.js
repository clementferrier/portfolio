function calculerAgePrecis(dateNaissance) {
  const aujourdHui = new Date();
  const naissance = new Date(dateNaissance);

  let annees = aujourdHui.getFullYear() - naissance.getFullYear();
  let anniversaireCetteAnnee = new Date(
    aujourdHui.getFullYear(),
    naissance.getMonth(),
    naissance.getDate()
  );

  // Si l'anniversaire n'est pas encore passé cette année
  if (aujourdHui < anniversaireCetteAnnee) {
    annees--;
    anniversaireCetteAnnee.setFullYear(anniversaireCetteAnnee.getFullYear() - 1);
  }

  const diffMs = aujourdHui - anniversaireCetteAnnee;
  const jours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return { annees, jours };
}

// 🔧 TA DATE DE NAISSANCE ICI
const age = calculerAgePrecis("2008-05-16");

// Affichage dans le HTML
document.getElementById("age-annees").textContent =
  age.annees.toLocaleString("fr-FR");

document.getElementById("age-jours").textContent =
  age.jours.toLocaleString("fr-FR");
