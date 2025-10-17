import { deleteCategory, getCategories } from "@/api/category";
import ActionDropdown from "@/components/shared/ActionDropdown";
import DataTable from "@/components/shared/DataTable";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const location = useLocation();
  const message = location.state?.message;
  const [categories, setCategories] = useState<Category[]>([]);
  const { setIsLoading } = useLoading();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
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
    if (selectedCategoryId) {
      const res = await deleteCategory(selectedCategoryId);
      toast.success(res.message);
      fetchCategories();
      setSelectedCategoryId(null);
      setOpenDialog(false);
    }
  };

  const columns: ColumnDef<Category>[] = [
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
        const category = row.original;
        return (
          <ActionDropdown
            onDetail={() => navigate(`/admin/categories/${category._id}`)}
            onEdit={() => navigate(`/admin/categories/edit/${category._id}`)}
            onDelete={() => {
              setSelectedCategoryId(category._id);
              setOpenDialog(true);
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate("/admin/categories/create")}>
          <Icons.plus />
          Create Category
        </Button>
      </div>

      <DataTable columns={columns} data={categories} />

      <DeleteDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
