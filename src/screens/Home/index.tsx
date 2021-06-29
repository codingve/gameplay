import React, { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Appointment, AppointmentProps } from "../../components/Appointment";
import { CategorySelect } from "../../components/CategorySelect";
import { ListDivider } from "../../components/ListDivider";
import { Background } from "../../components/Background";
import { ListHeader } from "../../components/ListHeader";
import { ButtonAdd } from "../../components/ButtonAdd";
import { Profile } from "../../components/Profile";
import { Load } from "../../components/Load";

import { styles } from "./styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLLECTION_APPOINTMENTS } from "../../configs";

export function Home() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

  function handleCategorySelected(categoryId: string) {
    categoryId === category ? setCategory("") : setCategory(categoryId);
  }

  function handleAppointmentDetails(guildSelected: AppointmentProps) {
    navigation.navigate("AppointmentDetails", { guildSelected });
  }

  function handleAppointmentCreate() {
    navigation.navigate("AppointmentCreate");
  }

  async function loadAppointments() {
    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if (category) {
      setAppointments(storage.filter((item) => item.category === category));
    } else {
      setAppointments(storage);
    }
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [category])
  );

  return (
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate} />
      </View>

      <CategorySelect
        categorySelected={category}
        setCategory={handleCategorySelected}
      />

      {loading ? (
        <Load />
      ) : (
        <>
          <ListHeader
            title="Partidas agendadas"
            subtitle={`Total ${appointments.length}`}
          />

          <FlatList
            data={appointments}
            style={styles.matches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Appointment
                data={item}
                onPress={() => handleAppointmentDetails(item)}
              />
            )}
            ItemSeparatorComponent={() => <ListDivider />}
            contentContainerStyle={{ paddingBottom: 69 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </Background>
  );
}
