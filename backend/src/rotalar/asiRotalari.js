import express from "express";

import {
  tumAsilariGetir,
  asiEkle,
} from "../kontrolculer/asiKontrolcu.js";

const router = express.Router();

router.get("/", tumAsilariGetir);

router.post("/", asiEkle);

export default router;