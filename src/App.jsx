import Navibar from './components/Navibar';
import ShelfConfigurator from './components/Three';

function App() {
  return (
    <>
      <Navibar />
      <div className="h-20 justify-center">
        kakkaa lumella
      </div>
      <main className="pt-16 p-4 flex justify-center">
        <ShelfConfigurator />
      </main>
    </>
  );
}

export default App;
