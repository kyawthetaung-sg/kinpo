import { getRole } from "@/api/role";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Role } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Detail = () => {
  const { id } = useParams();
  const [role, setRole] = useState<Role>();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const fetchRole = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getRole(id);
      setRole(data);
    } catch (error) {
      console.error("Error fetching role", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  if (!role) {
    return <div>No role data found</div>;
  }

  return (
    <Card className="max-w-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <strong>Name: </strong>
            <span>{role.name}</span>
          </div>
          <div>
            <strong>Created At: </strong>
            <span>{new Date(role.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-1">
          <Button onClick={() => navigate("/admin/roles")}>
            <Icons.arrowLeft />
            Back
          </Button>
          <Button
            onClick={() => navigate(`/admin/roles/edit/${role._id}`)}
            disabled={role.is_default_admin}
          >
            <Icons.pencil />
            Edit Role
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Detail;
