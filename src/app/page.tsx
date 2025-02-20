import Header from "./Components/Header";
import DashBoard from "./Components/DashBoard";

export default async function Home() {
  return (
      <div className="h-screen overflow-hidden">
        <DashBoard />
      </div>
  );
}
