import mongoose from "mongoose";

const asiSemasi = new mongoose.Schema(
  {
    ad: {
      type: String,
      required: true,
    },

    dozBilgisi: {
      type: String,
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

    aciklama: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Asi = mongoose.model("Asi", asiSemasi);

export default Asi;