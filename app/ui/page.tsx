import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";

export default function UIPage() {
  return (
    <div
      style={{
        background: "#0F1115",
        minHeight: "100vh",
        padding: 40,
        color: "#fff",
      }}
    >
      <PageHeader
        title="Showroom UI"
        subtitle="Componentes da Dunna Platform"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginTop: 30,
        }}
      >
        <StatCard
          title="VGV"
          value="R$ 48,5 mi"
          growth="+12%"
        />

        <StatCard
          title="Empreendimentos"
          value="48"
        />

        <StatCard
          title="Unidades"
          value="1246"
        />

        <StatCard
          title="Corretores"
          value="22"
        />
      </div>
    </div>
  );
}