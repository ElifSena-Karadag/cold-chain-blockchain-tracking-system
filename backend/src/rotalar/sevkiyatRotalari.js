import express from "express";

import {
  tumSevkiyatlariGetir,
  sevkiyatEkle,
  sevkiyatTeslimEt,
} from "../kontrolculer/sevkiyatKontrolcu.js";

const router = express.Router();

router.get("/", tumSevkiyatlariGetir);

router.post("/", sevkiyatEkle);

router.put(
  "/:id/teslim",
  sevkiyatTeslimEt
);

export default router;