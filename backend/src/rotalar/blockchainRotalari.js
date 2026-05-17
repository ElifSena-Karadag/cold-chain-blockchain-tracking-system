import express from "express";

import {
  tumBlockchainKayitlariniGetir,
  blockchainKaydiDogrula,
} from "../kontrolculer/blockchainKontrolcu.js";

const router = express.Router();

router.get("/", tumBlockchainKayitlariniGetir);

router.get("/dogrula/:id", blockchainKaydiDogrula);

export default router;