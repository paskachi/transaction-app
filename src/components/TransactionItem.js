import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TransactionItem({ transaction }) {
    return (
        <View style={styles.item}>
            <Text>{transaction.date}</Text>
            <Text>{transaction.description}</Text>
            <Text>${transaction.amount}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    item: { padding: 10, borderBottomWidth: 1 },
});
