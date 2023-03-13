export const langText = {
  en: {
    camera: {
      button: "Take a Picture",
    },
    AddItem: {
      nameInput: "Name",
      expirationDateInput: "Expiration Date",
      amountInput: "Amount",
      submitButton: "Put item in Fridge",
    },
    navbar: {
      Settings: "Settings",
      AddItem: "Add Item",
      Fridge: "Fridge",
    },
    Fridge: {
      emptyMessage: "Your fridge is empty ;´(",
      Unknown: "Unknown",
      Expired: "Expired",
      "1Day": "a Day",
      "2Day": "2 Days",
      "3Day": "3 Days",
      "4Day": "4 Days",
      "5Day": "5 Days",
      "6Day": "6 Days",
      "1Week": "a Week",
      "2Week": "> 2 Weeks",
      "1Month": "a Month",
      "2Month": "> 2 Months",
      "6Month": "> 6 Months",
      "12Month": "> 12 Months",
    },
    Settings: {
      langLabel: "Language",
    },
    Item: {
      dateLabel: "Experations Date",
      timeLabel: "Expires in",
      amountLabel: "Amount",
      removeButton: "Remove item from Fridge",
      expired: "Expired",
      unknown: "Unknown",
      locale: "en-GB",
      confirm1: 'Are you sure you want to remove "',
      confirm2: '" from your Fridge?',
    },
    datetime: {
      year: "Year(s)",
      month: "Month(s)",
      week: "Week(s)",
      day: "Day(s)",
    },
  },
  da: {
    camera: {
      button: "Tag et Billede",
    },
    AddItem: {
      nameInput: "Navn",
      expirationDateInput: "Udløbsdato",
      amountInput: "Mængde",
      submitButton: "Læg tingen i Køleskabet",
    },
    navbar: {
      Settings: "indstillinger",
      AddItem: "Tilføj Ting",
      Fridge: "Køleskab",
    },
    Fridge: {
      emptyMessage: "Dit køleskab er tomt ;´(",
      Unknown: "Ukendt",
      Expired: "Udløbet",
      "1Day": "en Dag",
      "2Day": "2 Dage",
      "3Day": "3 Dage",
      "4Day": "4 Dage",
      "5Day": "5 Dage",
      "6Day": "6 Dage",
      "1Week": "en Uge",
      "2Week": "> 2 Uger",
      "1Month": "en Måned",
      "2Month": "> 2 Måneder",
      "6Month": "> 6 Måneder",
      "12Month": "> 12 Måneder",
    },
    Settings: {
      langLabel: "Sprog",
    },
    Item: {
      dateLabel: "Udløbelsesdato",
      timeLabel: "Udløber om",
      amountLabel: "Mængde",
      removeButton: "Fjern tingen fra Køleskabet",
      expired: "Udløbet",
      unknown: "Ukendt",
      locale: "da-DK",
      confirm1: 'Er du sikker på at du vil fjerne "',
      confirm2: '" fra dit Køleskab?',
    },
    datetime: {
      year: "År",
      month: "Måned(er)",
      week: "Uge(r)",
      day: "Dag(e)",
    },
  },
  de: {
    camera: {
      button: "Nehme ein Bild auf",
    },
    AddItem: {
      nameInput: "Name",
      expirationDateInput: "Mindesthaltbarkeitsdatum",
      amountInput: "Menge",
      submitButton: "Gegenstand in den Kühlschrank hinzufügen",
    },
    navbar: {
      Settings: "Einstellungen",
      AddItem: "Gegenstand hinzufügen",
      Fridge: "Kühlschrank",
    },
    Fridge: {
      emptyMessage: "Dein Kühlschrank ist leer )`;",
      Unknown: "Unbekannt",
      Expired: "Abgelaufen",
      "1Day": "Ein Tag",
      "2Day": "Zwei Tage",
      "3Day": "Drei Tage",
      "4Day": "Vier Tage",
      "5Day": "Fünf Tage",
      "6Day": "Sechs Tage",
      "1Week": "Eine Woche",
      "2Week": "> Zwei Wochen",
      "1Month": "Ein Monat",
      "2Month": "> Zwei Monate",
      "6Month": "> Sechs Monate",
      "12Month": "> Zwölf Monate",
    },
    Settings: {
      langLabel: "Sprache",
    },
    Item: {
      dateLabel: "Ablaufsdatum",
      timeLabel: "Läuft ab in ",
      amountLabel: "Menge",
      removeButton: "Gegenstand vom Kühlschrank entfernen",
      expired: "Abgelaufen",
      unknown: "Unbekannt",
      locale: "de-DE",
      confirm1: 'Bist du dir sicher, dass du den Gegenstand "',
      confirm2: '" von deinem Kühlschrank entfernen möchtest?',
    },
    datetime: {
      year: "Jahr(e)",
      month: "Monat(e)",
      week: "Woche(n)",
      day: "Tag(e)",
    },
  },
};

export function getLang() {
  return window.localStorage.getItem("lang");
}

export function setLang(lang) {
  navigator.serviceWorker.ready.then((reg) => {
    reg.active.postMessage(JSON.stringify({ c: "LANG", d: lang }));
  });

  return window.localStorage.setItem("lang", lang);
}
