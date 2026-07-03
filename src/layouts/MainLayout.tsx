import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-4xl flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
