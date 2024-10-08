// src/hooks/useAuth.js
import { useAuthenticator } from '@aws-amplify/ui-react';

const useAuth = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const userId = user.userId;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  return userId;
};

export default useAuth;
