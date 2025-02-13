import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { login, setToken } from "../services/api";

export default function LoginScreen({ navigation }) {
    const [username, setUsernameState] = useState("");
    const [password, setPasswordState] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            if (response.data.success) {
                setToken(response.data.token); // Store JWT token
                navigation.replace("Transactions");
            } else {
                setError(response.data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsernameState}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPasswordState}
                value={password}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f0f0f0"
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    error: { color: "red", textAlign: "center" },
});
