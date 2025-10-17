import { getCategory } from "@/api/category";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Category } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Detail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category>();
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const fetchCategory = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getCategory(id);
      setCategory(data);
    } catch (error) {
      console.error("Error fetching category", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (!category) {
    return <div>No category data found</div>;
  }

  return (
    <Card className="max-w-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <strong>Name: </strong>
            <span>{category.name}</span>
          </div>
          <div>
            <strong>Created At: </strong>
            <span>{new Date(category.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-1">
          <Button onClick={() => navigate("/admin/categories")}>
            <Icons.arrowLeft />
            Back
          </Button>
          <Button
            onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
          >
            <Icons.pencil />
            Edit Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Detail;
