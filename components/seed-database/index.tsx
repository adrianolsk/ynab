import { View, Text } from "react-native";
import React from "react";
import { useDatabaseSeed } from "@/hooks/use-database-seed.hook";

const SeedDatabase = () => {
  useDatabaseSeed(true);
  return null;
};

export default SeedDatabase;
