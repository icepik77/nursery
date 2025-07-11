import { Stack } from "expo-router";
import { FormProvider } from "./(tabs)/context/formContext";

export default function RootLayout() {
   return (
    <FormProvider>
      <Stack />
    </FormProvider>
  );
}
