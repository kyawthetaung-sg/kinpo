import { getUser } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Detail = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User>();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getUser(id);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <Card className="max-w-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <strong>User Name: </strong>
            <span>{user.username}</span>
          </div>
          <div>
            <strong>First Name: </strong>
            <span>{user.first_name}</span>
          </div>
          <div>
            <strong>Last Name: </strong>
            <span>{user.last_name}</span>
          </div>
          <div>
            <strong>Email: </strong>
            <span>{user.email}</span>
          </div>
          <div>
            <strong>Role: </strong>
            <span>{user.role.name}</span>
          </div>
          <div>
            <strong>Created At: </strong>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-1">
          <Button onClick={() => navigate("/admin/users")}>
            <Icons.arrowLeft />
            Back
          </Button>
          <Button onClick={() => navigate(`/admin/users/edit/${user._id}`)}>
            <Icons.pencil />
            Edit User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Detail;
