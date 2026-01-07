import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/services/api";
import { formatPhone } from "@/utils/masks";

const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cellphone: z.string().optional(),
  role: z.enum(["admin", "coach", "student"]),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .optional()
    .or(z.literal("")),
});

type UserFormEvaluated = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: any; // Se null, é criação
}

export function UserFormDialog({
  isOpen,
  onClose,
  userToEdit,
}: UserFormDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<UserFormEvaluated>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      cellphone: "",
      role: "student",
      password: "",
    },
  });

  // Reset form quando abrir/fechar ou mudar usuário
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        form.reset({
          name: userToEdit.name,
          email: userToEdit.email,
          cellphone: userToEdit.cellphone
            ? formatPhone(userToEdit.cellphone)
            : "",
          role: userToEdit.role,
          password: "",
        });
      } else {
        form.reset({
          name: "",
          email: "",
          cellphone: "",
          role: "student",
          password: "",
        });
      }
    }
  }, [isOpen, userToEdit, form]);

  async function handleSubmit(data: UserFormEvaluated) {
    try {
      // Clean phone
      const payload = {
        ...data,
        cellphone: data.cellphone
          ? data.cellphone.replace(/\D/g, "")
          : undefined,
        password: data.password === "" ? undefined : data.password,
      };

      if (!userToEdit && !payload.password) {
        form.setError("password", {
          message: "Senha é obrigatória para novos usuários",
        });
        return;
      }

      if (userToEdit) {
        await api.put(`/users/${userToEdit.id}`, payload);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await api.post("/users", payload);
        toast.success("Usuário criado com sucesso!");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Erro ao salvar usuário.";
      toast.error(msg);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {userToEdit ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {userToEdit
              ? "Edite as informações do usuário."
              : "Preencha os dados para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cellphone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(99) 99999-9999"
                        {...field}
                        onChange={(e) =>
                          field.onChange(formatPhone(e.target.value))
                        }
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfil</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Aluno</SelectItem>
                      <SelectItem value="coach">Professor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {userToEdit ? "Nova Senha (Opcional)" : "Senha"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  {!userToEdit && (
                    <FormDescription>Mínimo de 8 caracteres.</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
