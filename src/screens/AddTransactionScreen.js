import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addTransaction } from "../services/api"; // API import

export default function AddTransactionScreen({ navigation }) {
    const [date, setDate] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!date || !amount || !description) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        try {
            const response = await addTransaction(date, amount, description);
            if (response.data.success) {
                Alert.alert("Success", "Transaction added!");
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to add transaction.");
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
            Alert.alert("Error", "Failed to add transaction.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                onChangeText={setDate}
                value={date}
            />
            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                onChangeText={setAmount}
                value={amount}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                onChangeText={setDescription}
                value={description}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
