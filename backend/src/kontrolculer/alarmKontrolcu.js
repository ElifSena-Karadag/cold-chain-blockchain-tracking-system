import Alarm from "../modeller/Alarm.js";

export async function tumAlarmlariGetir(istek, cevap) {
  try {
    const alarmlar = await Alarm.find()
      .populate("sevkiyatId")
      .sort({ createdAt: -1 });

    cevap.status(200).json(alarmlar);
  } catch (hata) {
    cevap.status(500).json({
      mesaj: "Alarmlar alınamadı",
    });
  }
}