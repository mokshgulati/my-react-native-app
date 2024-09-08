import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SomethingWentWrongProps {
    onRetry: () => void;  // A function prop for retrying the failed action
}

export default function SomethingWentWrong({ onRetry }: SomethingWentWrongProps) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Error image */}
                <Image
                    source={require('../assets/images/kid.png')}  // Add an image to the assets folder
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* Error message */}
                <Text style={styles.errorMessage}>Oops! Something went wrong.</Text>

                {/* Retry button */}
                <Pressable onPress={() => onRetry()} style={({ pressed }) => [
                    {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#2F3645',
                    },
                    {
                        borderRadius: 8,
                        padding: 10,
                        paddingHorizontal: 20,
                    }, ,
                ]}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Retry</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    errorMessage: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
});
