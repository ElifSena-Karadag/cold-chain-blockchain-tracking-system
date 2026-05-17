import SHA256 from "crypto-js/sha256.js";

import SicaklikKaydi from "../modeller/SicaklikKaydi.js";
import Sevkiyat from "../modeller/Sevkiyat.js";
import Alarm from "../modeller/Alarm.js";
import BlockchainKaydi from "../modeller/BlockchainKaydi.js";

import { blockchainKaydiOlustur } from "../servisler/blockchainServisi.js";

function sicaklikDurumuHesapla(kayit) {
  return Number(kayit.sicaklik) < kayit.minSicaklik ||
    Number(kayit.sicaklik) > kayit.maxSicaklik
    ? "İhlal"
    : "Normal";
}

function sicaklikBlockchainVerisiOlustur(kayit) {
  return {
    sicaklikKaydiId: kayit._id.toString(),
    sicaklik: Number(kayit.sicaklik),
    minSicaklik: kayit.minSicaklik,
    maxSicaklik: kayit.maxSicaklik,
    durum: kayit.durum,
    konum: kayit.konum,
  };
}

async function sevkiyatRiskDurumunuGuncelle(sevkiyatId) {
  const ihlalVarMi = await SicaklikKaydi.exists({
    sevkiyatId,
    durum: "İhlal",
  });

  await Sevkiyat.findByIdAndUpdate(sevkiyatId, {
    riskDurumu: ihlalVarMi ? "Riskli" : "Güvenli",
  });
}

async function sevkiyatBlockchainDurumunuGuncelle(sevkiyatId) {
  const supheliKayitVarMi = await BlockchainKaydi.exists({
    sevkiyatId,
    durum: "Şüpheli",
  });

  await Sevkiyat.findByIdAndUpdate(sevkiyatId, {
    blockchainDurumu: supheliKayitVarMi
      ? "Şüpheli"
      : "Doğrulandı",
  });
}

async function sicaklikKayitlariniSenkronizeEt(sevkiyatId) {
  const kayitlar = await SicaklikKaydi.find({ sevkiyatId }).sort({
    createdAt: 1,
  });

  for (const kayit of kayitlar) {
    const yeniDurum = sicaklikDurumuHesapla(kayit);

    if (kayit.durum !== yeniDurum) {
      kayit.durum = yeniDurum;
      await kayit.save();
    }

    if (yeniDurum === "Normal") {
      await Alarm.deleteMany({
        sicaklikKaydiId: kayit._id,
      });
    }

    if (yeniDurum === "İhlal") {
      const mevcutAlarm = await Alarm.findOne({
        sicaklikKaydiId: kayit._id,
      });

      if (!mevcutAlarm) {
        await Alarm.create({
          sevkiyatId,
          sicaklikKaydiId: kayit._id,
          olculenSicaklik: kayit.sicaklik,
          minSicaklik: kayit.minSicaklik,
          maxSicaklik: kayit.maxSicaklik,
          aciklama: "Sıcaklık izin verilen aralığın dışına çıktı.",
        });
      }
    }

    const blockchainKaydi = await BlockchainKaydi.findOne({
      islemTuru: "SICAKLIK_KAYDI",
      "veri.sicaklikKaydiId": kayit._id.toString(),
    });

    if (blockchainKaydi) {
      const guncelVeri = sicaklikBlockchainVerisiOlustur(kayit);
      const guncelHash = SHA256(JSON.stringify(guncelVeri)).toString();

      const yeniBlockchainDurumu =
        guncelHash === blockchainKaydi.hash ? "Doğrulandı" : "Şüpheli";

      blockchainKaydi.durum = yeniBlockchainDurumu;
      await blockchainKaydi.save();

      kayit.blockchainDurumu = yeniBlockchainDurumu;
      await kayit.save();
    }
  }

  await sevkiyatRiskDurumunuGuncelle(sevkiyatId);
  await sevkiyatBlockchainDurumunuGuncelle(sevkiyatId);

  return SicaklikKaydi.find({ sevkiyatId }).sort({ createdAt: 1 });
}

export async function sevkiyatSicakliklariniGetir(istek, cevap) {
  try {
    const kayitlar = await sicaklikKayitlariniSenkronizeEt(
      istek.params.sevkiyatId
    );

    cevap.status(200).json(kayitlar);
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Sıcaklık kayıtları alınamadı",
    });
  }
}

export async function sicaklikKaydiEkle(istek, cevap) {
  try {
    const { sevkiyatId, sicaklik, konum } = istek.body;

    const sevkiyat = await Sevkiyat.findById(sevkiyatId);

    if (!sevkiyat) {
      return cevap.status(404).json({
        mesaj: "Sevkiyat bulunamadı",
      });
    }

    const ihlalVarMi =
      Number(sicaklik) < sevkiyat.minSicaklik ||
      Number(sicaklik) > sevkiyat.maxSicaklik;

    const yeniKayit = await SicaklikKaydi.create({
      sevkiyatId: sevkiyat._id,
      sicaklik: Number(sicaklik),
      minSicaklik: sevkiyat.minSicaklik,
      maxSicaklik: sevkiyat.maxSicaklik,
      durum: ihlalVarMi ? "İhlal" : "Normal",
      konum: konum || "Simülasyon",
      blockchainDurumu: "Bekliyor",
    });

    await blockchainKaydiOlustur({
      sevkiyatId: sevkiyat._id,
      islemTuru: "SICAKLIK_KAYDI",
      veri: sicaklikBlockchainVerisiOlustur(yeniKayit),
      aciklama: "Sıcaklık kaydı blockchain ağına kaydedildi",
    });

    if (ihlalVarMi) {
      sevkiyat.riskDurumu = "Riskli";
      await sevkiyat.save();

      await Alarm.create({
        sevkiyatId: sevkiyat._id,
        sicaklikKaydiId: yeniKayit._id,
        olculenSicaklik: Number(sicaklik),
        minSicaklik: sevkiyat.minSicaklik,
        maxSicaklik: sevkiyat.maxSicaklik,
        aciklama: "Sıcaklık izin verilen aralığın dışına çıktı.",
      });
    }

    const guncelKayitlar = await sicaklikKayitlariniSenkronizeEt(
      sevkiyat._id
    );

    cevap.status(201).json({
      mesaj: "Sıcaklık kaydı oluşturuldu",
      veri: yeniKayit,
      kayitlar: guncelKayitlar,
    });
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Sıcaklık kaydı oluşturulamadı",
    });
  }
}