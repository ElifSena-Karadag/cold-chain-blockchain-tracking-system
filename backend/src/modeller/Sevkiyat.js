import mongoose from "mongoose";

const sevkiyatSemasi = new mongoose.Schema(
  {
    asiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asi",
      required: true,
    },

    asiAdi: {
      type: String,
      required: true,
    },

    partiNo: {
      type: String,
      required: true,
    },

    dozSayisi: {
      type: String,
      required: true,
    },

    sonKullanmaTarihi: {
      type: String,
      required: true,
    },

    aliciKurumId: {
      type: String,
      required: true,
    },

    aliciKurumAdi: {
      type: String,
      required: true,
    },

    cikisNoktasi: {
      type: String,
      required: true,
    },

    varisNoktasi: {
      type: String,
      required: true,
    },

    tasimaAraci: {
      type: String,
      required: true,
    },

    tahminiTeslimSuresi: {
      type: String,
      default: "48 Saat",
    },

    sorumluPersonel: {
      type: String,
      required: true,
    },

    sensorModu: {
      type: String,
      default: "Simülasyon",
    },

    olcumAraligi: {
      type: String,
      default: "5 Saniyede Bir",
    },

    baslangicSicakligi: {
      type: Number,
      required: true,
    },

    minSicaklik: {
      type: Number,
      required: true,
    },

    maxSicaklik: {
      type: Number,
      required: true,
    },

    tasimaDurumu: {
  type: String,
  default: "Yolda",
},

riskDurumu: {
  type: String,
  default: "Güvenli",
},

teslimDurumu: {
  type: String,
  default: "Teslim Edilmedi",
},
    blockchainDurumu: {
      type: String,
      default: "Bekliyor",
    },
  },
  {
    timestamps: true,
  }
);

const Sevkiyat = mongoose.model("Sevkiyat", sevkiyatSemasi);

export default Sevkiyat;