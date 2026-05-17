import mongoose from "mongoose";

const blockchainKaydiSemasi = new mongoose.Schema(
  {
    veri: {
  type: Object,
  required: true,
},
    sevkiyatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sevkiyat",
      required: true,
    },

    islemTuru: {
      type: String,
      required: true,
    },

    hash: {
      type: String,
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },

    durum: {
      type: String,
      default: "Doğrulandı",
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

const BlockchainKaydi = mongoose.model(
  "BlockchainKaydi",
  blockchainKaydiSemasi
);

export default BlockchainKaydi;