/* ============================================================
   Belfond Store — Comportements du site
   Thème clair/sombre · Horloge et date de Port-au-Prince
   Météo en temps réel (Open-Meteo, sans clé) · Révélations
   Réalisé par Lesly Tech LLC
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Thème clair / sombre ---------- */
  var THEME_KEY = "belfond-theme";

  function iconeTheme() {
    var btn = document.querySelector(".theme-btn");
    if (!btn) return;
    var sombre = document.documentElement.getAttribute("data-theme") === "dark";
    btn.textContent = sombre ? "☀️" : "🌙";
  }

  function basculerTheme() {
    var sombre = document.documentElement.getAttribute("data-theme") === "dark";
    var nouveau = sombre ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nouveau);
    try { localStorage.setItem(THEME_KEY, nouveau); } catch (e) { /* ignore */ }
    iconeTheme();
  }

  var themeBtn = document.querySelector(".theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", basculerTheme);
  iconeTheme();

  /* ---------- Horloge et date — Port-au-Prince ---------- */
  var FUSEAU = "America/Port-au-Prince";
  var elHeure = document.getElementById("heure-live");
  var elDate = document.getElementById("date-live");

  function localeActive() {
    return (window.BelfondI18n && BelfondI18n.getLang() === "fr") ? "fr-FR" : "ht";
  }

  /* Chrome ne connaît pas la locale « ht » pour Intl : on compose la date
     créole à la main pour éviter le repli en anglais. */
  var JOURS_HT = { Monday: "Lendi", Tuesday: "Madi", Wednesday: "Mèkredi", Thursday: "Jedi", Friday: "Vandredi", Saturday: "Samdi", Sunday: "Dimanch" };
  var MOIS_HT = ["Janvye", "Fevriye", "Mas", "Avril", "Me", "Jen", "Jiyè", "Out", "Septanm", "Oktòb", "Novanm", "Desanm"];

  function dateKreyol(now) {
    var p = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: FUSEAU, weekday: "long", day: "numeric", month: "numeric", year: "numeric"
    }).formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    return (JOURS_HT[p.weekday] || p.weekday) + " " + p.day + " " + MOIS_HT[parseInt(p.month, 10) - 1] + " " + p.year;
  }

  function majHorloge() {
    var now = new Date();
    try {
      if (elDate) {
        if (localeActive() === "ht") {
          elDate.textContent = dateKreyol(now);
        } else {
          var dateTxt = new Intl.DateTimeFormat("fr-FR", {
            timeZone: FUSEAU, weekday: "long", day: "numeric", month: "long", year: "numeric"
          }).format(now);
          elDate.textContent = dateTxt.charAt(0).toUpperCase() + dateTxt.slice(1);
        }
      }
      if (elHeure) {
        elHeure.textContent = new Intl.DateTimeFormat(localeActive(), {
          timeZone: FUSEAU, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
        }).format(now);
      }
    } catch (e) {
      if (elHeure) elHeure.textContent = "--:--:--";
      if (elDate) elDate.textContent = "—";
    }
  }

  if (elHeure || elDate) {
    majHorloge();
    setInterval(majHorloge, 1000);
  }

  /* ---------- Météo — Open-Meteo (gratuit, sans clé) ---------- */
  var METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=18.5944&longitude=-72.3074&current=temperature_2m,weather_code,relative_humidity_2m&timezone=America%2FPort-au-Prince";

  var CODES = {
    0:  { i: "☀️", ht: "Soley", fr: "Ensoleillé" },
    1:  { i: "🌤️", ht: "Prèske soley", fr: "Plutôt ensoleillé" },
    2:  { i: "⛅", ht: "Nyaj an pati", fr: "Partiellement nuageux" },
    3:  { i: "☁️", ht: "Nyaj", fr: "Nuageux" },
    45: { i: "🌫️", ht: "Bwouya", fr: "Brouillard" },
    48: { i: "🌫️", ht: "Bwouya", fr: "Brouillard" },
    51: { i: "🌦️", ht: "Ti lapli lejè", fr: "Bruine légère" },
    53: { i: "🌦️", ht: "Ti lapli", fr: "Bruine" },
    55: { i: "🌦️", ht: "Ti lapli fò", fr: "Bruine dense" },
    56: { i: "🌧️", ht: "Ti lapli glase", fr: "Bruine verglaçante" },
    57: { i: "🌧️", ht: "Ti lapli glase", fr: "Bruine verglaçante" },
    61: { i: "🌧️", ht: "Lapli lejè", fr: "Pluie faible" },
    63: { i: "🌧️", ht: "Lapli", fr: "Pluie" },
    65: { i: "🌧️", ht: "Gros lapli", fr: "Pluie forte" },
    66: { i: "🌧️", ht: "Lapli glase", fr: "Pluie verglaçante" },
    67: { i: "🌧️", ht: "Lapli glase", fr: "Pluie verglaçante" },
    71: { i: "❄️", ht: "Lanèj", fr: "Neige" },
    73: { i: "❄️", ht: "Lanèj", fr: "Neige" },
    75: { i: "❄️", ht: "Lanèj", fr: "Neige" },
    77: { i: "❄️", ht: "Lanèj", fr: "Neige" },
    80: { i: "🌦️", ht: "Avers lejè", fr: "Averses légères" },
    81: { i: "🌦️", ht: "Avers", fr: "Averses" },
    82: { i: "⛈️", ht: "Gros avers", fr: "Averses violentes" },
    85: { i: "❄️", ht: "Avers lanèj", fr: "Averses de neige" },
    86: { i: "❄️", ht: "Avers lanèj", fr: "Averses de neige" },
    95: { i: "⛈️", ht: "Loraj", fr: "Orage" },
    96: { i: "⛈️", ht: "Loraj ak grèl", fr: "Orage avec grêle" },
    99: { i: "⛈️", ht: "Loraj ak grèl", fr: "Orage avec grêle" }
  };

  var elMeteo = document.getElementById("meteo-live");
  var meteoData = null;

  function rendreMeteo() {
    if (!elMeteo) return;
    if (!meteoData) {
      elMeteo.textContent = "—";
      return;
    }
    var lang = (window.BelfondI18n && BelfondI18n.getLang() === "fr") ? "fr" : "ht";
    var c = CODES[meteoData.code] || { i: "🌡️", ht: "—", fr: "—" };
    var dict = window.BelfondI18n ? BelfondI18n.dict() : {};
    var libHum = dict["meteo.imidite"] || (lang === "fr" ? "Humidité" : "Imidite");
    var morceaux = [c.i + " " + Math.round(meteoData.temp) + " °C", c[lang]];
    if (meteoData.hum != null) morceaux.push("💧 " + libHum + " : " + Math.round(meteoData.hum) + " %");
    elMeteo.textContent = morceaux.join(" · ");
  }

  if (elMeteo) {
    rendreMeteo();
    if (window.fetch) {
      fetch(METEO_URL)
        .then(function (r) { if (!r.ok) throw new Error("meteo"); return r.json(); })
        .then(function (j) {
          if (j && j.current) {
            meteoData = {
              temp: j.current.temperature_2m,
              code: j.current.weather_code,
              hum: j.current.relative_humidity_2m
            };
          }
          rendreMeteo();
        })
        .catch(function () { meteoData = null; rendreMeteo(); });
    }
  }

  /* ---------- Changement de langue : horloge + météo suivent ---------- */
  window.addEventListener("belfond:langchange", function () {
    majHorloge();
    rendreMeteo();
  });

  /* ---------- Révélation douce des sections au défilement ---------- */
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("visible"); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { obs.observe(e); });
  }
})();
