"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  EditIcon,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { UserService } from "@/hooks/user-hook";
import { UserEditModal } from "./user-form";
import { UserViewModal } from "./user-view";

export function UserList() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const users = await UserService.getUsers();
      setUsersData(users);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async () => {
    setIsLoading(true);
    fetchUsers();
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(userId);

    try {
      await UserService.deleteUser(userId);

      const updatedUsers = usersData.filter((user) => user.id !== userId);
      setUsersData(updatedUsers);

      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      toast.error("Erro ao excluir usuário. Tente novamente.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredUsers = usersData.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>
            Gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <div className="relative flex-1 sm:max-w-sm">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button onClick={handleCreateUser} className="gap-2">
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Data de Entrada</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={"/placeholder.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {/* Modal de Visualização */}
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EyeIcon className="h-4 w-4" />
                                <span className="sr-only">Ver detalhes</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                              <SheetHeader>
                                <SheetTitle>Detalhes do Usuário</SheetTitle>
                                <SheetDescription>
                                  Informações completas do usuário
                                </SheetDescription>
                              </SheetHeader>

                              <UserViewModal user={user} />

                              <SheetFooter>
                                <SheetClose asChild>
                                  <Button variant="outline">Fechar</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}>
                            <EditIcon className="h-4 w-4" />
                            <span className="sr-only">Editar pedido</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting === user.id}
                            onClick={() => setUserToEdit(user)}>
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Excluir pedido</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Criar Novo Usuário</SheetTitle>
            <SheetDescription>
              Preencha as informações para criar um novo usuário
            </SheetDescription>
          </SheetHeader>
          <UserEditModal
            onSave={handleSaveUser}
          />
        </SheetContent>
      </Sheet>

      {/* Modal de Edição */}
      <Sheet open={isCreateModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Editar Usuário</SheetTitle>
            <SheetDescription>Editando informações do usuário</SheetDescription>
          </SheetHeader>

          <UserEditModal
            user={userToEdit}
            onSave={handleSaveUser}
          />
        </SheetContent>
      </Sheet>

      {/* Modal de Confirmação de Exclusão */}
      <Sheet open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Confirmar Exclusão</SheetTitle>
            <SheetDescription>
              Tem certeza que deseja excluir este pedido?
            </SheetDescription>
          </SheetHeader>

          {userToDelete && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <p>
                    <strong>Nome:</strong> {userToDelete.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {userToDelete.email}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  ⚠️ Esta ação não pode ser desfeita. O usuário será removido
                  permanentemente do sistema.
                </p>
              </div>
            </div>
          )}

          <SheetFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setUserToDelete(null)}
              disabled={isDeleting === userToDelete?.id}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete.id);
                  setUserToDelete(null);
                }
              }}
              disabled={isDeleting === userToDelete?.id}>
              {isDeleting === userToDelete?.id ? "Excluindo..." : "Excluir Pedido"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
