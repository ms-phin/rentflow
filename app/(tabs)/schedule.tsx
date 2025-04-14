import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors, shadows } from "@/constants/Colors";
import { usePropertiesStore } from "@/stores/properties-store";
import { formatDateShort, getMonthDays, isDateInRange } from "@/utils/date";
import { StatusBadge } from "@/components/StatusBadge";
import { Rental, Unit } from "@/types";

export default function ScheduleScreen() {
  const router = useRouter();
  const { properties, fetchProperties } = usePropertiesStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchProperties();
  }, []);

  // Get all units across all properties
  const allUnits = properties.flatMap((property) =>
    property.units.map((unit) => ({
      ...unit,
      propertyName: property.name,
    }))
  );

  // Get month days for the calendar
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthDays = getMonthDays(currentYear, currentMonth);

  // Get month name
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get rentals for the selected date
  const getRentalsForDate = (date: Date) => {
    return allUnits.flatMap((unit) =>
      unit.rentals
        .filter((rental) => {
          const rentalStart = new Date(rental.startDate);
          const rentalEnd = new Date(rental.endDate);
          return isDateInRange(date, rentalStart, rentalEnd);
        })
        .map((rental) => ({
          rental,
          unit,
        }))
    );
  };

  const selectedDateRentals = getRentalsForDate(selectedDate);

  // Get rental status for a specific date and unit
  const getRentalStatusForDateAndUnit = (
    date: Date,
    unit: Unit & { propertyName: string }
  ) => {
    const rental = unit.rentals.find((r) => {
      const startDate = new Date(r.startDate);
      const endDate = new Date(r.endDate);
      return isDateInRange(date, startDate, endDate);
    });
    if (!rental) return null;
    const startDate = new Date(rental.startDate);
    const endDate = new Date(rental.endDate);
    // Check if it's the first day of rental
    if (
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear()
    ) {
      return { status: "start", rental };
    }
    // Check if it's the last day of rental
    if (
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear()
    ) {
      return { status: "end", rental };
    }
    // It's a middle day
    return { status: "middle", rental };
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
      </View>
      <View style={styles.calendarHeader}>
        <Pressable style={styles.navigationButton} onPress={goToPreviousMonth}>
          <ChevronLeft size={24} color={colors.dark} />
        </Pressable>
        <Text style={styles.monthTitle}>
          {monthName} {currentYear}
        </Text>
        <Pressable style={styles.navigationButton} onPress={goToNextMonth}>
          <ChevronRight size={24} color={colors.dark} />
        </Pressable>
      </View>
      <View style={styles.daysOfWeek}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {/* Add empty cells for days before the first day of the month */}
        {Array.from({
          length: new Date(currentYear, currentMonth, 1).getDay(),
        }).map((_, index) => (
          <View key={`empty-start-${index}`} style={styles.emptyCell} />
        ))}
        {/* Render days of the month */}
        {monthDays.map((dateObj) => {
          // CHANGE: Extract the day number from the Date object
          const day = dateObj.getDate();
          // CHANGE: Use the Date object directly instead of creating a new one
          const date = dateObj;

          const hasRentals = allUnits.some((unit) =>
            unit.rentals.some((rental) => {
              const rentalStart = new Date(rental.startDate);
              const rentalEnd = new Date(rental.endDate);
              return isDateInRange(date, rentalStart, rentalEnd);
            })
          );
          return (
            <Pressable
              key={day}
              style={[
                styles.dayCell,
                isToday(date) && styles.todayCell,
                isSelected(date) && styles.selectedCell,
                hasRentals && styles.hasRentalsCell,
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday(date) && styles.todayText,
                  isSelected(date) && styles.selectedText,
                ]}
              >
                {day}
              </Text>
              {hasRentals && <View style={styles.rentalIndicator} />}
            </Pressable>
          );
        })}
        {/* Add empty cells for days after the last day of the month */}
        {Array.from({
          length:
            (7 -
              ((monthDays.length +
                new Date(currentYear, currentMonth, 1).getDay()) %
                7)) %
            7,
        }).map((_, index) => (
          <View key={`empty-end-${index}`} style={styles.emptyCell} />
        ))}
      </View>
      <View style={styles.selectedDateHeader}>
        <Text style={styles.selectedDateTitle}>
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push(`/rentals/new?date=${selectedDate.toISOString()}`)
          }
        >
          <Plus size={18} color={colors.white} />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.rentalsContainer}>
        {selectedDateRentals.length > 0 ? (
          selectedDateRentals.map((item, index) => {
            const { rental, unit } = item;
            const rentalStatus = getRentalStatusForDateAndUnit(
              selectedDate,
              unit
            );
            return (
              <Pressable
                key={`${rental.id}-${index}`}
                style={styles.rentalCard}
                onPress={() => router.push(`/rentals/${rental.id}`)}
              >
                <View style={styles.rentalCardHeader}>
                  <Text style={styles.unitName}>{unit.name}</Text>
                  <StatusBadge
                    status={
                      rentalStatus?.status === "start"
                        ? "available"
                        : rentalStatus?.status === "end"
                        ? "endingSoon"
                        : "occupied"
                    }
                    text={
                      rentalStatus?.status === "start"
                        ? "Check-in"
                        : rentalStatus?.status === "end"
                        ? "Check-out"
                        : "Occupied"
                    }
                  />
                </View>
                <Text style={styles.propertyName}>{unit.propertyName}</Text>
                <View style={styles.rentalDates}>
                  <Text style={styles.dateLabel}>From:</Text>
                  <Text style={styles.dateValue}>
                    {formatDateShort(rental.startDate)}
                  </Text>
                  <Text style={styles.dateLabel}>To:</Text>
                  <Text style={styles.dateValue}>
                    {formatDateShort(rental.endDate)}
                  </Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No rentals for this date</Text>
            <Pressable
              style={styles.emptyStateButton}
              onPress={() =>
                router.push(`/rentals/new?date=${selectedDate.toISOString()}`)
              }
            >
              <Plus size={18} color={colors.white} />
              <Text style={styles.emptyStateButtonText}>Add Rental</Text>
            </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.dark,
  },
  daysOfWeek: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: colors.darkGray,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
  },
  emptyCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
  },
  todayCell: {
    backgroundColor: `${colors.primary}15`,
  },
  selectedCell: {
    backgroundColor: colors.primary,
  },
  hasRentalsCell: {
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    color: colors.dark,
  },
  todayText: {
    fontWeight: "600",
    color: colors.primary,
  },
  selectedText: {
    color: colors.white,
    fontWeight: "600",
  },
  rentalIndicator: {
    position: "absolute",
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  selectedDateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: colors.white,
    fontWeight: "500",
    marginLeft: 6,
  },
  rentalsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rentalCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...shadows.medium,
  },
  rentalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  unitName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.dark,
  },
  propertyName: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 12,
  },
  rentalDates: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 12,
    color: colors.darkGray,
    marginRight: 4,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.dark,
    marginRight: 12,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    ...shadows.small,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 16,
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
