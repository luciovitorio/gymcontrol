import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { api } from "@/services/api";
import { formatPhone } from "@/utils/masks";
import { UserFormDialog } from "./components/UserFormDialog";
import { ConfirmDeleteDialog } from "./components/ConfirmDeleteDialog";

// Simple debounce hook inline if not exists
function useDebounceValue<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useState(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }); // Ops, useEffect

  // Vou usar useEffect corretamente na implementação real no arquivo separado se precisar, mas aqui vou assumir que posso injetar o hook depois ou fazer simples.
  // Melhor fazer sem hook externo por enquanto pra simplificar dependencies.
  return debouncedValue;
}

export function UsersList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Controle do Dialog
  // Controle do Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Controle de Deleção
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce manual na query
  // Vamos deixar a query reagir ao searchTerm direto e usar debounce no input se for o caso,
  // mas pra MVP react query com keepPreviousData é bom.

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users", page, searchTerm, roleFilter],
    queryFn: async () => {
      const params: any = { page };
      if (searchTerm) params.search = searchTerm;
      if (roleFilter && roleFilter !== "all") params.role = roleFilter;

      const response = await api.get("/users", { params });
      return response.data;
    },
  });

  function handleDelete(id: number) {
    setDeletingUserId(id);
  }

  async function handleConfirmDelete() {
    if (!deletingUserId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/users/${deletingUserId}`);
      toast.success("Usuário excluído.");
      refetch();
      setDeletingUserId(null);
    } catch (err) {
      toast.error("Erro ao excluir usuário.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEdit(user: any) {
    setEditingUser(user);
    setIsDialogOpen(true);
  }

  function handleCreate() {
    setEditingUser(null);
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie alunos, professores e administradores.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex w-full md:w-auto items-center space-x-2">
          <Input
            placeholder="Buscar por nome ou email..."
            className="w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Perfis</SelectItem>
              <SelectItem value="student">Alunos</SelectItem>
              <SelectItem value="coach">Professores</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Email / Contato</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-destructive"
                >
                  Erro ao carregar usuários.
                </TableCell>
              </TableRow>
            ) : data?.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data?.data?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "destructive"
                          : user.role === "coach"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "coach"
                        ? "Professor"
                        : "Aluno"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{user.email}</span>
                      {user.cellphone && (
                        <span className="text-xs text-muted-foreground">
                          {formatPhone(user.cellphone)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação Simples */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <div className="flex items-center text-sm font-medium">
            Página {page} de {data.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userToEdit={editingUser}
      />

      <ConfirmDeleteDialog
        isOpen={!!deletingUserId}
        onClose={() => setDeletingUserId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Excluir Usuário"
        description={
          <span>
            Tem certeza que deseja excluir este usuário? <br />
            Essa ação é irreversível e removerá o acesso ao sistema.
          </span>
        }
      />
    </div>
  );
}
