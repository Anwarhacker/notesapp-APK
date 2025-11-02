import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Note {
  _id: string;
  title: string;
  content: string;
  favorite: boolean;
  createdAt: string;
}

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    console.log("Notes state updated:", notes);
  }, [notes]);

  const fetchNotes = async () => {
    try {
      console.log("Fetching notes...");
      const response = await fetch(
        "https://noteapp-dazeou3a0-anwarhackers-projects.vercel.app/api/notes"
      );
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Fetched data:", data);
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(
        `https://noteapp-dazeou3a0-anwarhackers-projects.vercel.app/api/notes/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== id));
        console.log("Note deleted successfully");
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const response = await fetch(
        `https://noteapp-dazeou3a0-anwarhackers-projects.vercel.app/api/notes/${id}/favorite`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
      } else {
        console.error("Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNote(id) },
    ]);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = !showFavorites || note.favorite;
    return matchesSearch && matchesFavorite;
  });

  const renderNote = ({ item }: { item: Note }) => (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm">
      <View className="flex-row justify-between items-start">
        <TouchableOpacity
          className="flex-1"
          onPress={() => {
            router.push(`/edit-note?id=${item._id}`);
          }}
          onLongPress={() => confirmDelete(item._id)}
        >
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {item.title}
          </Text>
          <Text className="text-gray-600" numberOfLines={2}>
            {item.content}
          </Text>
          <Text className="text-xs text-gray-400 mt-2">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2"
          onPress={() => toggleFavorite(item._id)}
        >
          <Ionicons
            name={item.favorite ? "star" : "star-outline"}
            size={24}
            color={item.favorite ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          className="flex-row items-center bg-white px-4 py-2 rounded-lg"
          onPress={() => setShowFavorites(!showFavorites)}
        >
          <Ionicons
            name="star"
            size={20}
            color={showFavorites ? "#FFD700" : "#ccc"}
          />
          <Text className="ml-2 text-lg">
            {showFavorites ? "Show All" : "Favorites"}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        className="bg-white p-3 rounded-lg mb-4 text-lg"
        placeholder="Search notes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredNotes}
        renderItem={renderNote}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 text-lg">No notes found</Text>
          </View>
        }
      />
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-blue-500 w-14 h-14 rounded-full items-center justify-center"
        onPress={() => {
          router.push("/add-note");
        }}
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
