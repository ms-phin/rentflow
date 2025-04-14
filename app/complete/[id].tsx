import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, CheckCircle, AlertCircle } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import { formatDate, formatISO } from "@/utils/date";
import { CustomDatePicker } from "@/components/CustomDatePicker";

export default function CompleteRentalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { properties, fetchProperties, updateRental } = usePropertiesStore();

  const [endDate, setEndDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  // Find the rental, unit and property
  let rental;
  let unit;
  let property;

  for (const p of properties) {
    for (const u of p.units) {
      const foundRental = u.rentals.find((r) => r.id === id);
      if (foundRental) {
        rental = foundRental;
        unit = u;
        property = p;
        break;
      }
    }
    if (rental) break;
  }

  if (!rental || !unit || !property) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Rental not found</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Set initial end date from rental
  useEffect(() => {
    if (rental) {
      setEndDate(new Date());
    }
  }, [rental]);

  const handleDateChange = (date: Date) => {
    setEndDate(date);
    setShowDatePicker(false);
  };

  const handleCompleteRental = () => {
    if (isSubmitting) return;

    // Validate end date is not in the future
    const today = new Date();
    if (endDate > today) {
      Alert.alert("Invalid Date", "End date cannot be in the future");
      return;
    }

    // Validate end date is not before start date
    const startDate = new Date(rental.startDate);
    if (endDate < startDate) {
      Alert.alert("Invalid Date", "End date cannot be before the start date");
      return;
    }

    setIsSubmitting(true);

    // Update the rental
    const updatedRental = {
      ...rental,
      endDate: formatISO(endDate),
      status: "completed" as const,
      notes:
        notes.length > 0
          ? `${
              rental.notes ? rental.notes + "\n\n" : ""
            }Completed early: ${notes}`
          : rental.notes,
    };

    // In a real app, this would be an API call
    setTimeout(() => {
      updateRental(property.id, unit.id, updatedRental);
      setIsSubmitting(false);
      Alert.alert(
        "Rental Completed",
        "The rental has been marked as completed",
        [
          {
            text: "OK",
            onPress: () => router.replace(`/units/${unit.id}`),
          },
        ]
      );
    }, 1000);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Complete Rental",
        }}
      />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Rental Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Unit:</Text>
                <Text style={styles.infoValue}>{unit.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Property:</Text>
                <Text style={styles.infoValue}>{property.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Start Date:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(rental.startDate)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Original End Date:</Text>
                <Text style={styles.infoValue}>
                  {formatDate(rental.endDate)}
                </Text>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Complete Rental Early</Text>
              <Text style={styles.sectionDescription}>
                You are about to mark this rental as completed before the
                scheduled end date.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Actual End Date</Text>
                <Pressable
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                  <Calendar size={20} color={colors.darkGray} />
                </Pressable>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notes (Optional)</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Add notes about early completion..."
                  placeholderTextColor={colors.gray}
                  multiline
                  numberOfLines={4}
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <View style={styles.warningBox}>
                <AlertCircle size={20} color={colors.warning} />
                <Text style={styles.warningText}>
                  This action cannot be undone. The unit will be marked as
                  available after completion.
                </Text>
              </View>

              <Pressable
                style={[
                  styles.completeButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleCompleteRental}
                disabled={isSubmitting}
              >
                <CheckCircle size={20} color={colors.white} />
                <Text style={styles.completeButtonText}>
                  {isSubmitting ? "Processing..." : "Complete Rental"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
          <CustomDatePicker
            value={endDate}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(rental.startDate)}
            onClose={() => setShowDatePicker(false)}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...shadows.medium,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
  },
  formSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    ...shadows.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.dark,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.dark,
  },
  textArea: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: 16,
    color: colors.dark,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: `${colors.warning}15`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  warningText: {
    fontSize: 14,
    color: colors.darkGray,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.dark,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
});
