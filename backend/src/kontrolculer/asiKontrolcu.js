import Asi from "../modeller/Asi.js";

export async function tumAsilariGetir(
  istek,
  cevap
) {
  try {
    const asilar = await Asi.find();

    cevap.status(200).json(asilar);
  } catch (hata) {
    cevap.status(500).json({
      mesaj: "Aşılar alınamadı",
    });
  }
}

export async function asiEkle(
  istek,
  cevap
) {
  try {
    const yeniAsi = new Asi({
      ad: istek.body.ad,
      dozBilgisi: istek.body.dozBilgisi,
      minSicaklik: istek.body.minSicaklik,
      maxSicaklik: istek.body.maxSicaklik,
      aciklama: istek.body.aciklama,
    });

    await yeniAsi.save();

    cevap.status(201).json({
      mesaj: "Aşı eklendi",
      veri: yeniAsi,
    });
  } catch (hata) {
    cevap.status(500).json({
      mesaj: "Aşı eklenemedi",
    });
  }
}