import Sevkiyat from "../modeller/Sevkiyat.js";
import Alarm from "../modeller/Alarm.js";
import SicaklikKaydi from "../modeller/SicaklikKaydi.js";
import { blockchainKaydiOlustur } from "../servisler/blockchainServisi.js";


export async function tumSevkiyatlariGetir(istek, cevap) {
  try {
    const sevkiyatlar = await Sevkiyat.find().sort({
      createdAt: -1,
    });

    const sevkiyatlarSonSicaklikli = await Promise.all(
      sevkiyatlar.map(async (sevkiyat) => {
        const sonKayit = await SicaklikKaydi.findOne({
          sevkiyatId: sevkiyat._id,
        }).sort({ createdAt: -1 });

        const sevkiyatObjesi = sevkiyat.toObject();

        return {
          ...sevkiyatObjesi,
          sonSicaklik:
            sonKayit?.sicaklik ?? sevkiyat.sonSicaklik,
        };
      })
    );

    cevap.status(200).json(sevkiyatlarSonSicaklikli);
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Sevkiyatlar alınamadı",
    });
  }
}

export async function sevkiyatEkle(istek, cevap) {
  try {
    const yeniSevkiyat = new Sevkiyat({
      ...istek.body,

      tasimaDurumu: "Yolda",
      riskDurumu: "Güvenli",
      teslimDurumu: "Teslim Edilmedi",
    });

    await yeniSevkiyat.save();

    const sicaklikIhlaliVarMi =
      yeniSevkiyat.baslangicSicakligi < yeniSevkiyat.minSicaklik ||
      yeniSevkiyat.baslangicSicakligi > yeniSevkiyat.maxSicaklik;

    await SicaklikKaydi.create({
      sevkiyatId: yeniSevkiyat._id,
      sicaklik: yeniSevkiyat.baslangicSicakligi,
      minSicaklik: yeniSevkiyat.minSicaklik,
      maxSicaklik: yeniSevkiyat.maxSicaklik,
      durum: sicaklikIhlaliVarMi ? "İhlal" : "Normal",
      konum: yeniSevkiyat.cikisNoktasi,
      blockchainDurumu: "Doğrulandı",
    });

    await blockchainKaydiOlustur({
      sevkiyatId: yeniSevkiyat._id,
      islemTuru: "SEVKIYAT_OLUSTURULDU",
      veri: {
        asiAdi: yeniSevkiyat.asiAdi,
        partiNo: yeniSevkiyat.partiNo,
        aliciKurumAdi: yeniSevkiyat.aliciKurumAdi,
        cikisNoktasi: yeniSevkiyat.cikisNoktasi,
        varisNoktasi: yeniSevkiyat.varisNoktasi,
        baslangicSicakligi: yeniSevkiyat.baslangicSicakligi,
      },
      aciklama: "Yeni sevkiyat blockchain ağına kaydedildi",
    });

    if (sicaklikIhlaliVarMi) {
      yeniSevkiyat.riskDurumu = "Riskli";

      await Alarm.create({
        sevkiyatId: yeniSevkiyat._id,
        olculenSicaklik: yeniSevkiyat.baslangicSicakligi,
        minSicaklik: yeniSevkiyat.minSicaklik,
        maxSicaklik: yeniSevkiyat.maxSicaklik,
        aciklama: "Sıcaklık izin verilen aralığın dışına çıktı.",
      });

      await blockchainKaydiOlustur({
        sevkiyatId: yeniSevkiyat._id,
        islemTuru: "SICAKLIK_IHLALI",
        veri: {
          sicaklik: yeniSevkiyat.baslangicSicakligi,
          min: yeniSevkiyat.minSicaklik,
          max: yeniSevkiyat.maxSicaklik,
        },
        aciklama: "Sıcaklık ihlali blockchain ağına kaydedildi",
      });
    }

    yeniSevkiyat.blockchainDurumu = "Doğrulandı";
    await yeniSevkiyat.save();

    cevap.status(201).json({
      mesaj: "Sevkiyat oluşturuldu",
      veri: yeniSevkiyat,
    });
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Sevkiyat oluşturulamadı",
    });
  }
}

export async function sevkiyatTeslimEt(istek, cevap) {
  try {
    const sevkiyat = await Sevkiyat.findById(istek.params.id);

    if (!sevkiyat) {
      return cevap.status(404).json({
        mesaj: "Sevkiyat bulunamadı",
      });
    }

    sevkiyat.tasimaDurumu = "Teslim Edildi";
    sevkiyat.teslimDurumu = "Teslim Edildi";

    await sevkiyat.save();

    await blockchainKaydiOlustur({
      sevkiyatId: sevkiyat._id,
      islemTuru: "TESLIM_ONAYI",
      veri: {
        asiAdi: sevkiyat.asiAdi,
        partiNo: sevkiyat.partiNo,
        aliciKurumAdi: sevkiyat.aliciKurumAdi,
        teslimDurumu: "Teslim Edildi",
      },
      aciklama: "Teslim onayı blockchain ağına kaydedildi",
    });

    cevap.status(200).json({
      mesaj: "Sevkiyat teslim edildi",
      veri: sevkiyat,
    });
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Teslim onayı sırasında hata oluştu",
    });
  }
}