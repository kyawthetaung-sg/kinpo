import { deleteUser, getUsers } from "@/api/user";
import ActionDropdown from "@/components/shared/ActionDropdown";
import DataTable from "@/components/shared/DataTable";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const location = useLocation();
  const message = location.state?.message;
  const [users, setUsers] = useState<User[]>([]);
  const { setIsLoading } = useLoading();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      window.history.replaceState({}, document.title);
    }
  }, [message]);

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      const res = await deleteUser(selectedUserId);
      toast.success(res.message);
      fetchUsers();
      setSelectedUserId(null);
      setOpenDialog(false);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "first_name",
      header: "First Name",
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role.name",
      header: "Role",
      cell: ({ row }) => row.original.role?.name ?? "-",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const rawDate = row.original.created_at;
        const date = new Date(rawDate);
        const formattedDate = `${date.toLocaleDateString()}`;
        return formattedDate;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <ActionDropdown
            onDetail={() => navigate(`/admin/users/${user._id}`)}
            onEdit={() => navigate(`/admin/users/edit/${user._id}`)}
            onDelete={() => {
              setSelectedUserId(user._id);
              setOpenDialog(true);
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate("/admin/users/create")}>
          <Icons.plus />
          Create User
        </Button>
      </div>

      <DataTable columns={columns} data={users} />

      <DeleteDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
