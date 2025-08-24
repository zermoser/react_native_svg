import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Credit() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for the star
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for the GitHub button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGitHubPress = async () => {
    const url = "https://github.com/zermoser";
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <View style={styles.container}>
        {/* Background gradient effect */}
        <View style={styles.backgroundGradient} />

        {/* Floating particles */}
        <View style={styles.particlesContainer}>
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  animationDelay: `${Math.random() * 3}s`,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Animated star icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <Text style={styles.starIcon}>⭐</Text>
          </Animated.View>

          {/* Title */}
          <Text style={styles.title} >React Native</Text>
          <Text style={styles.title}>Simple react native svg</Text>

          {/* Creator info */}
          <View style={styles.creatorContainer}>
            <Text style={styles.createdBy}>Created by</Text>
            <Text style={styles.creatorName}>Zermoser</Text>
          </View>

          {/* GitHub button */}
          <Animated.View
            style={[
              styles.githubButtonContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.githubButton}
              onPress={handleGitHubPress}
              activeOpacity={0.8}
            >
              <View style={styles.githubIconContainer}>
                <Text style={styles.githubIcon}>❤️</Text>
              </View>
              <View style={styles.githubTextContainer}>
                <Text style={styles.githubButtonText}>Visit GitHub</Text>
                <Text style={styles.githubUsername}>@zermoser</Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Additional info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Thank you for using this Todo List App!
            </Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>

        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
    position: "relative",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#667eea",
    opacity: 0.9,
  },
  particlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 32,
  },
  starIcon: {
    fontSize: 80,
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  creatorContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 20
  },
  createdBy: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    fontWeight: "300",
  },
  creatorName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  githubButtonContainer: {
    marginBottom: 40,
  },
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d3748",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minWidth: 250,
  },
  githubIconContainer: {
    marginRight: 16,
  },
  githubIcon: {
    fontSize: 32,
  },
  githubTextContainer: {
    flex: 1,
  },
  githubButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  githubUsername: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
  },
  arrowIcon: {
    fontSize: 20,
    color: "#ffffff",
    marginLeft: 12,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "400",
  },
  versionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "300",
  },
});