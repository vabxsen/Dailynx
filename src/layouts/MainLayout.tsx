import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;