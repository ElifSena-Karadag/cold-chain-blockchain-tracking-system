import mongoose from "mongoose";

const alarmSemasi = new mongoose.Schema(
  {
    sicaklikKaydiId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "SicaklikKaydi",
},
    sevkiyatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sevkiyat",
      required: true,
    },

    alarmTuru: {
      type: String,
      default: "Sıcaklık İhlali",
    },

    olculenSicaklik: {
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

    seviye: {
      type: String,
      default: "Kritik",
    },

    durum: {
      type: String,
      default: "Aktif",
    },

    aciklama: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
  
);

const Alarm = mongoose.model("Alarm", alarmSemasi);

export default Alarm;