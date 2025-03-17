import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

interface IButtonProps {
    preset?: 'primary' | 'link' | 'disabled' ;
    text: string;
    isLoading?: boolean; 
    onPress: () => void;
}

export const Button = (props: IButtonProps) => {

    const { text, onPress, preset = 'primary', isLoading = false } = props;
    return (
        <Pressable
            style={({ pressed }) => ([
                {
                    transform: [{ scale: pressed ? 0.995 : 1 }],
                },
                styles.base,
                styles[preset],
            ])}
            disabled={preset === 'disabled'}
            onPress={onPress} >
                {
                    isLoading && (
                        <ActivityIndicator color={'grey'} />
                    )
                }
            <Text style={[styles.baseText, styles[`${preset}Text`]]}>{isLoading ? 'Loading' : text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        width: '100%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        columnGap: 16,
    },
    primary: {
        backgroundColor: 'cornflowerblue',
    },
    link: {
        width: '100%',
    },
    disabled: {
        backgroundColor: 'lightgrey',
    },
    baseText: {
        fontSize: 16,
        fontWeight: '700',
    },
    primaryText: {
        color: 'white',
    },
    linkText: {
        color: 'cornflowerblue',
    },
    disabledText: {
        color: 'grey',
    }
});
