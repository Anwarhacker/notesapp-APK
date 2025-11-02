import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    try {
      const response = await fetch("http://10.11.159.55:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        Alert.alert("Success", "Note saved successfully");
        router.back();
        // Refresh notes list after adding
        // This will be handled by the parent component
      } else {
        Alert.alert("Error", "Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note");
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-center mb-6 text-gray-800">
        Add New Note
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
          onPress={saveNote}
        >
          <Text className="text-white text-lg font-semibold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
