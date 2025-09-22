import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
import { getSocket, initSocket } from "@/utils/socket";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "./context/authContext";

export default function ChatScreen() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const messageIndexMap = useRef<{ [key: string]: number }>({});

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

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const socket = getSocket();
    if (!socket) return;

    const msg = {
      id: new Date().getTime().toString(),
      text: message,
      username: user?.login,
      userId: user?.id,
      avatar: user?.avatar || null,
      timestamp: new Date(),
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, username: replyTo.username } : null,
    };

    socket.emit("send_message", msg);
    setMessage("");
    setReplyTo(null);
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isOwn = item.userId === user?.id;
    const avatarSource = item.avatar
      ? { uri: item.avatar }
      : require("@/assets/images/avatar_man.png");

    const myAvatarSource = user?.avatar
      ? { uri: user.avatar }
      : require("@/assets/images/avatar_man.png");

    messageIndexMap.current[item.id] = index;

    return (
      <TouchableOpacity
        onLongPress={() => setReplyTo(item)}
        style={[styles.messageRow, isOwn ? styles.rowRight : styles.rowLeft]}
      >
        {!isOwn && <Image source={avatarSource} style={styles.avatar} />}

        <View style={[styles.messageContainer, isOwn ? styles.messageRight : styles.messageLeft]}>
          <Text style={styles.username}>{item.username || (isOwn ? user?.login : "Пользователь")}</Text>

          {item.replyTo && (
            <TouchableOpacity
              onPress={() => {
                const idx = messageIndexMap.current[item.replyTo.id];
                if (idx !== undefined) {
                  setTimeout(() => {
                    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
                  }, 50);
                }
              }}
              style={styles.replyContainer}
            >
              <Text style={styles.replyUsername}>{item.replyTo.username}</Text>
              <Text style={styles.replyText}>{item.replyTo.text}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.messageText}>{item.text}</Text>
        </View>

        {isOwn && <Image source={myAvatarSource} style={styles.avatar} />}
      </TouchableOpacity>
    );
  };

  // Фильтрация сообщений при поиске
  const filteredMessages = searchQuery
    ? messages.filter(
        (m) =>
          m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.username && m.username.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : messages;

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", marginTop: 20 }}>
        <View style={styles.header}>
          {/* <Text style={styles.title}>Общий чат</Text> */}
          <CustomHeader title="Общий чат"/>
          <TouchableOpacity onPress={() => setSearchActive((prev) => !prev)}>
           <Ionicons
              name="search"
              size={24}
              color="#00796b"
              style={{
                position: 'absolute',
                right: 16,
                top: '10%',
                transform: [{ translateY: -12 }],
              }}
            />
          </TouchableOpacity>
        </View>

        {searchActive && (
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск сообщений..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        )}

        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={filteredMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
          />

          {replyTo && (
            <View style={styles.replyingContainer}>
              <Text style={styles.replyingText}>Ответ на: {replyTo.text}</Text>
              <TouchableOpacity onPress={() => setReplyTo(null)}>
                <Ionicons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.inputWrapper, { marginBottom: keyboardHeight + 80 }]}>
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

      <BottomMenu />
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginBottom: 8 },
  searchInput: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 5,
    marginRight: 20
  },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 5 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 0 },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 5 },
  messageContainer: { maxWidth: "70%", padding: 10, borderRadius: 15 },
  messageLeft: { backgroundColor: "#041029", borderTopLeftRadius: 0 },
  messageRight: { backgroundColor: "#00796b", borderTopRightRadius: 0 },
  username: { fontSize: 12, color: "#fff", marginBottom: 2, fontWeight: "bold" },
  messageText: { color: "#fff" },
  inputWrapper: { flexDirection: "row", padding: 10, marginBottom: 80, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ccc", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, backgroundColor: "#f5f5f5" },
  sendButton: { backgroundColor: "#00796b", borderRadius: 25, padding: 10 },
  replyContainer: { backgroundColor: "#555", padding: 5, borderLeftWidth: 2, borderLeftColor: "#fff", marginBottom: 5 },
  replyUsername: { fontWeight: "bold", fontSize: 11, color: "#fff" },
  replyText: { fontSize: 12, color: "#eee" },
  replyingContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#eee", padding: 5, borderTopWidth: 1, borderColor: "#ccc" },
  replyingText: { flex: 1, fontSize: 12, color: "#333" },
});
