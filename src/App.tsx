import AppRouter from "./AppRouter";
import { Toaster } from "@/components/ui/toast";
function App() {
  return (
    <>
      <AppRouter></AppRouter>;
      <Toaster />
    </>
  );
}

export default App;
