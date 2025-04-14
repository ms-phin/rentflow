import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import { colors } from "@/constants/Colors";
import { X } from "lucide-react-native";

interface CustomDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  onClose: () => void;
}

export function CustomDatePicker({
  value,
  onChange,
  maximumDate,
  minimumDate,
  onClose,
}: CustomDatePickerProps) {
  // Create a simple date picker that works on all platforms
  const currentDate = new Date(value);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate days for the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get month name
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Handle day selection
  const handleDaySelect = (day: number) => {
    const newDate = new Date(year, month, day);

    // Check if date is within allowed range
    if (maximumDate && newDate > maximumDate) {
      return;
    }

    if (minimumDate && newDate < minimumDate) {
      return;
    }

    onChange(newDate);
  };

  // Check if a day is the selected day
  const isSelectedDay = (day: number) => {
    return day === currentDate.getDate();
  };

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Check if a day is disabled (outside of allowed range)
  const isDayDisabled = (day: number) => {
    const dayDate = new Date(year, month, day);

    if (maximumDate && dayDate > maximumDate) {
      return true;
    }

    if (minimumDate && dayDate < minimumDate) {
      return true;
    }

    return false;
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {monthName} {year}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.dark} />
            </Pressable>
          </View>

          <View style={styles.daysContainer}>
            {days.map((day) => (
              <Pressable
                key={day}
                style={[
                  styles.dayButton,
                  isSelectedDay(day) && styles.selectedDay,
                  isToday(day) && styles.today,
                  isDayDisabled(day) && styles.disabledDay,
                ]}
                onPress={() => handleDaySelect(day)}
                disabled={isDayDisabled(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelectedDay(day) && styles.selectedDayText,
                    isDayDisabled(day) && styles.disabledDayText,
                  ]}
                >
                  {day}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    width: "13%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    color: colors.dark,
  },
  selectedDay: {
    backgroundColor: colors.primary,
  },
  selectedDayText: {
    color: colors.white,
    fontWeight: "600",
  },
  today: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: colors.gray,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
});
