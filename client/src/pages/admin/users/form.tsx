import { getRoles } from "@/api/role";
import { createUser, getUser, updateUser } from "@/api/user";
import InputField from "@/components/shared/InputField";
import SelectField from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useLoading } from "@/contexts/LoadingContext";
import { Role } from "@/types";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type FormValues = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  role: string;
};

const Form = () => {
  const { id } = useParams();
  const [roles, setRoles] = useState<Role[]>([]);
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const fetchUser = async () => {
    if (id) {
      try {
        const data = await getUser(id);
        reset({
          username: data.username,
          email: data.email,
          password: "",
          password_confirmation: "",
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role._id,
        });
      } catch (error) {
        toast.error("Something went wrong.");
        console.error("Failed to fetch user", error);
      }
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Failed to load roles.");
      console.error("Roles fetch error", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      let response;
      if (id) {
        response = await updateUser(id, data);
      } else {
        response = await createUser(data);
      }

      navigate("/admin/users", {
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
    <Card className="max-w-3xl">
      <CardContent className="py-6">
        <fieldset disabled={isLoading}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              id="username"
              label="Username"
              registerProps={register("username", { required: "Username is required" })}
              error={errors.username?.message}
            />
            <InputField
              id="email"
              label="Email"
              registerProps={register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              registerProps={register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />
            <InputField
              id="password_confirmation"
              label="Password Confirmation"
              type="password"
              registerProps={register("password_confirmation")}
              error={errors.password_confirmation?.message}
            />
            <InputField
              id="first_name"
              label="First Name"
              registerProps={register("first_name", { required: "First Name is required" })}
              error={errors.first_name?.message}
            />
            <InputField
              id="last_name"
              label="Last Name"
              registerProps={register("last_name")}
              error={errors.last_name?.message}
            />
            <SelectField
              id="role"
              label="Role"
              value={watch("role")}
              options={roles.map((r) => ({
                value: r._id,
                label: r.name,
              }))}
              register={register("role", { required: "Role is required" })}
              error={errors.role?.message}
            />
            <div className="flex gap-1">
              <Button type="button" onClick={() => navigate("/admin/users")}>
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
