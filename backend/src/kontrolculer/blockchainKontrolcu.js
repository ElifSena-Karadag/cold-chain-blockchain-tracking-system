import SHA256 from "crypto-js/sha256.js";

import BlockchainKaydi from "../modeller/BlockchainKaydi.js";
import SicaklikKaydi from "../modeller/SicaklikKaydi.js";

async function dogrulanacakVeriyiOlustur(kayit) {
  if (kayit.islemTuru === "SICAKLIK_KAYDI") {
    const sicaklikKaydiId = kayit.veri?.sicaklikKaydiId;

    if (!sicaklikKaydiId) {
      return null;
    }

    const sicaklikKaydi = await SicaklikKaydi.findById(sicaklikKaydiId);

    if (!sicaklikKaydi) {
      return null;
    }

    return {
      sicaklikKaydiId: sicaklikKaydi._id.toString(),
      sicaklik: sicaklikKaydi.sicaklik,
      minSicaklik: sicaklikKaydi.minSicaklik,
      maxSicaklik: sicaklikKaydi.maxSicaklik,
      durum: sicaklikKaydi.durum,
      konum: sicaklikKaydi.konum,
    };
  }

  return kayit.veri;
}

async function hashDogrula(kayit) {
  const dogrulanacakVeri = await dogrulanacakVeriyiOlustur(kayit);

  if (!dogrulanacakVeri) {
    return "Şüpheli";
  }

  const yeniHash = SHA256(
    JSON.stringify(dogrulanacakVeri)
  ).toString();

  return yeniHash === kayit.hash ? "Doğrulandı" : "Şüpheli";
}

export async function tumBlockchainKayitlariniGetir(istek, cevap) {
  try {
    const kayitlar = await BlockchainKaydi.find()
      .populate("sevkiyatId")
      .sort({ createdAt: -1 });

    for (const kayit of kayitlar) {
      const yeniDurum = await hashDogrula(kayit);

      if (kayit.durum !== yeniDurum) {
        kayit.durum = yeniDurum;
        await kayit.save();
      }

      if (kayit.islemTuru === "SICAKLIK_KAYDI") {
        const sicaklikKaydiId = kayit.veri?.sicaklikKaydiId;

        if (sicaklikKaydiId) {
          await SicaklikKaydi.findByIdAndUpdate(sicaklikKaydiId, {
            blockchainDurumu: yeniDurum,
          });
        }
      }
    }

    const guncelKayitlar = await BlockchainKaydi.find()
      .populate("sevkiyatId")
      .sort({ createdAt: -1 });

    cevap.status(200).json(guncelKayitlar);
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Blockchain kayıtları alınamadı",
    });
  }
}

export async function blockchainKaydiDogrula(istek, cevap) {
  try {
    const kayit = await BlockchainKaydi.findById(istek.params.id);

    if (!kayit) {
      return cevap.status(404).json({
        mesaj: "Blockchain kaydı bulunamadı",
      });
    }

    const yeniDurum = await hashDogrula(kayit);

    kayit.durum = yeniDurum;
    await kayit.save();

    if (kayit.islemTuru === "SICAKLIK_KAYDI") {
      const sicaklikKaydiId = kayit.veri?.sicaklikKaydiId;

      if (sicaklikKaydiId) {
        await SicaklikKaydi.findByIdAndUpdate(sicaklikKaydiId, {
          blockchainDurumu: yeniDurum,
        });
      }
    }

    cevap.status(200).json({
      dogruMu: yeniDurum === "Doğrulandı",
      blockchainHash: kayit.hash,
      durum: yeniDurum,
      mesaj:
        yeniDurum === "Doğrulandı"
          ? "Hash otomatik doğrulandı."
          : "Hash uyuşmuyor. Veri değiştirilmiş olabilir.",
    });
  } catch (hata) {
    console.log(hata);

    cevap.status(500).json({
      mesaj: "Hash doğrulama sırasında hata oluştu",
    });
  }
}