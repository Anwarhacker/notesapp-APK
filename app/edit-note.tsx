import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function EditNote() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchNote = async () => {
    try {
      console.log("Fetching note with id:", id);
      const response = await fetch(
        `https://noteapp-dazeou3a0-anwarhackers-projects.vercel.app/api/notes/${id}`
      );
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const note: Note = await response.json();
      console.log("Fetched note:", note);
      setTitle(note.title);
      setContent(note.content);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching note:", error);
      Alert.alert("Error", "Failed to load note");
      router.back();
    }
  };

  const updateNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    try {
      const response = await fetch(
        `https://noteapp-dazeou3a0-anwarhackers-projects.vercel.app/api/notes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Note updated successfully");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      Alert.alert("Error", "Failed to update note");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
        Edit Note
      </Text>

      <TextInput
        className="bg-white p-4 rounded-lg mb-4 text-lg"
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="bg-white p-4 rounded-lg mb-4 text-lg flex-1"
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-gray-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white text-lg font-semibold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={updateNote}
        >
          <Text className="text-white text-lg font-semibold">Update</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
