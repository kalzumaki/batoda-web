import Topbar from '@/components/TopBar';
import LoginPage from './login';

const HomePage = () => {
  return (
    <>
    <title>BATODA</title>
      {/* <Topbar/>
    <main className="min-h-screen bg-lightTeal flex flex-col justify-center items-center">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-darkGreen mb-6">
          Welcome to Batoda
        </h1>
        <p className="text-xl text-teal mb-8">
          Modern solutions with a sleek design
        </p>
      </header>

      <section className="flex gap-4">
        <button className="bg-darkGreen text-white py-3 px-6 rounded-lg shadow hover:bg-teal transition-all">
          Get Started
        </button>
        <button className="bg-lightGreen text-white py-3 px-6 rounded-lg shadow hover:bg-teal transition-all">
          Learn More
        </button>
      </section>
    </main> */}
    <LoginPage />
    </>
  );
};

export default HomePage;
