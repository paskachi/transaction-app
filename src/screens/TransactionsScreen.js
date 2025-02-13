import React, { useEffect, useState } from "react";
import { View, FlatList, Button, StyleSheet, Text } from "react-native";
import { getTransactions } from "../services/api"; // API import
import TransactionItem from "../components/TransactionItem";

export default function TransactionScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions();
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <TransactionItem transaction={item} />}
                />
            )}
            <Button
                title="Add Transaction"
                onPress={() => navigation.navigate("Add Transaction")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});
