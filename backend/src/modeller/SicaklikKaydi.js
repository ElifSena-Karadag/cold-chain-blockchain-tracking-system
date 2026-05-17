import mongoose from "mongoose";

const sicaklikKaydiSemasi = new mongoose.Schema(
  {
    sevkiyatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sevkiyat",
      required: true,
    },

    sicaklik: {
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

    durum: {
      type: String,
      default: "Normal",
    },

    konum: {
      type: String,
      default: "Simülasyon",
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

const SicaklikKaydi = mongoose.model(
  "SicaklikKaydi",
  sicaklikKaydiSemasi
);

export default SicaklikKaydi;