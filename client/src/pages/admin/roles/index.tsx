import { deleteRole, getRoles } from "@/api/role";
import ActionDropdown from "@/components/shared/ActionDropdown";
import DataTable from "@/components/shared/DataTable";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Role } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const location = useLocation();
  const message = location.state?.message;
  const [roles, setRoles] = useState<Role[]>([]);
  const { setIsLoading } = useLoading();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles", error);
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
    if (selectedRoleId) {
      const res = await deleteRole(selectedRoleId);
      toast.success(res.message);
      fetchRoles();
      setSelectedRoleId(null);
      setOpenDialog(false);
    }
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Name",
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
        const role = row.original;
        return (
          <ActionDropdown
            onDetail={() => navigate(`/admin/roles/${role._id}`)}
            onEdit={() => navigate(`/admin/roles/edit/${role._id}`)}
            onDelete={() => {
              setSelectedRoleId(role._id);
              setOpenDialog(true);
            }}
            disableEdit={role.is_default_admin}
            disableDelete={role.is_default_admin}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate("/admin/roles/create")}>
          <Icons.plus />
          Create Role
        </Button>
      </div>

      <DataTable columns={columns} data={roles} />

      <DeleteDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
