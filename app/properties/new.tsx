import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Building2, Home, Plus, X } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

// Simple function to generate unique IDs without using uuid
function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export default function NewPropertyScreen() {
  const router = useRouter();
  const { addProperty } = usePropertiesStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState("residential");
  const [units, setUnits] = useState([
    {
      id: generateId(),
      name: "Unit 1",
      size: "",
      bedrooms: "1",
      bathrooms: "1",
      rent: "",
      rentals: [],
    },
  ]);

  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
  }>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addUnit = () => {
    const newUnit = {
      id: generateId(),
      name: `Unit ${units.length + 1}`,
      size: "",
      bedrooms: "1",
      bathrooms: "1",
      rent: "",
      rentals: [],
    };
    setUnits([...units, newUnit]);
  };

  const removeUnit = (id: string) => {
    if (units.length === 1) {
      Alert.alert("Cannot Remove", "Property must have at least one unit");
      return;
    }
    setUnits(units.filter((unit) => unit.id !== id));
  };

  const updateUnit = (id: string, field: string, value: string) => {
    setUnits(
      units.map((unit) => (unit.id === id ? { ...unit, [field]: value } : unit))
    );
  };

  const validateForm = () => {
    const newErrors: { name?: string; address?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Property name is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newProperty = {
      id: generateId(),
      name,
      address,
      description,
      image,
      type: propertyType,
      units: units.map((unit) => ({
        ...unit,
        rentals: [],
        size: unit.size ? parseInt(unit.size) : 0,
        bedrooms: parseInt(unit.bedrooms),
        bathrooms: parseInt(unit.bathrooms),
        rent: unit.rent ? parseFloat(unit.rent) : 0,
      })),
      createdAt: new Date().toISOString(),
    };

    addProperty(newProperty);
    Alert.alert("Success", "Property added successfully", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.dark} />
          </Pressable>
          <Text style={styles.title}>Add New Property</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>

            <Pressable style={styles.imagePickerContainer} onPress={pickImage}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.propertyImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Building2 size={40} color={colors.gray} />
                  <Text style={styles.imagePlaceholderText}>
                    Tap to add property image
                  </Text>
                </View>
              )}
            </Pressable>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Property Name*</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={name}
                onChangeText={setName}
                placeholder="Enter property name"
                placeholderTextColor={colors.gray}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address*</Text>
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter property address"
                placeholderTextColor={colors.gray}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter property description"
                placeholderTextColor={colors.gray}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.propertyTypeContainer}>
                <Pressable
                  style={[
                    styles.propertyTypeButton,
                    propertyType === "residential" &&
                      styles.propertyTypeButtonActive,
                  ]}
                  onPress={() => setPropertyType("residential")}
                >
                  <Home
                    size={18}
                    color={
                      propertyType === "residential"
                        ? colors.white
                        : colors.dark
                    }
                  />
                  <Text
                    style={[
                      styles.propertyTypeText,
                      propertyType === "residential" &&
                        styles.propertyTypeTextActive,
                    ]}
                  >
                    Residential
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.propertyTypeButton,
                    propertyType === "commercial" &&
                      styles.propertyTypeButtonActive,
                  ]}
                  onPress={() => setPropertyType("commercial")}
                >
                  <Building2
                    size={18}
                    color={
                      propertyType === "commercial" ? colors.white : colors.dark
                    }
                  />
                  <Text
                    style={[
                      styles.propertyTypeText,
                      propertyType === "commercial" &&
                        styles.propertyTypeTextActive,
                    ]}
                  >
                    Commercial
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Units</Text>
              <Pressable style={styles.addUnitButton} onPress={addUnit}>
                <Plus size={16} color={colors.white} />
                <Text style={styles.addUnitButtonText}>Add Unit</Text>
              </Pressable>
            </View>

            {units.map((unit, index) => (
              <View key={unit.id} style={styles.unitCard}>
                <View style={styles.unitHeader}>
                  <Text style={styles.unitTitle}>Unit {index + 1}</Text>
                  <Pressable
                    onPress={() => removeUnit(unit.id)}
                    style={styles.removeUnitButton}
                  >
                    <X size={16} color={colors.error} />
                  </Pressable>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Unit Name</Text>
                  <TextInput
                    style={styles.input}
                    value={unit.name}
                    onChangeText={(value) => updateUnit(unit.id, "name", value)}
                    placeholder="Enter unit name"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                <View style={styles.unitRow}>
                  <View
                    style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                  >
                    <Text style={styles.label}>Size (sq ft)</Text>
                    <TextInput
                      style={styles.input}
                      value={unit.size}
                      onChangeText={(value) =>
                        updateUnit(unit.id, "size", value)
                      }
                      placeholder="Size"
                      placeholderTextColor={colors.gray}
                      keyboardType="numeric"
                    />
                  </View>
                  <View
                    style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
                  >
                    <Text style={styles.label}>Monthly Rent</Text>
                    <TextInput
                      style={styles.input}
                      value={unit.rent}
                      onChangeText={(value) =>
                        updateUnit(unit.id, "rent", value)
                      }
                      placeholder="Rent"
                      placeholderTextColor={colors.gray}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.unitRow}>
                  <View
                    style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                  >
                    <Text style={styles.label}>Bedrooms</Text>
                    <TextInput
                      style={styles.input}
                      value={unit.bedrooms}
                      onChangeText={(value) =>
                        updateUnit(unit.id, "bedrooms", value)
                      }
                      placeholder="Bedrooms"
                      placeholderTextColor={colors.gray}
                      keyboardType="numeric"
                    />
                  </View>
                  <View
                    style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
                  >
                    <Text style={styles.label}>Bathrooms</Text>
                    <TextInput
                      style={styles.input}
                      value={unit.bathrooms}
                      onChangeText={(value) =>
                        updateUnit(unit.id, "bathrooms", value)
                      }
                      placeholder="Bathrooms"
                      placeholderTextColor={colors.gray}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Property</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.small,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 16,
  },
  imagePickerContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.darkGray,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  propertyTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  propertyTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  propertyTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  propertyTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
    marginLeft: 8,
  },
  propertyTypeTextActive: {
    color: colors.white,
  },
  addUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addUnitButtonText: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 6,
  },
  unitCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  removeUnitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGray,
  },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 40,
    ...shadows.medium,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
