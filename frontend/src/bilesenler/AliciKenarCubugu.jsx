import {
  Building2,
  Home,
  Thermometer,
  Bell,
  CheckCircle,
  Clock3,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuOgeleri = [
  {
    baslik: "Bana Gelen Sevkiyatlar",
    yol: "/alici/gelen-sevkiyatlar",
    ikon: Home,
  },
  {
    baslik: "Canlı İzleme",
    yol: "/alici/canli-izleme",
    ikon: Thermometer,
  },
  {
    baslik: "Sıcaklık Geçmişi",
    yol: "/alici/sicaklik-gecmisi",
    ikon: Clock3,
  },
  {
    baslik: "Alarm Kayıtları",
    yol: "/alici/alarm-kayitlari",
    ikon: Bell,
  },
  {
    baslik: "Teslim Onayı",
    yol: "/alici/teslim-onayi",
    ikon: CheckCircle,
  },
];

export default function AliciKenarCubugu() {
  return (
    <aside className="kenar-cubugu">
      <div className="logo-alani">
        <Building2 size={30} />
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