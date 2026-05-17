export const gondericiKurum = {
  email: "tcasidagitim@saglik.gov.tr",
  rol: "Gönderen Kurum",
  kurumAdi:
    "T.C. Sağlık Bakanlığı Aşı ve Soğuk Zincir Dağıtım Merkezi",
};

export const iller = [
  "adana",
  "adiyaman",
  "afyonkarahisar",
  "agri",
  "amasya",
  "ankara",
  "antalya",
  "artvin",
  "aydin",
  "balikesir",
  "bilecik",
  "bingol",
  "bitlis",
  "bolu",
  "burdur",
  "bursa",
  "canakkale",
  "cankiri",
  "corum",
  "denizli",
  "diyarbakir",
  "edirne",
  "elazig",
  "erzincan",
  "erzurum",
  "eskisehir",
  "gaziantep",
  "giresun",
  "gumushane",
  "hakkari",
  "hatay",
  "isparta",
  "mersin",
  "istanbul",
  "izmir",
  "kars",
  "kastamonu",
  "kayseri",
  "kirklareli",
  "kirsehir",
  "kocaeli",
  "konya",
  "kutahya",
  "malatya",
  "manisa",
  "kahramanmaras",
  "mardin",
  "mugla",
  "mus",
  "nevsehir",
  "nigde",
  "ordu",
  "rize",
  "sakarya",
  "samsun",
  "siirt",
  "sinop",
  "sivas",
  "tekirdag",
  "tokat",
  "trabzon",
  "tunceli",
  "sanliurfa",
  "usak",
  "van",
  "yozgat",
  "zonguldak",
  "aksaray",
  "bayburt",
  "karaman",
  "kirikkale",
  "batman",
  "sirnak",
  "bartin",
  "ardahan",
  "igdir",
  "yalova",
  "karabuk",
  "kilis",
  "osmaniye",
  "duzce",
];

export const ilAdlari = {
  adana: "Adana",
  adiyaman: "Adıyaman",
  afyonkarahisar: "Afyonkarahisar",
  agri: "Ağrı",
  ankara: "Ankara",
  erzurum: "Erzurum",
  istanbul: "İstanbul",
  izmir: "İzmir",
  konya: "Konya",
  sivas: "Sivas",
};

export function kullaniciBul(email) {
  const temizEmail = email.trim().toLowerCase();

  if (temizEmail === gondericiKurum.email) {
    return gondericiKurum;
  }

  const eslesenIl = iller.find((il) => {
  const mailIl = il
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s/g, "");

  return temizEmail === `${mailIl}sehir@saglik.gov.tr`;
});

  if (!eslesenIl) {
    return null;
  }

  const gorunenIlAdi =
    ilAdlari[eslesenIl] ||
    eslesenIl.charAt(0).toUpperCase() + eslesenIl.slice(1);

  return {
    email: temizEmail,
    rol: "Alıcı Kurum",
    kurumAdi: `${gorunenIlAdi} Şehir Hastanesi`,
    il: gorunenIlAdi,
  };
}