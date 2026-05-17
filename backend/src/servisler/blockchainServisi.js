import SHA256 from "crypto-js/sha256.js";
import BlockchainKaydi from "../modeller/BlockchainKaydi.js";

export async function blockchainKaydiOlustur({
  sevkiyatId,
  islemTuru,
  veri,
  aciklama = "",
}) {
  const hashVerisi = JSON.stringify(veri);
  const hash = SHA256(hashVerisi).toString();

  const transactionId = `TX-${Date.now()}`;

  const yeniBlockchainKaydi = new BlockchainKaydi({
    sevkiyatId,
    islemTuru,
    veri,
    hash,
    transactionId,
    durum: "Bekliyor",
    aciklama,
  });

  await yeniBlockchainKaydi.save();

  return yeniBlockchainKaydi;
}