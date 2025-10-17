import { deleteGame, getGames } from "@/api/game";
import ActionDropdown from "@/components/shared/ActionDropdown";
import DataTable from "@/components/shared/DataTable";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Game } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const location = useLocation();
  const message = location.state?.message;
  const [games, setGames] = useState<Game[]>([]);
  const { setIsLoading } = useLoading();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const data = await getGames();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games", error);
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
    if (selectedGameId) {
      const res = await deleteGame(selectedGameId);
      toast.success(res.message);
      fetchGames();
      setSelectedGameId(null);
      setOpenDialog(false);
    }
  };

  const columns: ColumnDef<Game>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category.name",
      header: "Category",
    },
    {
      accessorKey: "url",
      header: "CCTV URL",
    },
    {
      accessorKey: "wsPort",
      header: "Port",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const game = row.original;
        return (
          <ActionDropdown
            onDetail={() => navigate(`/admin/games/${game._id}`)}
            onEdit={() => navigate(`/admin/games/edit/${game._id}`)}
            onDelete={() => {
              setSelectedGameId(game._id);
              setOpenDialog(true);
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => navigate("/admin/games/create")}>
          <Icons.plus />
          Create Game
        </Button>
      </div>

      <DataTable columns={columns} data={games} />

      <DeleteDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
