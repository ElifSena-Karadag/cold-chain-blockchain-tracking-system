import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import alarmRotalari from "./rotalar/alarmRotalari.js";
import { veritabaninaBaglan } from "./ayarlar/veritabani.js";
import sicaklikRotalari from "./rotalar/sicaklikRotalari.js";
import asiRotalari from "./rotalar/asiRotalari.js";
import sevkiyatRotalari from "./rotalar/sevkiyatRotalari.js";
import blockchainRotalari from "./rotalar/blockchainRotalari.js";

dotenv.config();

veritabaninaBaglan();

const uygulama = express();

uygulama.use(cors());
uygulama.use(express.json());

uygulama.use("/api/asilar", asiRotalari);
uygulama.use("/api/sevkiyatlar", sevkiyatRotalari);
uygulama.use("/api/blockchain", blockchainRotalari);
uygulama.use("/api/alarmlar", alarmRotalari);
uygulama.use("/api/sicaklik", sicaklikRotalari);
uygulama.get("/", (istek, cevap) => {
  cevap.json({
    mesaj: "Cold Chain Backend Çalışıyor 🚀",
  });
});

const PORT = process.env.PORT || 5000;

uygulama.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});