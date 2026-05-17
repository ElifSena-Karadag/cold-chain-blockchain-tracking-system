import {
  Home,
  Plus,
  Truck,
  Layers3,
  Bell,
  Boxes,
  Archive,
  Activity,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuOgeleri = [
  {
    baslik: "Dashboard",
    yol: "/gonderen/dashboard",
    ikon: Home,
  },
  {
    baslik: "Yeni Sevkiyat Oluştur",
    yol: "/gonderen/yeni-sevkiyat",
    ikon: Plus,
  },
  {
    baslik: "Aktif Sevkiyatlar",
    yol: "/gonderen/aktif-sevkiyatlar",
    ikon: Truck,
  },
  {
    baslik: "Blockchain Kayıtları",
    yol: "/gonderen/blockchain",
    ikon: Layers3,
  },
  {
    baslik: "Alarmlar",
    yol: "/gonderen/alarmlar",
    ikon: Bell,
  },
  {
  baslik: "Sevkiyat Geçmişi",
  yol: "/gonderen/sevkiyat-gecmisi",
  ikon: Archive,
},
  {
  baslik: "Canlı İzleme",
  yol: "/gonderen/canli-izleme",
  ikon: Activity,
},
];

export default function KenarCubugu() {
  return (
    <aside className="kenar-cubugu">
      <div className="logo-alani">
        <Boxes size={30} />
        <span>
          <b>COLD</b>CHAIN PRO
        </span>
      </div>

      <nav className="menu-alani">
        {menuOgeleri.map((oge) => {
          const Ikon = oge.ikon;

          return (
            <NavLink
              key={oge.yol}
              to={oge.yol}
              className="menu-link"
            >
              <Ikon size={20} />
              <span>{oge.baslik}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}