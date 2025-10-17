import { getCategories } from "@/api/category";
import { createGame, getGame, updateGame } from "@/api/game";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Category } from "@/types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type FormValues = {
  name: string;
  url: string;
  category: string;
};

const Form = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const fetchGame = async () => {
    if (id) {
      try {
        const data = await getGame(id);
        reset({ name: data.name, url: data.url, category: data.category._id });
      } catch (error) {
        toast.error("Something went wrong.");
        console.error("Failed to fetch game", error);
      }
    }
  };

  const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to load roles.");
        console.error("Categories fetch error", error);
      }
    };

  useEffect(() => {
    fetchGame();
    fetchCategories();
  }, [id]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let response;
      if (id) {
        response = await updateGame(id, data);
      } else {
        response = await createGame(data);
      }

      navigate("/admin/games", {
        state: { message: response.message },
      });
    } catch (err) {
      const error = err as AxiosError<{ errors: Record<string, string[]> }>;
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.entries(serverErrors).forEach(([key, messages]) => {
          toast.error(`${key}: ${messages[0]}`);
        });
      } else {
        toast.error("Please review the problems below.");
      }
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardContent className="py-6">
        <fieldset disabled={isLoading}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              id="name"
              label="name"
              type="name"
              registerProps={register("name", { required: "Name is required" })}
              error={errors.name?.message}
            />
            <InputField
              id="url"
              label="CCTV URL"
              registerProps={register("url", { required: "CCTV URL is required" })}
              error={errors.url?.message}
            />
            <SelectField
              id="category"
              label="Category"
              value={watch("category")}
              options={categories.map((r) => ({
                value: r._id,
                label: r.name,
              }))}
              register={register("category", { required: "Category is required" })}
              error={errors.category?.message}
            />
            <div className="flex gap-1">
              <Button type="button" onClick={() => navigate("/admin/games")}>
                <Icons.arrowLeft />
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Icons.loader2 className="animate-spin" />
                ) : (
                  <Icons.save />
                )}
                Save
              </Button>
            </div>
          </form>
        </fieldset>
      </CardContent>
    </Card>
  );
};

export default Form;
