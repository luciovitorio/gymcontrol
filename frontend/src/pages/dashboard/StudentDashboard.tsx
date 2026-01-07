import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Users, CalendarCheck, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Aulas Hoje",
    value: "3",
    icon: CalendarCheck,
    description: "Você tem 3 aulas agendadas",
  },
  {
    title: "Check-ins na Semana",
    value: "4",
    icon: Dumbbell,
    description: "Meta semanal: 4/5",
  },
  {
    title: "Plano Ativo",
    value: "Premium",
    icon: TrendingUp,
    description: "Vence em 15 dias",
  },
  {
    title: "Fila de Espera",
    value: "0",
    icon: Users,
    description: "Nenhuma aula em espera",
  },
];

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Painel do Aluno</h2>
        <p className="text-muted-foreground">
          Acompanhe seus treinos e evolução.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximas Aulas</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Lista de aulas agendadas (Placeholder)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
