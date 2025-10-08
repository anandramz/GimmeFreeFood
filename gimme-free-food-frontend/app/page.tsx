import { auth0 } from "../lib/auth0";
import HomeClient from "./HomeClient";

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    return <HomeClient />;
  }

  return (
    <main className="min-h-screen bg-[#7BAFD4] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Your free food alerts are all set up
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/preferences" 
              className="bg-white text-[#7BAFD4] px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-md hover:shadow-lg"
            >
              Manage Preferences
            </a>
            <a 
              href="/auth/logout" 
              className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold border-2 border-white hover:bg-white/30 transition-all shadow-md hover:shadow-lg"
            >
              Log Out
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
