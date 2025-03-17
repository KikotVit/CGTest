import React from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Button } from '@/components/button/button';
import { Proposal, Request } from '@/screens/types';

interface IProposalModalProps {
  visible: boolean;
  request: Request | null;
  onClose: () => void;
  onSubmit: (proposal: Proposal) => Promise<void>;
}

export const ProposalModal: React.FC<IProposalModalProps> = ({
    visible,
    request,
    onClose,
    onSubmit,
}) => {
    const [price, setPrice] = React.useState('');
    const [deadline, setDeadline] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        if (!price || !deadline) return;

        setIsLoading(true);
        try {
            await onSubmit({
                price: parseFloat(price),
                deadline,
                comment,
            });
            setPrice('');
            setDeadline('');
            setComment('');
        } catch (error) {
            console.error('Error in ProposalModal:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitEnabled = price && deadline && !isLoading;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType='fade'
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                {request && (
                    <View style={styles.modalContent}>
                        <Text style={styles.detailsTitle}>Request Details</Text>
                        <Text>Description: {request.description}</Text>
                        <Text>Category: {request.selectedCategory}</Text>
                        {request.photoUrl && (
                            <Image
                                source={{ uri: request.photoUrl }}
                                style={styles.detailsImage}
                            />
                        )}

                        <Text style={styles.formTitle}>Submit Your Proposal</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Price'
                            value={price}
                            onChangeText={setPrice}
                            keyboardType='numeric'
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Deadline (e.g., 2025-03-20)'
                            value={deadline}
                            onChangeText={setDeadline}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Comment'
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />

                        <Button
                            text='Submit Proposal'
                            onPress={handleSubmit}
                            preset={isSubmitEnabled ? 'primary' : 'disabled'}
                            isLoading={isLoading}
                        />
                        <Button text='Close' onPress={onClose} preset='link' />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        width: '90%',
        maxHeight: '80%',
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 8,
    },
    detailsImage: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        borderRadius: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 8,
        borderRadius: 4,
    },
});