import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const height = Dimensions.get('window').height;

export const EmptyListComponent = () => {
    return (
        <View
            style={styles.root}
        >
            <Text>No requests found</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        height: height / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
