import React, { useEffect, useState }  from "react";
import { View, FlatList } from "react-native";

import { ListDivider } from "../ListDivider";
import { Guild, GuildProps } from "../Guild";
import { Load } from "../Load";

import { styles } from "./styles";
import { api } from "../../services/api";

type Props = {
  handleGuildSelected: (guild: GuildProps) => void;
};

export function Guilds({ handleGuildSelected }: Props) {
  const [guilds, setGuilds] = useState<GuildProps[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchGuilds() {
    try {
      const response = await api.get('/users/@me/guilds');
      setGuilds(response.data);
    } catch {
      throw new Error("Não foi possivel carregar as Guilds");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchGuilds();
  },[])

  return (
    <View style={styles.container}>
      {loading ? (
        <Load />
      ) : (
        <FlatList
          data={guilds}
          style={styles.guilds}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <ListDivider isCentered />}
          ListHeaderComponent={() => <ListDivider isCentered />}
          renderItem={({ item }) => (
            <Guild data={item} onPress={() => handleGuildSelected(item)} />
          )}
          contentContainerStyle={{ paddingBottom: 69, paddingTop: 103 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
