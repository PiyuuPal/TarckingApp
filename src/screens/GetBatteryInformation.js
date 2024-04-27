import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Alert } from 'react-native';
import { NativeModules } from 'react-native';

const GetBatteryInformation = () => {
    const [isPowerSavingModeEnabled, setIsPowerSavingModeEnabled] = useState(null);

    useEffect(() => {
        const PowerSavingModeModule = NativeModules.PowerSavingModeModule;
        PowerSavingModeModule.isPowerSavingModeEnabled()
            .then(isEnabled => {
                setIsPowerSavingModeEnabled(isEnabled);
                console.log('battery saver status', isEnabled)
            })
            .catch(error => {
                console.error('Error checking power saving mode:', error);
            });
    }, []);

    useEffect(() => {
        if (isPowerSavingModeEnabled !== null) {
            Alert.alert(
                'Battery Saver Mode',
                `Your device Battery saver mode is ${isPowerSavingModeEnabled ? 'On' : 'Off'}`,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            );
        }
    }, [isPowerSavingModeEnabled]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Your device Battery saver mode {isPowerSavingModeEnabled ? 'On' : 'Off'}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: 'center'
    },
    text: {
        color: 'black',
        fontWeight: 'bold'
    }
})

export default GetBatteryInformation;