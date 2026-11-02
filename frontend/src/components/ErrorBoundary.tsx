import React from 'react';
import { Button, Text, View } from 'react-native';
import { colors } from '../styles';

type Props = React.PropsWithChildren;
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.ink, marginBottom: 8 }}>Algo deu errado</Text>
        <Text style={{ color: colors.muted, textAlign: 'center', marginBottom: 18 }}>Recarregue a tela para tentar novamente.</Text>
        <Button title="Tentar novamente" color={colors.primary} onPress={() => this.setState({ hasError: false })} />
      </View>
    );
  }
}
