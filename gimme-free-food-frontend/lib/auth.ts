'use client';

import { Auth0Client, User } from '@auth0/nextjs-auth0/client';

export const auth0 = new Auth0Client({
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  authorizationParams: {
    redirect_uri: process.env.NEXT_PUBLIC_AUTH0_BASE_URL + '/api/auth/callback',
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true,
});

export const authService = {
  // Login with email/password
  async loginWithCredentials(email: string, password: string) {
    await auth0.loginWithCredentials({
      email,
      password,
      realm: 'Username-Password-Authentication',
    });
  },

  // Social login
  async loginWithSocial(connection: string) {
    await auth0.loginWithPopup({
      authorizationParams: {
        connection,
      },
    });
  },

  // Sign up
  async signup(userData: {
    email: string;
    password: string;
    name: string;
    connection: string;
  }) {
    await auth0.signup(userData);
  },

  // Logout
  async logout() {
    await auth0.logout({
      logoutParams: {
        returnTo: process.env.NEXT_PUBLIC_AUTH0_BASE_URL,
      },
    });
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      return await auth0.getUser();
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await auth0.getUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      return await auth0.getTokenSilently();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },
};

// Auth context and provider
export const AuthContext = React.createContext<{
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}>({
  user: null,
  isLoading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuthenticated = await auth0.isAuthenticated();
        if (isAuthenticated) {
          const user = await auth0.getUser();
          setUser(user);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for authentication state changes
    const subscription = auth0.$subscribe((event, state) => {
      if (event === 'LOGIN' || event === 'LOGOUT') {
        setUser(state.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
