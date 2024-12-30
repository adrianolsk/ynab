import React from "react";
import { View, StyleSheet } from "react-native";

type StripedProgressBarProps = {
  progress: number; // Progress percentage (0 to 100)
  height?: number; // Height of the progress bar
  stripeColor?: string; // Color of the stripes
  backgroundColor?: string; // Background color of the progress bar
  stripeWidth?: number; // Width of each stripe
};

const StripedProgressBar: React.FC<StripedProgressBarProps> = ({
  height = 4,
  stripeColor = "#555",
  backgroundColor = "#888",
  stripeWidth = 8,
}) => {
  return (
    <View
      style={[styles.container, { height, backgroundColor, width: "100%" }]}
    >
      {/* Striped Background */}
      <View style={[styles.stripesContainer, { height }]}>
        {Array.from({ length: 50 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.stripe,
              {
                left: index * stripeWidth * 2, // Adjust spacing between stripes
                width: stripeWidth,
                backgroundColor: stripeColor,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "gray",
  },
  stripesContainer: {
    position: "absolute",
    // width: "200%", // Ensures enough stripes to cover the area
    flexDirection: "row",
  },
  stripe: {
    position: "absolute",
    top: -10,
    bottom: -10,
    transform: [{ rotate: "45deg" }], // Create diagonal stripes
    // opacity: 0.3,
  },
  progressOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    // borderRadius: 10,
  },
});

export { StripedProgressBar };
