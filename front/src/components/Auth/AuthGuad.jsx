import { useAuth } from "components/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export function AuthGuard({ children }) {
  const { user, initializing, setRedirect } = useAuth();
  const router = useRouter();
  const logged = useSelector((state) => state.user.logged);
  useEffect(() => {
    if (!initializing) {
      //auth is initialized and there is no user
      if (!logged) {
        // remember the page that user tried to access
        setRedirect(router.route);
        // redirect
        router.push("/signin");
      }
    }
  }, [initializing, router, user, setRedirect,logged]);

  /* show loading indicator while the auth provider is still initializing */
  if (initializing) {
    return <h1>Application Loading</h1>;
  }

  // if auth initialized with a valid user show protected page
  if (!initializing && logged) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
