import { useDatabaseSeed } from "@/hooks/use-database-seed.hook";

const SeedDatabase = () => {
  useDatabaseSeed();
  return null;
};

export default SeedDatabase;
