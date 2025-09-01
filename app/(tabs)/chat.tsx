import BottomMenu from "@/components/BottomMenu";
import { getSocket, initSocket } from "@/utils/socket";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "./context/authContext";

export default function ChatScreen() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!user) return;
    const socket = initSocket(user);

    socket?.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket?.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const socket = getSocket();
    if (!socket) return;

    const msg = {
      text: message,
      username: user?.login,
      userId: user?.id,
      avatar: user?.avatar || null,
      timestamp: new Date(),
      replyTo: replyTo ? { id: replyTo.timestamp, text: replyTo.text, username: replyTo.username } : null,
    };

    socket.emit("send_message", msg);
    setMessage("");
    setReplyTo(null);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwn = item.userId === user?.id;
    const avatarSource = item.avatar
      ? { uri: item.avatar }
      : require("@/assets/images/avatar_man.png");

    const myAvatarSource = user?.avatar
      ? { uri: user.avatar }
      : require("@/assets/images/avatar_man.png");

    return (
      <TouchableOpacity
        onLongPress={() => setReplyTo(item)}
        style={[styles.messageRow, isOwn ? styles.rowRight : styles.rowLeft]}
      >
        {!isOwn && <Image source={avatarSource} style={styles.avatar} />}

        <View style={[styles.messageContainer, isOwn ? styles.messageRight : styles.messageLeft]}>
          <Text style={styles.username}>{item.username || (isOwn ? user?.login : "Пользователь")}</Text>

          {item.replyTo && (
            <View style={styles.replyContainer}>
              <Text style={styles.replyUsername}>{item.replyTo.username}</Text>
              <Text style={styles.replyText}>{item.replyTo.text}</Text>
            </View>
          )}

          <Text style={styles.messageText}>{item.text}</Text>
        </View>

        {isOwn && <Image source={myAvatarSource} style={styles.avatar} />}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", marginTop: 20 }}>
          <Text style={styles.title}>Общий чат</Text>
          <View style={{ flex: 1 }}>
            {/* Сообщения */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.timestamp.toString()}
              renderItem={renderMessage}
              contentContainerStyle={{ padding: 10, paddingBottom: 120 }} // отступ для поля ввода и меню
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Ответ на сообщение */}
            {replyTo && (
              <View style={styles.replyingContainer}>
                <Text style={styles.replyingText}>Ответ на: {replyTo.text}</Text>
                <TouchableOpacity onPress={() => setReplyTo(null)}>
                  <Ionicons name="close" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            )}

            {/* Поле ввода */}
            <View style={styles.inputWrapper}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Написать сообщение"
                style={styles.input}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Ionicons name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Нижнее меню фиксировано снизу */}
      <BottomMenu />
    </>
  );
}

const styles = StyleSheet.create({
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 5 },
    title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    marginTop: 16,
  },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 5 },
  messageContainer: { maxWidth: "70%", padding: 10, borderRadius: 15 },
  // Сообщения других пользователей (тёмные)
  messageLeft: { backgroundColor: "#041029", borderTopLeftRadius: 0 },
  // Свои сообщения (зелёные)
  messageRight: { backgroundColor: "#00796b", borderTopRightRadius: 0 },
  username: { fontSize: 12, color: "#fff", marginBottom: 2, fontWeight: "bold" },
  messageText: { color: "#fff" },
  inputWrapper: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
  },
  sendButton: { backgroundColor: "#00796b", borderRadius: 25, padding: 10 },
  replyContainer: { backgroundColor: "#555", padding: 5, borderLeftWidth: 2, borderLeftColor: "#fff", marginBottom: 5 },
  replyUsername: { fontWeight: "bold", fontSize: 11, color: "#fff" },
  replyText: { fontSize: 12, color: "#eee" },
  replyingContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#eee", padding: 5, borderTopWidth: 1, borderColor: "#ccc" },
  replyingText: { flex: 1, fontSize: 12, color: "#333" },
});
