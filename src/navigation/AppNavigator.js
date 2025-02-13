import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import TransactionScreen from "../screens/TransactionsScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Transactions" component={TransactionScreen} />
                <Stack.Screen name="Add Transaction" component={AddTransactionScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
