import { getGame } from "@/api/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Game } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Detail = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game>();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const fetchGame = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getGame(id);
      setGame(data);
    } catch (error) {
      console.error("Error fetching game", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, []);

  if (!game) {
    return <div>No game data found</div>;
  }

  return (
    <Card className="max-w-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <strong>Name: </strong>
            <span>{game.name}</span>
          </div>
          <div>
            <strong>Created At: </strong>
            <span>{new Date(game.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-1">
          <Button onClick={() => navigate("/admin/games")}>
            <Icons.arrowLeft />
            Back
          </Button>
          <Button
            onClick={() => navigate(`/admin/games/edit/${game._id}`)}
          >
            <Icons.pencil />
            Edit Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Detail;
