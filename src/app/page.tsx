import { HomeHeader } from "./_components/HomeHeader";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-white dark:bg-black">
      <HomeHeader />
      <h1 className="mx-auto pt-20 dark:text-white">Welcome to my Home!</h1>
    </main>
  );
}
