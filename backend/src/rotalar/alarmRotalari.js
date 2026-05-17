import express from "express";

import {
  tumAlarmlariGetir,
} from "../kontrolculer/alarmKontrolcu.js";

const router = express.Router();

router.get("/", tumAlarmlariGetir);

export default router;