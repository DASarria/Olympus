import { useRouter } from "next/router";
import { useEffect, useState, ComponentType, FC } from "react";

export function withRoleProtection<T extends object>(
  AllowedRoles: string[],
  redirectPath = "/Module1"
) {
  return (WrappedComponent: ComponentType<T>): FC<T> => {
    const ProtectedComponent: FC<T> = (props) => {
      const router = useRouter();
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        //const storedRole = sessionStorage.getItem("role");
        const storedRole = "STUDENT";


        if (!AllowedRoles.includes(storedRole || "")) {
          router.replace(redirectPath);
        } else {
          setLoading(false);
        }
      }, [router]);

      if (loading) return null;

      return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
  };
}
