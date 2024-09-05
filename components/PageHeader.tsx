import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View, ViewProps } from 'react-native';

type PageHeaderProps = {
    leftNode?: JSX.Element;
    rightNode?: JSX.Element;
    headerText?: string;
    handleOnPressLeftNode?: (event: GestureResponderEvent) => void;
    handleOnPressRightNode?: (event: GestureResponderEvent) => void;
    rightContainerStyle?: ViewProps['style'] | null;
    leftContainerStyle?: ViewProps['style'] | null;
};

const PageHeader: React.FC<PageHeaderProps> = ({
    leftNode = null,
    rightNode = null,
    headerText = '',
    handleOnPressLeftNode = null,
    handleOnPressRightNode = null,
    rightContainerStyle = null,
    leftContainerStyle = null,
}) => {
    return (
        <View style={styles.pageHeaderContainer}>
            <Pressable onPress={handleOnPressLeftNode} style={leftContainerStyle || styles.leftItem}>
                {leftNode}
            </Pressable>
            <View style={styles.headerItem}>
                <Text style={styles.headerText}>{headerText}</Text>
            </View>
            <Pressable onPress={handleOnPressRightNode} style={rightContainerStyle || styles.rightItem}>
                {rightNode}
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    pageHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // Equivalent to border-gray-200
    },
    leftItem: {
        flex: 1,
        paddingLeft: 16,
        paddingVertical: 16,
    },
    rightItem: {
        flex: 1,
        paddingRight: 16,
        paddingVertical: 16,
        alignItems: 'flex-end',
    },
    headerItem: {
        flex: 2,
        paddingVertical: 16,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        flexShrink: 1,
    },
});

export default PageHeader;