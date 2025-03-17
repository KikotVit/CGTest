import React from 'react';
import { View } from 'react-native';
import { ViewStyle } from 'react-native';

interface IScreenProps {
    /**
     * Children components.
     */
    children?: React.ReactNode;

    /**
     * An optional style override useful for padding & margin.
     */
    style?: ViewStyle;

    /**
     * An optional background color
     */
    backgroundColor?: string;
}


export const Screen = (props: IScreenProps) => {

    const style = props.style || {};

    return (
        <View style={[{ flex: 1, padding: 16 }, style]}>
            {props.children}
        </View>
    );
};
