import { Header } from "./_components/Header";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-white dark:bg-black">
      <Header />
      <h1 className="mx-auto pt-20 dark:text-white">Welcome to my Home!</h1>
    </main>
  );
}
