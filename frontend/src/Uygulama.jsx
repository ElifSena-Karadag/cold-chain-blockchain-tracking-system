import { Navigate, Route, Routes } from "react-router-dom";

import Giris from "./Giris";
import SevkiyatGecmisi from "./gonderenSayfalari/SevkiyatGecmisi";
import GonderenYerlesim from "./yerlesimler/GonderenYerlesim";
import AliciYerlesim from "./yerlesimler/AliciYerlesim";

import Dashboard from "./gonderenSayfalari/Dashboard";
import YeniSevkiyatOlustur from "./gonderenSayfalari/YeniSevkiyatOlustur";
import AktifSevkiyatlar from "./gonderenSayfalari/AktifSevkiyatlar";
import BlockchainKayitlari from "./gonderenSayfalari/BlockchainKayitlari";
import Alarmlar from "./gonderenSayfalari/Alarmlar";

import BanaGelenSevkiyatlar from "./aliciSayfalari/BanaGelenSevkiyatlar";
import CanliIzleme from "./aliciSayfalari/CanliIzleme";
import SicaklikGecmisi from "./aliciSayfalari/SicaklikGecmisi";
import AlarmKayitlari from "./aliciSayfalari/AlarmKayitlari";
import TeslimOnayi from "./aliciSayfalari/TeslimOnayi";
import GonderenCanliIzleme from "./gonderenSayfalari/CanliIzleme";

export default function Uygulama() {
  return (
    <Routes>
      <Route path="/" element={<Giris />} />

      {/* GÖNDEREN KURUM */}
      <Route path="/gonderen" element={<GonderenYerlesim />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="yeni-sevkiyat" element={<YeniSevkiyatOlustur />} />
        <Route path="aktif-sevkiyatlar" element={<AktifSevkiyatlar />} />
        <Route path="blockchain" element={<BlockchainKayitlari />} />
        <Route path="alarmlar" element={<Alarmlar />} />
        <Route path="sevkiyat-gecmisi" element={<SevkiyatGecmisi />} />
         <Route path="canli-izleme" element={<GonderenCanliIzleme />} />
         <Route
  path="/gonderen/blockchain-kayitlari"
  element={<BlockchainKayitlari />}
/>
         <Route
  path="yeni-sevkiyat-olustur"
  element={<YeniSevkiyatOlustur />}
/>
      </Route>

      {/* ALICI KURUM */}
     <Route path="/alici" element={<AliciYerlesim />}>
  <Route index element={<Navigate to="gelen-sevkiyatlar" replace />} />
  <Route path="gelen-sevkiyatlar" element={<BanaGelenSevkiyatlar />} />
  <Route path="canli-izleme" element={<CanliIzleme />} />
  <Route path="sicaklik-gecmisi" element={<SicaklikGecmisi />} />
  <Route path="alarm-kayitlari" element={<AlarmKayitlari />} />
  <Route path="teslim-onayi" element={<TeslimOnayi />} />
 
</Route>
    </Routes>
  );
}