import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, ClipboardList } from "lucide-react";

export function CoachDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Painel do Professor
        </h2>
        <p className="text-muted-foreground">
          Gerencie suas aulas e acompanhe os alunos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Próxima aula em 1h: CrossFit Basics
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground">
              Inscritos nas suas aulas hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Minha Agenda Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock Agenda */}
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-semibold">08:00 - 09:00</p>
                <p className="text-sm text-muted-foreground">
                  CrossFit Avançado
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Confirmada
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-semibold">10:00 - 11:00</p>
                <p className="text-sm text-muted-foreground">LPO</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Confirmada
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
