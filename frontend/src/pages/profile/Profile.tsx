import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { formatPhone } from "@/utils/masks";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cellphone: z.string().optional(),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .optional()
    .or(z.literal("")), // Permite string vazia para não alterar a senha
});

type ProfileEvaluated = z.infer<typeof profileSchema>;

export function Profile() {
  const { setAuth, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileEvaluated>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      cellphone: "",
      password: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        // Carrega dados frescos do backend
        const response = await api.get("/users/me");
        form.reset({
          name: response.data.name,
          email: response.data.email,
          cellphone: response.data.cellphone
            ? formatPhone(response.data.cellphone)
            : "",
          password: "",
        });
      } catch (error) {
        toast.error("Erro ao carregar dados do perfil.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [form]);

  async function handleUpdateProfile(data: ProfileEvaluated) {
    try {
      // Remove senha vazia para não enviar
      const payload = {
        ...data,
        cellphone: data.cellphone ? data.cellphone.replace(/\D/g, "") : "",
        password: data.password === "" ? undefined : data.password,
      };

      const response = await api.put("/users/me", payload);

      // Atualiza o store com os novos dados do usuário (mantendo o token atual)
      if (token) {
        setAuth(token, response.data);
      }

      toast.success("Perfil atualizado com sucesso!");

      // Limpa campo de senha após salvar
      form.setValue("password", "");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Erro ao atualizar perfil.");
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e credenciais de acesso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize seus dados de cadastro.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateProfile)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
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
                          placeholder="(00) 00000-0000"
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatPhone(e.target.value));
                          }}
                          value={field.value || ""}
                          maxLength={15}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-4">Segurança</h3>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Deixe em branco para não alterar"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mínimo de 8 caracteres. Só preencha se quiser alterar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.isDirty
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
