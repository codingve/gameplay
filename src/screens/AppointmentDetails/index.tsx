import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  ImageBackground,
  Text,
  View,
  FlatList,
  Alert,
  Share,
  Platform,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import * as Linking from "expo-linking";

import { AppointmentProps } from "../../components/Appointment";
import { Member, MemberProps } from "../../components/Member";
import { ListDivider } from "../../components/ListDivider";
import { Background } from "../../components/Background";
import { ListHeader } from "../../components/ListHeader";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Header } from "../../components/Header";
import { Load } from "../../components/Load";

import BannerImg from "../../assets/banner.png";

import { styles } from "./styles";
import { theme } from "../../global/styles/theme";
import { api } from "../../services/api";

type Params = {
  guildSelected: AppointmentProps;
};

type GuildWidget = {
  id: string;
  name: string;
  instant_invite: string;
  members: MemberProps[];
  presence_count: number;
};

export function AppointmentDetails() {
  const route = useRoute();
  const { guildSelected } = route.params as Params;
  const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
  const [loading, setLoading] = useState(true);

  async function fetchGuildWidget() {
    try {
      const response = await api.get(
        `/guilds/${guildSelected.guild.id}/widget.json`
      );
      console.log("response", response);
      setWidget(response.data);
    } catch {
      Alert.alert(
        "Verifique as configurações do servidor. Será que o Widget está habilitado?"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleShareInvitation() {
    console.log("widget", widget);
    // try {
    const message =
      Platform.OS === "ios"
        ? `Junte-se a ${guildSelected.guild.name} para se divertir!`
        : `Junte-se a ${guildSelected.guild.name}! ${widget.instant_invite}`;

    const payload = { message, url: widget.instant_invite };

    await Share.share(payload).then(({ action }) => {
      if (action === Share.sharedAction) console.log("Share was successful");
      else console.log("Share was dismissed");
    });
  }

  function handleOpenGuild() {
    Linking.openURL(widget.instant_invite);
  }

  useEffect(() => {
    fetchGuildWidget();
  }, []);

  return (
    <Background>
      <Header
        title="Detalhes"
        action={
          widget.instant_invite && (
            <BorderlessButton onPress={handleShareInvitation}>
              <Fontisto name="share" size={24} color={theme.colors.primary} />
            </BorderlessButton>
          )
        }
      />

      <ImageBackground source={BannerImg} style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.title}>{guildSelected.guild.name}</Text>

          <Text style={styles.subtitle}>{guildSelected.description} </Text>
        </View>
      </ImageBackground>

      {loading ? (
        <Load />
      ) : (
        <>
          <ListHeader
            title="Jogadores"
            subtitle={`Total ${widget.presence_count}`}
          />

          <FlatList
            data={widget.members}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Member data={item} />}
            ItemSeparatorComponent={() => <ListDivider isCentered />}
            style={styles.members}
          />
        </>
      )}
      
      { widget.instant_invite && (
        <View style={styles.footer}>
          <ButtonIcon title="Entrar na partida" />
        </View>
      )}
    </Background>
  );
}
