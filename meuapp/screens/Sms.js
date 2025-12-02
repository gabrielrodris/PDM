import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [numero, setNumero] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSending, setIsSending] = useState(false);

  const enviarSMS = async () => {
    if (!numero.trim()) {
      Alert.alert('❌ Erro', 'Por favor, insira um número de telefone.');
      return;
    }

    if (!mensagem.trim()) {
      Alert.alert('❌ Erro', 'Por favor, digite uma mensagem.');
      return;
    }

    setIsSending(true);

    try {
      const isAvailable = await SMS.isAvailableAsync();

      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync(
          [numero.trim()],
          mensagem.trim()
        );

        if (result === 'sent') {
          Alert.alert('✅ Sucesso!', 'SMS enviado com sucesso!', [
            {
              text: 'OK',
              onPress: () => {
                setMensagem('');
                setIsSending(false);
              },
            },
          ]);
        } else {
          Alert.alert('ℹ️ Status', `Status do envio: ${result}`);
          setIsSending(false);
        }
      } else {
        Alert.alert(
          '❌ SMS Indisponível',
          'O serviço de SMS não está disponível neste dispositivo.',
          [{ text: 'OK', onPress: () => setIsSending(false) }]
        );
      }
    } catch (error) {
      Alert.alert(
        '❌ Erro ao Enviar',
        'Não foi possível enviar o SMS. Verifique suas permissões.',
        [{ text: 'OK', onPress: () => setIsSending(false) }]
      );
      console.error('Erro ao enviar SMS:', error);
    }
  };

  const inserirNumeroExemplo = () => {
    setNumero('+5511999999999');
  };

  const inserirMensagemExemplo = () => {
    setMensagem('Olá! Esta é uma mensagem de teste do app SMS Sender. 📱✨');
  };

  const limparFormulario = () => {
    setNumero('');
    setMensagem('');
  };

  const formatarNumero = (text) => {
    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');

    // Formatação básica para Brasil
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  const caracteresRestantes = 160 - mensagem.length;
  const getCaracteresColor = () => {
    if (caracteresRestantes < 0) return '#ff6b6b';
    if (caracteresRestantes < 20) return '#ffd93d';
    return '#4ecdc4';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="chatbubble" size={40} color="#4ecdc4" />
            <Text style={styles.title}>SMS Sender</Text>
            <Text style={styles.subtitle}>
              Envie mensagens diretamente do app
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            {/* Campo Número */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Ionicons name="call" size={18} color="#4ecdc4" />
                <Text style={styles.label}>Número do Destinatário</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: (11) 99999-9999"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={numero}
                  onChangeText={(text) => setNumero(formatarNumero(text))}
                  maxLength={15}
                />
                <TouchableOpacity
                  style={styles.exampleButton}
                  onPress={inserirNumeroExemplo}
                >
                  <Ionicons name="copy" size={16} color="#4ecdc4" />
                  <Text style={styles.exampleButtonText}>Exemplo</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.hint}>
                💡 Use o código do país: +55 para Brasil
              </Text>
            </View>

            {/* Campo Mensagem */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Ionicons name="document-text" size={18} color="#4ecdc4" />
                <Text style={styles.label}>Mensagem</Text>
                <Text
                  style={[styles.charCounter, { color: getCaracteresColor() }]}
                >
                  {caracteresRestantes} caracteres restantes
                </Text>
              </View>

              <View style={styles.messageContainer}>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Digite sua mensagem aqui..."
                  placeholderTextColor="#888"
                  multiline
                  value={mensagem}
                  onChangeText={setMensagem}
                  maxLength={160}
                  textAlignVertical="top"
                />
                <View style={styles.messageActions}>
                  <TouchableOpacity
                    style={styles.exampleButton}
                    onPress={inserirMensagemExemplo}
                  >
                    <Ionicons name="text" size={16} color="#4ecdc4" />
                    <Text style={styles.exampleButtonText}>Exemplo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setMensagem('')}
                  >
                    <Ionicons name="trash" size={16} color="#ff6b6b" />
                    <Text style={styles.clearButtonText}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Barra de progresso dos caracteres */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(mensagem.length / 160) * 100}%`,
                      backgroundColor: getCaracteresColor(),
                    },
                  ]}
                />
              </View>
            </View>

            {/* Informações */}
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Ionicons name="information-circle" size={16} color="#4ecdc4" />
                <Text style={styles.infoText}>
                  SMS padrão suporta até 160 caracteres
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="warning" size={16} color="#ffd93d" />
                <Text style={styles.infoText}>
                  Verifique seu plano de mensagens
                </Text>
              </View>
            </View>
          </View>

          {/* Ações */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.sendButton,
                isSending && styles.sendButtonDisabled,
                (!numero.trim() || !mensagem.trim()) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={enviarSMS}
              disabled={isSending || !numero.trim() || !mensagem.trim()}
            >
              {isSending ? (
                <View style={styles.sendingContainer}>
                  <Ionicons name="time" size={20} color="#ffffff" />
                  <Text style={styles.sendButtonText}>Enviando...</Text>
                </View>
              ) : (
                <View style={styles.sendContainer}>
                  <Ionicons name="send" size={20} color="#ffffff" />
                  <Text style={styles.sendButtonText}>Enviar SMS</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearFormButton}
              onPress={limparFormulario}
            >
              <Ionicons name="refresh" size={16} color="#888" />
              <Text style={styles.clearFormText}>Limpar Formulário</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              📱 As mensagens são enviadas através do app padrão de SMS
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  charCounter: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 'auto',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2d2d44',
    fontSize: 16,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2d2d44',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  exampleButtonText: {
    color: '#4ecdc4',
    fontSize: 12,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  clearButtonText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2d2d44',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    color: '#888',
    fontSize: 12,
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#4ecdc4',
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4ecdc4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearFormButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearFormText: {
    color: '#888',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
