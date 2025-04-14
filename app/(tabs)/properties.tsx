import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search, Building2, Home } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import { Property } from "@/types";

export default function PropertiesScreen() {
  const router = useRouter();
  const { properties, fetchProperties } = usePropertiesStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvailableUnitsCount = (property: Property) => {
    return property.units.filter(
      (unit) =>
        !unit.rentals.some(
          (rental) => rental.status === "active" || rental.status === "upcoming"
        )
    ).length;
  };

  const getOccupiedUnitsCount = (property: Property) => {
    return property.units.filter((unit) =>
      unit.rentals.some((rental) => rental.status === "active")
    ).length;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Properties</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/properties/new")}
        >
          <Plus size={20} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.gray}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Pressable
              key={property.id}
              style={styles.propertyCard}
              onPress={() => router.push(`/properties/${property.id}`)}
            >
              {property.image ? (
                <Image
                  source={{ uri: property.image }}
                  style={styles.propertyImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.propertyImagePlaceholder}>
                  <Building2 size={40} color={colors.gray} />
                </View>
              )}
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName}>{property.name}</Text>
                <Text style={styles.propertyAddress}>{property.address}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Home size={16} color={colors.darkGray} />
                    <Text style={styles.statText}>
                      {property.units.length}{" "}
                      {property.units.length === 1 ? "Unit" : "Units"}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: colors.available },
                      ]}
                    />
                    <Text style={styles.statText}>
                      {getAvailableUnitsCount(property)} Available
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: colors.occupied },
                      ]}
                    />
                    <Text style={styles.statText}>
                      {getOccupiedUnitsCount(property)} Occupied
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Building2 size={60} color={colors.gray} />
            <Text style={styles.emptyStateTitle}>No properties found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "Try a different search term"
                : "Add your first property to get started"}
            </Text>
            {!searchQuery && (
              <Pressable
                style={styles.emptyStateButton}
                onPress={() => router.push("/properties/new")}
              >
                <Plus size={18} color={colors.white} />
                <Text style={styles.emptyStateButtonText}>Add Property</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.small,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 48,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: colors.dark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  propertyCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    ...shadows.medium,
  },
  propertyImage: {
    width: 120,
    height: "100%",
  },
  propertyImagePlaceholder: {
    width: 120,
    height: "100%",
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  propertyInfo: {
    flex: 1,
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap", // Allow wrapping
    marginTop: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12, // Use margin instead of dividers
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
    flexShrink: 1, // Allow text to shrink
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: "500",
    marginLeft: 8,
  },
});
