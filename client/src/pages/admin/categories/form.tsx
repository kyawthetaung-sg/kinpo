import { createCategory, getCategory, updateCategory } from "@/api/category";
import InputField from "@/components/shared/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type FormValues = {
  name: string;
};

const Form = () => {
  const { id } = useParams();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const fetchCategory = async () => {
    if (id) {
      try {
        const data = await getCategory(id);
        reset({ name: data.name });
      } catch (error) {
        toast.error("Something went wrong.");
        console.error("Failed to fetch category", error);
      }
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let response;
      if (id) {
        response = await updateCategory(id, data);
      } else {
        response = await createCategory(data);
      }

      navigate("/admin/categories", {
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
            <div className="flex gap-1">
              <Button type="button" onClick={() => navigate("/admin/categories")}>
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
