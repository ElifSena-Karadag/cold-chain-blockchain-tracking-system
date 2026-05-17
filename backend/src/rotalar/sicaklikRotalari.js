import express from "express";

import {
  sevkiyatSicakliklariniGetir,
  sicaklikKaydiEkle,
} from "../kontrolculer/sicaklikKontrolcu.js";

const router = express.Router();

router.get("/:sevkiyatId", sevkiyatSicakliklariniGetir);

router.post("/", sicaklikKaydiEkle);

export default router;