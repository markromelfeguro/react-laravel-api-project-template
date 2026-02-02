import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import { UserForm } from "../../../features/users";
import { UserService } from "../../../features/users";
import { LoadingSpinner } from "../../../components/ui";
import { notify } from "../../../utils/notify";
import type { User } from "../../../features/users/types/user.types";

const UserConfig = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [userData, setUserData] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode && slug) {
      const fetchUser = async () => {
        try {
          const response = await UserService.getOne(slug);
          if (response?.data) {
            setUserData(response.data);
          }
        } catch (error) {
          notify.error("Intelligence retrieval failed.");
          navigate("/app/user-management");
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [slug, isEditMode, navigate]);

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setValidationErrors({});
    try {
      if (isEditMode && slug) {
        const response = await UserService.update(slug, formData);
        notify.success(response.message);
      } else {
        const response = await UserService.create(formData);
        notify.success(response.message);
      }
      navigate("/app/user-management");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setValidationErrors(error.response.data.errors);
      } else {
        notify.error(error.response?.data?.message || "Infrastructure failure.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-8 pb-20 animate-reveal">

      {isLoading ? (
        <div className="py-40 flex justify-center">
          <LoadingSpinner size="lg" text="Getting user info..." />
        </div>
      ) : (
        <UserForm 
          initialData={userData} 
          onSubmit={handleFormSubmit} 
          onCancel={() => navigate("/app/user-management")}
          isLoading={isSubmitting}
          errors={validationErrors}
        />
      )}
    </div>
  );

  return <MainLayout content={content} />;
};

export default UserConfig;