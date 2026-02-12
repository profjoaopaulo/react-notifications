import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

export default function NotifeeDemo() {

  // 1. Ouvir interações (cliques nos botões da notificação)
  React.useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.ACTION_PRESS:
          if (detail.pressAction.id === 'aceitar') {
            console.log('Usuário aceitou o convite!');
          }
          break;
      }
    });
  }, []);

  async function displayRichNotification() {
    // Solicitar permissão (Essencial para iOS e Android 13+)
    await notifee.requestPermission();

    // Criar o canal (Exigido pelo Android)
    const channelId = await notifee.createChannel({
      id: 'importante',
      name: 'Alertas Importantes',
      importance: AndroidImportance.HIGH,
    });

    // Exibir a notificação
    await notifee.displayNotification({
      title: 'Novo Convite de Amizade! 🤝',
      body: 'João Silva quer se conectar com você.',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Ícone do app
        color: '#4caf50',
        // Estilo com imagem grande
        style: {
          type: 0, // 0 = BigPictureStyle
          picture: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500',
        },
        // Botões de Ação
        actions: [
          {
            title: 'Aceitar',
            pressAction: { id: 'aceitar' },
          },
          {
            title: 'Recusar',
            pressAction: { id: 'recusar' },
          },
        ],
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
        },
      },
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Disparar Notificação Rica" onPress={displayRichNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
