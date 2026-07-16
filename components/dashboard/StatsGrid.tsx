import {
    Home,
    Users,
    Building2,
    DollarSign
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid(){

return(

<div className="grid grid-cols-4 gap-6">

<StatCard

title="Imóveis"

value="482"

subtitle="27 captados este mês"

icon={<Home size={26}/>}

/>

<StatCard

title="Clientes"

value="326"

subtitle="18 novos"

icon={<Users size={26}/>}

/>

<StatCard

title="Empreendimentos"

value="41"

subtitle="12 ativos"

icon={<Building2 size={26}/>}

/>

<StatCard

title="VGV"

value="R$ 48,5 Mi"

subtitle="Carteira"

icon={<DollarSign size={26}/>}

/>

</div>

);

}